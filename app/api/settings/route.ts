import { NextResponse } from "next/server"
import { getUserSettings, updateUserSettings } from "@/lib/db"

const DEMO_USER_ID = "demo-user"

export async function GET() {
  try {
    const settings = await getUserSettings(DEMO_USER_ID)
    return NextResponse.json(settings)
  } catch (error) {
    console.error("[Quantgens] Failed to fetch settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const settings = await updateUserSettings(DEMO_USER_ID, data)
    return NextResponse.json(settings)
  } catch (error) {
    console.error("[Quantgens] Failed to update settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
