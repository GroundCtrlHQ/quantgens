import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

let sql: ReturnType<typeof neon>
try {
  sql = neon(process.env.DATABASE_URL!)
} catch (e) {
  console.error("[Quantgens] Failed to create Neon client:", e)
}

// GET: Fetch all runs for a user
export async function GET() {
  try {
    if (!sql) {
      console.error("[Quantgens] SQL client not initialized")
      return NextResponse.json({ runs: [], error: "Database connection not available" })
    }

    const userId = "demo-user"
    console.log("[Quantgens] Fetching playground runs for user:", userId)

    const runs = await sql`
      SELECT id, model, parameters, status, final_return, started_at, completed_at
      FROM playground_runs
      WHERE user_id = ${userId}
      ORDER BY started_at DESC
      LIMIT 20
    `

    console.log("[Quantgens] Found runs:", runs.length)
    return NextResponse.json({ runs })
  } catch (error) {
    console.error("[Quantgens] Error fetching runs:", error)
    return NextResponse.json({ runs: [], error: String(error) })
  }
}

// POST: Create a new run
export async function POST(request: Request) {
  try {
    const { model, parameters } = await request.json()
    const userId = "demo-user"
    const id = `run_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Generate simulation data
    const dataPoints = generateSimulationData(model, parameters)
    const finalReturn = dataPoints[dataPoints.length - 1].strategy - 100

    await sql`
      INSERT INTO playground_runs (id, user_id, model, parameters, status, final_return, data_points, started_at, completed_at)
      VALUES (
        ${id},
        ${userId},
        ${model},
        ${JSON.stringify(parameters)},
        'completed',
        ${finalReturn},
        ${JSON.stringify(dataPoints)},
        NOW(),
        NOW()
      )
    `

    return NextResponse.json({
      id,
      model,
      parameters,
      status: "completed",
      finalReturn,
      dataPoints,
      startedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Quantgens] Error creating run:", error)
    return NextResponse.json({ error: "Failed to create run" }, { status: 500 })
  }
}

// DELETE: Delete a run
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Run ID required" }, { status: 400 })
    }

    await sql`DELETE FROM playground_runs WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Quantgens] Error deleting run:", error)
    return NextResponse.json({ error: "Failed to delete run" }, { status: 500 })
  }
}

function generateSimulationData(
  model: string,
  parameters: { lookbackPeriod: number; confidenceLevel: number; learningRate: number; regularization: number },
) {
  const modelMultipliers: Record<string, number> = {
    lstm: 1.35,
    transformer: 1.4,
    garch: 1.15,
    xgboost: 1.25,
    "random-forest": 1.2,
    arima: 1.1,
    "kalman-filter": 1.08,
    "linear-regression": 1.05,
  }

  const baseMultiplier = modelMultipliers[model] || 1.0
  const paramEffect = (parameters.learningRate * 5 + (100 - parameters.confidenceLevel) * 0.02) * baseMultiplier
  const volatility = (100 - parameters.confidenceLevel) * 0.03

  const days = Math.min(parameters.lookbackPeriod, 90)
  const dataPoints = []

  let strategyValue = 100
  let benchmarkValue = 100

  for (let i = 0; i < days; i++) {
    const noise = (Math.random() - 0.5) * volatility
    const trend = Math.sin(i / 15) * 2 + i * paramEffect * 0.01
    const benchmarkNoise = (Math.random() - 0.5) * 1.5

    strategyValue = 100 + trend + noise + i * 0.05 * baseMultiplier
    benchmarkValue = 100 + Math.sin(i / 20) * 1.5 + benchmarkNoise + i * 0.02

    dataPoints.push({
      day: i + 1,
      strategy: Number(strategyValue.toFixed(2)),
      benchmark: Number(benchmarkValue.toFixed(2)),
    })
  }

  return dataPoints
}
