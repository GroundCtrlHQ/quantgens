"use client"

const exchanges = [
  { name: "Binance", inflow: 423.5, outflow: 312.2, color: "#F0B90B" },
  { name: "Coinbase", inflow: 287.1, outflow: 341.8, color: "#0052FF" },
  { name: "Kraken", inflow: 156.3, outflow: 98.7, color: "#5741D9" },
  { name: "OKX", inflow: 201.4, outflow: 178.9, color: "#FFFFFF" },
]

export function ExchangeBreakdown() {
  return (
    <div className="glass-card rounded-xl p-4">
      <h3 className="text-sm font-medium text-foreground mb-4">Exchange Breakdown</h3>

      <div className="space-y-3">
        {exchanges.map((exchange) => {
          const net = exchange.inflow - exchange.outflow
          const maxFlow = Math.max(exchange.inflow, exchange.outflow)
          const inflowWidth = (exchange.inflow / maxFlow) * 100
          const outflowWidth = (exchange.outflow / maxFlow) * 100

          return (
            <div key={exchange.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: exchange.color }} />
                  <span className="text-xs font-medium text-foreground">{exchange.name}</span>
                </div>
                <span className={`text-xs font-mono ${net >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {net >= 0 ? "+" : ""}
                  {net.toFixed(1)}M
                </span>
              </div>
              <div className="flex gap-1 h-1.5">
                <div
                  className="h-full rounded-full bg-green-500/60"
                  style={{ width: `${inflowWidth}%` }}
                  title={`Inflow: $${exchange.inflow}M`}
                />
                <div
                  className="h-full rounded-full bg-red-500/60"
                  style={{ width: `${outflowWidth}%` }}
                  title={`Outflow: $${exchange.outflow}M`}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-green-500/60" />
          <span>Inflow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-500/60" />
          <span>Outflow</span>
        </div>
      </div>
    </div>
  )
}
