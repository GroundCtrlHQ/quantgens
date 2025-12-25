// =============================================================================
// DATABASE LAYER - Neon PostgreSQL
// =============================================================================

import { neon } from "@neondatabase/serverless"
import type { User, Strategy, Portfolio, Signal, WatchlistItem, BacktestResult, UserSettings } from "./types"

// Create Neon SQL client
const sql = neon(process.env.DATABASE_URL!)

// -----------------------------------------------------------------------------
// USERS
// -----------------------------------------------------------------------------

export async function getUser(userId: string): Promise<User | null> {
  const rows = await sql`
    SELECT id, email, name, tier, created_at 
    FROM users 
    WHERE id = ${userId}
  `
  if (rows.length === 0) return null

  const user = rows[0]
  const settings = await getUserSettings(userId)

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    tier: user.tier as "free" | "pro" | "enterprise",
    createdAt: new Date(user.created_at),
    settings,
  }
}

export async function createUser(data: {
  email: string
  name: string
  tier?: "free" | "pro" | "enterprise"
}): Promise<User> {
  const rows = await sql`
    INSERT INTO users (email, name, tier)
    VALUES (${data.email}, ${data.name}, ${data.tier || "free"})
    RETURNING id, email, name, tier, created_at
  `
  const user = rows[0]

  // Create default settings
  await sql`
    INSERT INTO user_settings (user_id) VALUES (${user.id})
  `

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    tier: user.tier as "free" | "pro" | "enterprise",
    createdAt: new Date(user.created_at),
  }
}

export async function updateUser(userId: string, data: Partial<User>): Promise<User | null> {
  const updates: string[] = []
  if (data.email) updates.push(`email = '${data.email}'`)
  if (data.name) updates.push(`name = '${data.name}'`)
  if (data.tier) updates.push(`tier = '${data.tier}'`)

  if (updates.length > 0) {
    await sql`
      UPDATE users 
      SET ${sql.unsafe(updates.join(", "))}
      WHERE id = ${userId}
    `
  }

  return getUser(userId)
}

// -----------------------------------------------------------------------------
// STRATEGIES
// -----------------------------------------------------------------------------

export async function getStrategies(userId: string): Promise<Strategy[]> {
  const rows = await sql`
    SELECT * FROM strategies 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `

  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description || "",
    model: row.model as Strategy["model"],
    status: row.status as Strategy["status"],
    accuracy: Number.parseFloat(row.accuracy),
    pnl: Number.parseFloat(row.pnl),
    pnlPercent: Number.parseFloat(row.pnl_percent),
    positions: row.positions,
    riskScore: row.risk_score,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }))
}

