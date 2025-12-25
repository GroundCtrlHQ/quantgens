// =============================================================================
// EXA NEWS API ENDPOINT
// =============================================================================

import { NextResponse } from "next/server"
import { searchNews } from "@/lib/services/exa"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { query, numResults = 5 } = body

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const articles = await searchNews(query, numResults)
    return NextResponse.json({ articles })
  } catch (error) {
    console.error("[Exa API] Error:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
