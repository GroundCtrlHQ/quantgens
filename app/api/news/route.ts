import { type NextRequest, NextResponse } from "next/server"

const EXA_API_KEY = process.env.EXA_API_KEY

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!EXA_API_KEY) {
      console.log("[Quantgens] EXA_API_KEY not configured")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    console.log("[Quantgens] News API: Fetching for query:", query)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "x-api-key": EXA_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `${query} latest news`,
        type: "keyword",
        numResults: 5,
        text: true,
        useAutoprompt: false,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log("[Quantgens] News API: Exa response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[Quantgens] News API: Exa error:", errorText)
      return NextResponse.json({ error: errorText }, { status: response.status })
    }

    const data = await response.json()
    console.log("[Quantgens] News API: Got results:", data.results?.length || 0)

    const articles = (data.results || []).slice(0, 5).map((r: any) => ({
      title: r.title || "Untitled",
      url: r.url,
      snippet: r.text?.slice(0, 200) || r.snippet || "",
      publishedDate: r.publishedDate || null,
    }))

    return NextResponse.json({ articles, query })
  } catch (error: any) {
    console.log("[Quantgens] News API error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
