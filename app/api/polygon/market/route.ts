// =============================================================================
// POLYGON MARKET INDICES API ENDPOINT
// =============================================================================

import { NextResponse } from "next/server"
import { getMarketIndices } from "@/lib/services/polygon"

export async function GET() {
  const indices = await getMarketIndices()

  if (indices.length === 0) {
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
  }

  return NextResponse.json({ indices })
}
