// =============================================================================
// QUANTOS AI CHAT API
// =============================================================================
// Uses dedicated service layers for Polygon and Exa

import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import {
  consumeStream,
  convertToModelMessages,
  streamText,
  tool,
  type UIMessage,
  type InferUITools,
  validateUIMessages,
  stepCountIs,
} from "ai"
import { z } from "zod"
import { getStockData, getMarketIndices, generateSignalFromStock } from "@/lib/services/polygon"
import { searchNews } from "@/lib/services/exa"

export const maxDuration = 30

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

// -----------------------------------------------------------------------------
// TOOLS
// -----------------------------------------------------------------------------

const getStockDataTool = tool({
  description:
    "Get stock price, change, and market data for a ticker symbol. Use this when users ask about stock prices, performance, or want to analyze a specific stock.",
  inputSchema: z.object({
    ticker: z.string().describe("The stock ticker symbol (e.g., AAPL, TSLA, MSFT)"),
  }),
  async *execute({ ticker }) {
    yield { state: "loading" as const }

    const data = await getStockData(ticker)

    if (!data) {
      yield { state: "error" as const, message: `Could not fetch data for ${ticker}` }
      return
    }

    const signal = generateSignalFromStock(data)

    yield {
      state: "ready" as const,
      ticker: data.ticker,
      price: data.price,
      open: data.open,
      high: data.high,
      low: data.low,
      volume: data.volume,
      change: data.change,
      changePercent: data.changePercent,
      signal: signal.action,
      confidence: Math.round(signal.confidence),
    }
  },
})

const getNewsTool = tool({
  description:
    "Search for recent news articles about a company, stock, or topic. Use this when users want to read news, get updates, or learn more about a company.",
  inputSchema: z.object({
    query: z.string().describe("The search query (e.g., company name, topic, or stock ticker)"),
  }),
  async *execute({ query }) {
    yield { state: "loading" as const }

    const articles = await searchNews(query, 5)

    yield {
      state: "ready" as const,
      query,
      articles: articles.map((a) => ({
        title: a.title,
        url: a.url,
        snippet: a.snippet,
        source: a.source,
        date: a.publishedAt.toISOString(),
      })),
    }
  },
})

const getMarketOverviewTool = tool({
  description:
    "Get an overview of major market indices and their performance. Use when users ask about market conditions or overall market performance.",
  inputSchema: z.object({}),
  async *execute() {
    yield { state: "loading" as const }

    const indices = await getMarketIndices()

    if (indices.length === 0) {
      yield { state: "error" as const, message: "Could not fetch market data" }
      return
    }

    yield {
      state: "ready" as const,
      indices: indices.map((i) => ({
        ticker: i.ticker,
        name: i.name,
        price: i.price,
        change: i.change,
        changePercent: i.changePercent,
      })),
    }
  },
})

const tools = {
  getStockData: getStockDataTool,
  getNews: getNewsTool,
  getMarketOverview: getMarketOverviewTool,
} as const

export type QuantosMessage = UIMessage<never, never, InferUITools<typeof tools>>

// -----------------------------------------------------------------------------
// SYSTEM PROMPT
// -----------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are Quantos AI, an expert quantitative trading co-pilot for the Quantgens platform. You help traders understand:

- Model behavior and parameter tuning (GARCH, LSTM, XGBoost, etc.)
- Causal attribution - explaining WHY models make certain predictions
- Risk analysis and portfolio optimization
- Whale/institutional capital flow patterns
- Backtesting results and overfitting detection
- Strategy drift and performance monitoring

You have access to tools:
- getStockData: Fetch real-time stock data for any ticker (powered by Polygon)
- getNews: Search for recent news about companies or topics (powered by Exa)
- getMarketOverview: Get major market indices performance

Use these tools proactively when users ask about specific stocks, companies, or market conditions. After showing data, provide brief analysis.
Be concise, data-driven, and actionable. Use trading terminology appropriately.`

// -----------------------------------------------------------------------------
// HANDLER
// -----------------------------------------------------------------------------

export async function POST(req: Request) {
  const body = await req.json()

  // Validate messages
  const validatedMessages = await validateUIMessages<QuantosMessage>({
    messages: body.messages,
    tools,
  })

  const result = streamText({
    model: openrouter("google/gemini-2.0-flash-001"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(validatedMessages),
    tools,
    stopWhen: stepCountIs(3),
    abortSignal: req.signal,
    maxOutputTokens: 1000,
  })

  return result.toUIMessageStreamResponse({
    consumeSseStream: consumeStream,
  })
}
