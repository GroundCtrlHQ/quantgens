// Mock data for Quantgens Command Center

export const portfolioMetrics = {
  totalValue: 2847562.45,
  dailyPnL: 45892.32,
  dailyPnLPercent: 1.64,
  weeklyReturn: 4.23,
  monthlyReturn: 12.87,
  sharpeRatio: 2.34,
  maxDrawdown: -3.21,
  winRate: 68.5,
}

export const activeStrategies = [
  {
    id: 1,
    name: "Momentum Alpha",
    status: "active",
    pnl: 12453.21,
    pnlPercent: 2.34,
    positions: 12,
    riskScore: 3,
  },
  {
    id: 2,
    name: "Mean Reversion",
    status: "active",
    pnl: 8921.45,
    pnlPercent: 1.87,
    positions: 8,
    riskScore: 2,
  },
  {
    id: 3,
    name: "Volatility Arb",
    status: "paused",
    pnl: -1234.56,
    pnlPercent: -0.45,
    positions: 5,
    riskScore: 4,
  },
  {
    id: 4,
    name: "Sector Rotation",
    status: "active",
    pnl: 6789.12,
    pnlPercent: 1.23,
    positions: 15,
    riskScore: 2,
  },
]

export const recentSignals = [
  { id: 1, symbol: "NVDA", action: "BUY", confidence: 92, timestamp: "2 min ago", price: 875.42 },
  { id: 2, symbol: "AAPL", action: "HOLD", confidence: 78, timestamp: "5 min ago", price: 192.15 },
  { id: 3, symbol: "TSLA", action: "SELL", confidence: 85, timestamp: "8 min ago", price: 245.8 },
  { id: 4, symbol: "MSFT", action: "BUY", confidence: 88, timestamp: "12 min ago", price: 428.5 },
  { id: 5, symbol: "META", action: "BUY", confidence: 79, timestamp: "15 min ago", price: 512.3 },
]

export const whaleActivity = [
  { id: 1, symbol: "BTC", flow: "inflow", amount: 125000000, exchange: "Binance", timestamp: "3 min ago" },
  { id: 2, symbol: "ETH", flow: "outflow", amount: 45000000, exchange: "Coinbase", timestamp: "7 min ago" },
  { id: 3, symbol: "SOL", flow: "inflow", amount: 28000000, exchange: "Kraken", timestamp: "12 min ago" },
]

export const performanceData = [
  { date: "Jan", portfolio: 2.1, benchmark: 1.8 },
  { date: "Feb", portfolio: 3.4, benchmark: 2.1 },
  { date: "Mar", portfolio: 1.2, benchmark: 0.9 },
  { date: "Apr", portfolio: 4.5, benchmark: 3.2 },
  { date: "May", portfolio: 2.8, benchmark: 2.4 },
  { date: "Jun", portfolio: 5.2, benchmark: 3.8 },
  { date: "Jul", portfolio: 3.1, benchmark: 2.7 },
  { date: "Aug", portfolio: 4.8, benchmark: 3.5 },
  { date: "Sep", portfolio: 2.3, benchmark: 1.9 },
  { date: "Oct", portfolio: 6.1, benchmark: 4.2 },
  { date: "Nov", portfolio: 4.2, benchmark: 3.1 },
  { date: "Dec", portfolio: 5.8, benchmark: 4.0 },
]

export const riskMetrics = {
  var95: 45678.9,
  var99: 67890.12,
  beta: 0.85,
  alpha: 0.023,
  correlation: 0.72,
}
