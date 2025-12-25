// =============================================================================
// DATABASE TYPES
// =============================================================================
// Define all your database entity types here. When integrating a real database,
// these types should match your database schema.
// =============================================================================

export interface User {
  id: string
  email: string
  name: string
  tier: "free" | "pro" | "enterprise"
  createdAt: Date
  settings?: UserSettings
}

export interface Strategy {
  id: string
  userId: string
  name: string
  description: string
  model: "GARCH" | "LSTM" | "XGBoost" | "RandomForest" | "Transformer" | "Custom"
  status: "active" | "paused" | "draft"
  accuracy: number
  pnl: number
  pnlPercent: number
  positions: number
  riskScore: number // 1-5
  createdAt: Date
  updatedAt: Date
}

export interface Portfolio {
  id: string
  userId: string
  totalValue: number
  cashBalance: number
  dailyPnL: number
  dailyPnLPercent: number
  weeklyReturn: number
  monthlyReturn: number
  yearlyReturn: number
  sharpeRatio: number
  sortinoRatio: number
  maxDrawdown: number
  winRate: number
  totalTrades: number
  updatedAt: Date
}

export interface Signal {
  id: string
  userId: string
  symbol: string
  action: "BUY" | "SELL" | "HOLD"
  confidence: number
  price: number
  targetPrice: number | null
  stopLoss: number | null
  reasoning: string
  source: string // strategy name
  createdAt: Date
}

export interface WatchlistItem {
  id: string
  userId: string
  symbol: string
  addedAt: Date
}

export interface BacktestResult {
  id: string
  userId: string
  strategyId: string
  strategyName: string
  startDate: Date
  endDate: Date
  initialCapital: number
  finalValue: number
  totalReturn: number
  sharpeRatio: number
  sortinoRatio: number
  maxDrawdown: number
  winRate: number
  totalTrades: number
  status: "running" | "completed" | "failed"
  createdAt: Date
}

export interface UserSettings {
  userId: string
  theme: "dark" | "light"
  notifications: {
    whaleAlerts: boolean
    driftAlerts: boolean
    signalAlerts: boolean
    emailDigest: boolean
  }
  riskManagement: {
    maxDrawdown: number
    autoRebalance: boolean
    positionSizeLimit: number
  }
  display: {
    compactMode: boolean
    showPnLPercent: boolean
    defaultTimeframe: "1D" | "1W" | "1M" | "3M" | "1Y"
  }
  apiKeys: {
    polygonConfigured: boolean
    exaConfigured: boolean
  }
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface StockData {
  ticker: string
  price: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  change: number
  changePercent: number
  timestamp: Date
}

export interface NewsArticle {
  id: string
  title: string
  url: string
  snippet: string
  source: string
  publishedAt: Date
  imageUrl?: string
}

export interface MarketIndex {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
}

export interface WhaleFlow {
  id: string
  symbol: string
  flowType: "inflow" | "outflow"
  amount: number
  exchange: string
  timestamp: Date
}