export async function getStrategy(strategyId: string): Promise<Strategy | null> {
  const rows = await sql`
    SELECT * FROM strategies WHERE id = ${strategyId}
  `
  if (rows.length === 0) return null

  const row = rows[0]
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description || "",
    model: row.model as Strategy["model"],
    status: row.status as Strategy["status"],
    accuracy: Number.parseFloat(row.accuracy),
    pnl: Number.parseFloat(row.pnl),
    pnlPercent: Number.parseFloat(row.pnl_percent),
    positions: row.positions,
    riskScore: row.risk_score,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

export async function createStrategy(data: Omit<Strategy, "id" | "createdAt" | "updatedAt">): Promise<Strategy> {
  const rows = await sql`
    INSERT INTO strategies (user_id, name, description, model, status, accuracy, pnl, pnl_percent, positions, risk_score)
    VALUES (${data.userId}, ${data.name}, ${data.description}, ${data.model}, ${data.status}, ${data.accuracy}, ${data.pnl}, ${data.pnlPercent}, ${data.positions}, ${data.riskScore})
    RETURNING *
  `

  const row = rows[0]
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description || "",
    model: row.model as Strategy["model"],
    status: row.status as Strategy["status"],
    accuracy: Number.parseFloat(row.accuracy),
    pnl: Number.parseFloat(row.pnl),
    pnlPercent: Number.parseFloat(row.pnl_percent),
    positions: row.positions,
    riskScore: row.risk_score,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

export async function updateStrategy(strategyId: string, data: Partial<Strategy>): Promise<Strategy | null> {
  await sql`
    UPDATE strategies 
    SET 
      name = COALESCE(${data.name}, name),
      description = COALESCE(${data.description}, description),
      model = COALESCE(${data.model}, model),
      status = COALESCE(${data.status}, status),
      accuracy = COALESCE(${data.accuracy}, accuracy),
      pnl = COALESCE(${data.pnl}, pnl),
      pnl_percent = COALESCE(${data.pnlPercent}, pnl_percent),
      positions = COALESCE(${data.positions}, positions),
      risk_score = COALESCE(${data.riskScore}, risk_score),
      updated_at = NOW()
    WHERE id = ${strategyId}
  `

  return getStrategy(strategyId)
}

export async function deleteStrategy(strategyId: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM strategies WHERE id = ${strategyId}
  `
  return true
}

// -----------------------------------------------------------------------------
// PORTFOLIOS
// -----------------------------------------------------------------------------

export async function getPortfolio(userId: string): Promise<Portfolio> {
  const rows = await sql`
    SELECT * FROM portfolios WHERE user_id = ${userId}
  `

  if (rows.length === 0) {
    // Create default portfolio if none exists
    const newRows = await sql`
      INSERT INTO portfolios (user_id, total_value, cash_balance)
      VALUES (${userId}, 100000, 100000)
      RETURNING *
    `
    const row = newRows[0]
    return mapPortfolioRow(row)
  }

  return mapPortfolioRow(rows[0])
}

function mapPortfolioRow(row: Record<string, unknown>): Portfolio {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    totalValue: Number.parseFloat(row.total_value as string),
    cashBalance: Number.parseFloat(row.cash_balance as string),
    dailyPnL: Number.parseFloat(row.daily_pnl as string),
    dailyPnLPercent: Number.parseFloat(row.daily_pnl_percent as string),
    weeklyReturn: Number.parseFloat(row.weekly_return as string),
    monthlyReturn: Number.parseFloat(row.monthly_return as string),
    yearlyReturn: Number.parseFloat(row.yearly_return as string),
    sharpeRatio: Number.parseFloat(row.sharpe_ratio as string),
    sortinoRatio: Number.parseFloat(row.sortino_ratio as string),
    maxDrawdown: Number.parseFloat(row.max_drawdown as string),
    winRate: Number.parseFloat(row.win_rate as string),
    totalTrades: row.total_trades as number,
    updatedAt: new Date(row.updated_at as string),
  }
}

export async function updatePortfolio(userId: string, data: Partial<Portfolio>): Promise<Portfolio> {
  await sql`
    UPDATE portfolios 
    SET 
      total_value = COALESCE(${data.totalValue}, total_value),
      cash_balance = COALESCE(${data.cashBalance}, cash_balance),
      daily_pnl = COALESCE(${data.dailyPnL}, daily_pnl),
      daily_pnl_percent = COALESCE(${data.dailyPnLPercent}, daily_pnl_percent),
      weekly_return = COALESCE(${data.weeklyReturn}, weekly_return),
      monthly_return = COALESCE(${data.monthlyReturn}, monthly_return),
      yearly_return = COALESCE(${data.yearlyReturn}, yearly_return),
      sharpe_ratio = COALESCE(${data.sharpeRatio}, sharpe_ratio),
      sortino_ratio = COALESCE(${data.sortinoRatio}, sortino_ratio),
      max_drawdown = COALESCE(${data.maxDrawdown}, max_drawdown),
      win_rate = COALESCE(${data.winRate}, win_rate),
      total_trades = COALESCE(${data.totalTrades}, total_trades),
      updated_at = NOW()
    WHERE user_id = ${userId}
  `

  return getPortfolio(userId)
}

// -----------------------------------------------------------------------------
// SIGNALS
// -----------------------------------------------------------------------------

export async function getSignals(userId: string, limit = 10): Promise<Signal[]> {
  const rows = await sql`
    SELECT * FROM signals 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `

  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    symbol: row.symbol,
    action: row.action as Signal["action"],
    confidence: row.confidence,
    price: Number.parseFloat(row.price),
    targetPrice: row.target_price ? Number.parseFloat(row.target_price) : null,
    stopLoss: row.stop_loss ? Number.parseFloat(row.stop_loss) : null,
    reasoning: row.reasoning || "",
    source: row.source,
    createdAt: new Date(row.created_at),
  }))
}

export async function createSignal(data: Omit<Signal, "id" | "createdAt">): Promise<Signal> {
  const rows = await sql`
    INSERT INTO signals (user_id, symbol, action, confidence, price, target_price, stop_loss, reasoning, source)
    VALUES (${data.userId}, ${data.symbol}, ${data.action}, ${data.confidence}, ${data.price}, ${data.targetPrice}, ${data.stopLoss}, ${data.reasoning}, ${data.source})
    RETURNING *
  `

  const row = rows[0]
  return {
    id: row.id,
    userId: row.user_id,
    symbol: row.symbol,
    action: row.action as Signal["action"],
    confidence: row.confidence,
    price: Number.parseFloat(row.price),
    targetPrice: row.target_price ? Number.parseFloat(row.target_price) : null,
    stopLoss: row.stop_loss ? Number.parseFloat(row.stop_loss) : null,
    reasoning: row.reasoning || "",
    source: row.source,
    createdAt: new Date(row.created_at),
  }
}

// -----------------------------------------------------------------------------
// WATCHLIST
// -----------------------------------------------------------------------------

export async function getWatchlist(userId: string): Promise<WatchlistItem[]> {
  const rows = await sql`
    SELECT * FROM watchlist 
    WHERE user_id = ${userId}
    ORDER BY added_at DESC
  `

  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    symbol: row.symbol,
    addedAt: new Date(row.added_at),
  }))
}

export async function addToWatchlist(userId: string, symbol: string): Promise<WatchlistItem> {
  const rows = await sql`
    INSERT INTO watchlist (user_id, symbol)
    VALUES (${userId}, ${symbol.toUpperCase()})
    ON CONFLICT (user_id, symbol) DO UPDATE SET added_at = NOW()
    RETURNING *
  `

  const row = rows[0]
  return {
    id: row.id,
    userId: row.user_id,
    symbol: row.symbol,
    addedAt: new Date(row.added_at),
  }
}

export async function removeFromWatchlist(userId: string, symbol: string): Promise<boolean> {
  await sql`
    DELETE FROM watchlist 
    WHERE user_id = ${userId} AND symbol = ${symbol.toUpperCase()}
  `
  return true
}

// -----------------------------------------------------------------------------
// BACKTESTS
// -----------------------------------------------------------------------------

export async function getBacktests(userId: string): Promise<BacktestResult[]> {
  const rows = await sql`
    SELECT * FROM backtest_results 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `

  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    strategyId: row.strategy_id,
    strategyName: row.strategy_name,
    startDate: new Date(row.start_date),
    endDate: new Date(row.end_date),
    initialCapital: Number.parseFloat(row.initial_capital),
    finalValue: row.final_value ? Number.parseFloat(row.final_value) : 0,
    totalReturn: row.total_return ? Number.parseFloat(row.total_return) : 0,
    sharpeRatio: row.sharpe_ratio ? Number.parseFloat(row.sharpe_ratio) : 0,
    sortinoRatio: row.sortino_ratio ? Number.parseFloat(row.sortino_ratio) : 0,
    maxDrawdown: row.max_drawdown ? Number.parseFloat(row.max_drawdown) : 0,
    winRate: row.win_rate ? Number.parseFloat(row.win_rate) : 0,
    totalTrades: row.total_trades || 0,
    status: row.status as BacktestResult["status"],
    createdAt: new Date(row.created_at),
  }))
}

export async function createBacktest(
  data: Omit<BacktestResult, "id" | "createdAt" | "status">,
): Promise<BacktestResult> {
  const rows = await sql`
    INSERT INTO backtest_results (user_id, strategy_id, strategy_name, start_date, end_date, initial_capital)
    VALUES (${data.userId}, ${data.strategyId}, ${data.strategyName}, ${data.startDate.toISOString()}, ${data.endDate.toISOString()}, ${data.initialCapital})
    RETURNING *
  `

  const row = rows[0]
  return {
    id: row.id,
    userId: row.user_id,
    strategyId: row.strategy_id,
    strategyName: row.strategy_name,
    startDate: new Date(row.start_date),
    endDate: new Date(row.end_date),
    initialCapital: Number.parseFloat(row.initial_capital),
    finalValue: 0,
    totalReturn: 0,
    sharpeRatio: 0,
    sortinoRatio: 0,
    maxDrawdown: 0,
    winRate: 0,
    totalTrades: 0,
    status: "running",
    createdAt: new Date(row.created_at),
  }
}

export async function updateBacktest(
  backtestId: string,
  data: Partial<BacktestResult>,
): Promise<BacktestResult | null> {
  await sql`
    UPDATE backtest_results 
    SET 
      final_value = COALESCE(${data.finalValue}, final_value),
      total_return = COALESCE(${data.totalReturn}, total_return),
      sharpe_ratio = COALESCE(${data.sharpeRatio}, sharpe_ratio),
      sortino_ratio = COALESCE(${data.sortinoRatio}, sortino_ratio),
      max_drawdown = COALESCE(${data.maxDrawdown}, max_drawdown),
      win_rate = COALESCE(${data.winRate}, win_rate),
      total_trades = COALESCE(${data.totalTrades}, total_trades),
      status = COALESCE(${data.status}, status)
    WHERE id = ${backtestId}
  `

  const rows = await sql`SELECT * FROM backtest_results WHERE id = ${backtestId}`
  if (rows.length === 0) return null

  const row = rows[0]
  return {
    id: row.id,
    userId: row.user_id,
    strategyId: row.strategy_id,
    strategyName: row.strategy_name,
    startDate: new Date(row.start_date),
    endDate: new Date(row.end_date),
    initialCapital: Number.parseFloat(row.initial_capital),
    finalValue: row.final_value ? Number.parseFloat(row.final_value) : 0,
    totalReturn: row.total_return ? Number.parseFloat(row.total_return) : 0,
    sharpeRatio: row.sharpe_ratio ? Number.parseFloat(row.sharpe_ratio) : 0,
    sortinoRatio: row.sortino_ratio ? Number.parseFloat(row.sortino_ratio) : 0,
    maxDrawdown: row.max_drawdown ? Number.parseFloat(row.max_drawdown) : 0,
    winRate: row.win_rate ? Number.parseFloat(row.win_rate) : 0,
    totalTrades: row.total_trades || 0,
    status: row.status as BacktestResult["status"],
    createdAt: new Date(row.created_at),
  }
}

// -----------------------------------------------------------------------------
// USER SETTINGS
// -----------------------------------------------------------------------------

export async function getUserSettings(userId: string): Promise<UserSettings> {
  const rows = await sql`
    SELECT * FROM user_settings WHERE user_id = ${userId}
  `

  if (rows.length === 0) {
    // Return defaults if no settings exist
    return {
      userId,
      theme: "dark",
      notifications: {
        whaleAlerts: true,
        driftAlerts: true,
        signalAlerts: true,
        emailDigest: false,
      },
      riskManagement: {
        maxDrawdown: 10,
        autoRebalance: true,
        positionSizeLimit: 5,
      },
      display: {
        compactMode: false,
        showPnLPercent: true,
        defaultTimeframe: "1D",
      },
      apiKeys: {
        polygonConfigured: false,
        exaConfigured: false,
      },
    }
  }

  const row = rows[0]
  return {
    userId: row.user_id,
    theme: row.theme as "dark" | "light",
    notifications: {
      whaleAlerts: row.notifications_whale_alerts,
      driftAlerts: row.notifications_drift_alerts,
      signalAlerts: row.notifications_signal_alerts,
      emailDigest: row.notifications_email_digest,
    },
    riskManagement: {
      maxDrawdown: row.risk_max_drawdown,
      autoRebalance: row.risk_auto_rebalance,
      positionSizeLimit: row.risk_position_size_limit,
    },
    display: {
      compactMode: row.display_compact_mode,
      showPnLPercent: row.display_show_pnl_percent,
      defaultTimeframe: row.display_default_timeframe as "1D" | "1W" | "1M" | "3M" | "1Y",
    },
    apiKeys: {
      polygonConfigured: row.api_polygon_configured,
      exaConfigured: row.api_exa_configured,
    },
  }
}

export async function updateUserSettings(userId: string, data: Partial<UserSettings>): Promise<UserSettings> {
  // Upsert settings
  await sql`
    INSERT INTO user_settings (user_id)
    VALUES (${userId})
    ON CONFLICT (user_id) DO NOTHING
  `

  if (data.theme) {
    await sql`UPDATE user_settings SET theme = ${data.theme} WHERE user_id = ${userId}`
  }

  if (data.notifications) {
    const n = data.notifications
    await sql`
      UPDATE user_settings SET
        notifications_whale_alerts = COALESCE(${n.whaleAlerts}, notifications_whale_alerts),
        notifications_drift_alerts = COALESCE(${n.driftAlerts}, notifications_drift_alerts),
        notifications_signal_alerts = COALESCE(${n.signalAlerts}, notifications_signal_alerts),
        notifications_email_digest = COALESCE(${n.emailDigest}, notifications_email_digest)
      WHERE user_id = ${userId}
    `
  }

  if (data.riskManagement) {
    const r = data.riskManagement
    await sql`
      UPDATE user_settings SET
        risk_max_drawdown = COALESCE(${r.maxDrawdown}, risk_max_drawdown),
        risk_auto_rebalance = COALESCE(${r.autoRebalance}, risk_auto_rebalance),
        risk_position_size_limit = COALESCE(${r.positionSizeLimit}, risk_position_size_limit)
      WHERE user_id = ${userId}
    `
  }

  if (data.display) {
    const d = data.display
    await sql`
      UPDATE user_settings SET
        display_compact_mode = COALESCE(${d.compactMode}, display_compact_mode),
        display_show_pnl_percent = COALESCE(${d.showPnLPercent}, display_show_pnl_percent),
        display_default_timeframe = COALESCE(${d.defaultTimeframe}, display_default_timeframe)
      WHERE user_id = ${userId}
    `
  }

  if (data.apiKeys) {
    const a = data.apiKeys
    await sql`
      UPDATE user_settings SET
        api_polygon_configured = COALESCE(${a.polygonConfigured}, api_polygon_configured),
        api_exa_configured = COALESCE(${a.exaConfigured}, api_exa_configured)
      WHERE user_id = ${userId}
    `
  }

  return getUserSettings(userId)
}
