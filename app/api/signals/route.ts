import { NextResponse } from "next/server"

// Cache to respect Polygon free tier rate limits (5 calls/min)
let cachedData: { signals: Signal[]; timestamp: number } | null = null
const CACHE_DURATION = 180000 // 3 minute cache to be safer with rate limits

interface Signal {
  id: string
  symbol: string
  action: "BUY" | "SELL" | "HOLD"
  price: number
  change: number
  changePercent: number
  confidence: number
  timestamp: string
  volume: number
}

interface PolygonAggResult {
  T: string // ticker
  c: number // close
  o: number // open
  h: number // high
  l: number // low
  v: number // volume
}

const WATCHLIST_TICKERS = ["AAPL", "TSLA", "NVDA", "MSFT"] // Reduced to 4 tickers to stay well under rate limits

// Generate signal based on price movement
function generateSignal(ticker: string, data: PolygonAggResult): Signal {
  const change = data.c - data.o
  const changePercent = (change / data.o) * 100

  let action: "BUY" | "SELL" | "HOLD" = "HOLD"
  let confidence = 50

  if (changePercent > 1.5) {
    action = "BUY"
    confidence = Math.min(95, 60 + Math.abs(changePercent) * 8)
  } else if (changePercent < -1.5) {
    action = "SELL"
    confidence = Math.min(95, 60 + Math.abs(changePercent) * 8)
  } else {
    action = "HOLD"
    confidence = 50 + Math.random() * 20
  }

  return {
    id: ticker,
    symbol: ticker,
    action,
    price: data.c,
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    confidence: Math.round(confidence),
    timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    volume: data.v,
  }
}

export async function GET() {
  try {
    // Return cached data if fresh
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json({ signals: cachedData.signals, cached: true })
    }

    const apiKey = process.env.POLYGON_API_KEY
    if (!apiKey) {
      return NextResponse.json({ signals: getMockSignals(), error: "API key not configured" })
    }

    const signals: Signal[] = []

    for (const ticker of WATCHLIST_TICKERS) {
      try {
        const response = await fetch(
          `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`,
        )

        if (response.status === 403) {
          console.log(`[Quantgens] Rate limited or unauthorized for ${ticker}`)
          continue
        }

        if (response.ok) {
          const data = await response.json()
          if (data.results && data.results.length > 0) {
            const result = data.results[0]
            signals.push(
              generateSignal(ticker, {
                T: ticker,
                c: result.c,
                o: result.o,
                h: result.h,
                l: result.l,
                v: result.v,
              }),
            )
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 200))
      } catch (err) {
        console.log(`[Quantgens] Error fetching ${ticker}:`, err)
      }
    }

    // If we got some data, cache and return
    if (signals.length > 0) {
      signals.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      cachedData = { signals, timestamp: Date.now() }
      return NextResponse.json({ signals, cached: false })
    }

    // Fallback to mock data
    return NextResponse.json({ signals: getMockSignals(), error: "Could not fetch live data" })
  } catch (error) {
    console.error("Polygon API error:", error)
    return NextResponse.json({ signals: getMockSignals(), error: "Failed to fetch live data" })
  }
}

function getMockSignals(): Signal[] {
  return [
    {
      id: "NVDA",
      symbol: "NVDA",
      action: "BUY",
      price: 142.5,
      change: 5.2,
      changePercent: 3.78,
      confidence: 87,
      timestamp: "10:30 AM",
      volume: 45000000,
    },
    {
      id: "TSLA",
      symbol: "TSLA",
      action: "SELL",
      price: 248.3,
      change: -8.4,
      changePercent: -3.27,
      confidence: 72,
      timestamp: "10:28 AM",
      volume: 32000000,
    },
    {
      id: "AAPL",
      symbol: "AAPL",
      action: "HOLD",
      price: 195.2,
      change: 0.85,
      changePercent: 0.44,
      confidence: 58,
      timestamp: "10:25 AM",
      volume: 28000000,
    },
    {
      id: "MSFT",
      symbol: "MSFT",
      action: "BUY",
      price: 425.8,
      change: 12.3,
      changePercent: 2.97,
      confidence: 81,
      timestamp: "10:22 AM",
      volume: 18000000,
    },
  ]
}
