// =============================================================================
// EXA API SERVICE
// =============================================================================
// Dedicated service for Exa.ai news and search API.
// =============================================================================

import type { NewsArticle } from "@/lib/db/types"

const EXA_BASE_URL = "https://api.exa.ai"
const CACHE_DURATION = 300000 // 5 minutes

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

interface ExaSearchResponse {
  results?: Array<{
    id: string
    title: string
    url: string
    text?: string
    publishedDate?: string
    author?: string
  }>
  error?: string
}

// -----------------------------------------------------------------------------
// SEARCH NEWS
// -----------------------------------------------------------------------------

export async function searchNews(query: string, numResults = 5): Promise<NewsArticle[]> {
  const cacheKey = `news:${query.toLowerCase()}`
  const cached = getCached<NewsArticle[]>(cacheKey)
  if (cached) return cached

  const apiKey = process.env.EXA_API_KEY
  if (!apiKey) {
    console.error("[Exa] API key not configured")
    return getFallbackNews(query)
  }

  try {
    const response = await fetch(`${EXA_BASE_URL}/search`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `${query} latest news`,
        type: "keyword",
        numResults,
        text: true,
        useAutoprompt: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[Exa] API error:", response.status, errorText)
      return getFallbackNews(query)
    }

    const data: ExaSearchResponse = await response.json()

    if (!data.results || data.results.length === 0) {
      return getFallbackNews(query)
    }

    const articles: NewsArticle[] = data.results.map((r, idx) => ({
      id: r.id || `exa-${idx}`,
      title: r.title || "Untitled",
      url: r.url,
      snippet: r.text?.slice(0, 200) || "No preview available",
      source: new URL(r.url).hostname.replace("www.", ""),
      publishedAt: r.publishedDate ? new Date(r.publishedDate) : new Date(),
    }))

    setCache(cacheKey, articles)
    return articles
  } catch (error) {
    console.error("[Exa] Fetch error:", error)
    return getFallbackNews(query)
  }
}

// -----------------------------------------------------------------------------
// FALLBACK NEWS (when API fails)
// -----------------------------------------------------------------------------

function getFallbackNews(query: string): NewsArticle[] {
  return [
    {
      id: "fallback-google",
      title: `Search "${query}" on Google News`,
      url: `https://www.google.com/search?q=${encodeURIComponent(query + " stock news")}&tbm=nws`,
      snippet: `Click to search for the latest ${query} news on Google News.`,
      source: "google.com",
      publishedAt: new Date(),
    },
    {
      id: "fallback-yahoo",
      title: `Search "${query}" on Yahoo Finance`,
      url: `https://finance.yahoo.com/quote/${encodeURIComponent(query)}`,
      snippet: `View ${query} stock information and news on Yahoo Finance.`,
      source: "yahoo.com",
      publishedAt: new Date(),
    },
  ]
}

// -----------------------------------------------------------------------------
// COMPANY RESEARCH
// -----------------------------------------------------------------------------

export async function getCompanyResearch(company: string): Promise<NewsArticle[]> {
  return searchNews(`${company} financial analysis earnings report`, 5)
}
