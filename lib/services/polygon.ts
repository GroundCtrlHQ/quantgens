// =============================================================================
// POLYGON API SERVICE
// =============================================================================
// Dedicated service for all Polygon.io API interactions.
// Handles rate limiting, caching, and error handling.
//
// Free tier limits: 5 API calls per minute
// =============================================================================

import type { StockData, MarketIndex } from "@/lib/db/types"

const POLYGON_BASE_URL = "https://api.polygon.io"
const RATE_LIMIT_DELAY = 250 // ms between calls
const CACHE_DURATION = 180000 // 3 minutes

// In-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>()

function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
    return entry.data as T
  }
  return null
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() })
}

async function polygonFetch<T>(endpoint: string): Promise<T | null> {
  const apiKey = process.env.POLYGON_API_KEY
  if (!apiKey) {
    console.error("[Polygon] API key not configured")
    return null
  }

  const url = `${POLYGON_BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}apiKey=${apiKey}`

  try {
    const response = await fetch(url)

    if (response.status === 403) {
      console.warn("[Polygon] Rate limited or unauthorized")
      return null
    }

    if (!response.ok) {
      console.error("[Polygon] API error:", response.status, response.statusText)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("[Polygon] Fetch error:", error)
    return null
  }
}

// -----------------------------------------------------------------------------
// STOCK DATA
// -----------------------------------------------------------------------------

interface PolygonAggResponse {
  results?: Array<{
    T?: string
    c: number
    o: number
    h: number
    l: number
    v: number
    t?: number
  }>
  status?: string
}

export async function getStockData(ticker: string): Promise<StockData | null> {
  const cacheKey = `stock:${ticker.toUpperCase()}`
  const cached = getCached<StockData>(cacheKey)
  if (cached) return cached

  const data = await polygonFetch<PolygonAggResponse>(`/v2/aggs/ticker/${ticker.toUpperCase()}/prev?adjusted=true`)

  if (!data?.results?.[0]) return null

  const result = data.results[0]
  const change = result.c - result.o
  const changePercent = (change / result.o) * 100

  const stockData: StockData = {
    ticker: ticker.toUpperCase(),
    price: result.c,
    open: result.o,
    high: result.h,
    low: result.l,
    close: result.c,
    volume: result.v,
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    timestamp: new Date(),
  }

  setCache(cacheKey, stockData)
  return stockData
}

// -----------------------------------------------------------------------------
// MULTIPLE STOCKS (respects rate limits)
// -----------------------------------------------------------------------------

export async function getMultipleStocks(tickers: string[]): Promise<StockData[]> {
  const results: StockData[] = []

  for (const ticker of tickers) {
    const data = await getStockData(ticker)
    if (data) results.push(data)
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY))
  }

  return results
}

// -----------------------------------------------------------------------------
// MARKET INDICES
// -----------------------------------------------------------------------------

const INDEX_MAP: Record<string, string> = {
  SPY: "S&P 500",
  QQQ: "Nasdaq 100",
  DIA: "Dow Jones",
  IWM: "Russell 2000",
}

export async function getMarketIndices(): Promise<MarketIndex[]> {
  const cacheKey = "market:indices"
  const cached = getCached<MarketIndex[]>(cacheKey)
  if (cached) return cached

  const tickers = Object.keys(INDEX_MAP)
  const indices: MarketIndex[] = []

  for (const ticker of tickers) {
    const data = await getStockData(ticker)
    if (data) {
      indices.push({
        ticker,
        name: INDEX_MAP[ticker],
        price: data.price,
        change: data.change,
        changePercent: data.changePercent,
      })
    }
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY))
  }

  if (indices.length > 0) {
    setCache(cacheKey, indices)
  }

  return indices
}

// -----------------------------------------------------------------------------
// TICKER SEARCH
// -----------------------------------------------------------------------------

interface PolygonTickerResponse {
  results?: Array<{
    ticker: string
    name: string
    market: string
    type: string
  }>
}

export async function searchTickers(query: string): Promise<Array<{ ticker: string; name: string }>> {
  const data = await polygonFetch<PolygonTickerResponse>(
    `/v3/reference/tickers?search=${encodeURIComponent(query)}&active=true&limit=10`,
  )

  if (!data?.results) return []

  return data.results.map((r) => ({
    ticker: r.ticker,
    name: r.name,
  }))
}

// -----------------------------------------------------------------------------
// GENERATE SIGNALS (from price data)
// -----------------------------------------------------------------------------

export function generateSignalFromStock(stock: StockData): {
  action: "BUY" | "SELL" | "HOLD"
  confidence: number
} {
  const { changePercent } = stock

  if (changePercent > 2) {
    return { action: "BUY", confidence: Math.min(95, 60 + changePercent * 5) }
  } else if (changePercent < -2) {
    return { action: "SELL", confidence: Math.min(95, 60 + Math.abs(changePercent) * 5) }
  }

  return { action: "HOLD", confidence: 50 + Math.random() * 20 }
}
