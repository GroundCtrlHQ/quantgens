// =============================================================================
// POLYGON STOCK API ENDPOINT
// =============================================================================

import { NextResponse } from "next/server"
import { getStockData } from "@/lib/services/polygon"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ticker = searchParams.get("ticker")

  if (!ticker) {
    return NextResponse.json({ error: "Ticker is required" }, { status: 400 })
  }

  const data = await getStockData(ticker)

  if (!data) {
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 })
  }

  return NextResponse.json(data)
}
