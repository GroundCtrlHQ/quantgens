# AstraQuant Command Center
## Pitch Deck Overview

---

## 🎯 Slide 1: The Problem

### Retail & Emerging Traders Are Flying Blind

- **Institutional traders** have access to sophisticated AI models, whale tracking, and strategy backtesting
- **Retail traders** rely on fragmented tools, gut feelings, and delayed information
- **The gap is widening** — AI-powered trading is becoming table stakes

> *"Democratizing quantitative trading tools that were once exclusive to hedge funds."*

---

## 💡 Slide 2: The Solution — AstraQuant

### AI-Powered Quantitative Trading Command Center

A unified platform that gives every trader access to:

| Feature | Description |
|---------|-------------|
| **Quantos AI** | XAI Co-pilot powered by Gemini 2.0 Flash with real-time market data |
| **Strategy Lab** | Build, tune, and backtest trading strategies with ML models |
| **Whale Radar** | Track institutional capital flows in real-time |
| **Model Marketplace** | Discover, share, and monetize quantitative models |

**Tech Stack:**
- Next.js 16 + React 19
- Neon Serverless PostgreSQL
- Gemini 2.0 Flash AI (via OpenRouter)
- Polygon.io (market data) + Exa.ai (news search)

---

## 🚀 Slide 3: Core Features

### 1. Command Center Dashboard
- **Portfolio metrics** — Total value, daily P&L, win rate, Sharpe ratio
- **Performance charts** — Real-time strategy vs benchmark visualization
- **Live signals feed** — AI-generated BUY/SELL/HOLD recommendations
- **Risk metrics** — Max drawdown, beta exposure, VaR

### 2. Quantos AI Assistant
- Natural language queries for stock prices, news, market overview
- **Tool-calling capabilities:**
  - `getStockData` — Real-time stock data via Polygon
  - `getNews` — AI-powered news search via Exa
  - `getMarketOverview` — Major indices performance
- Causal attribution explaining *why* models make predictions

### 3. AstraQuant Lab (Strategy Builder)
- **Model Tuning** — Parameter optimization for GARCH, LSTM, XGBoost models
- **Strategy Composer** — Build multi-strategy portfolios with drift alerts
- **Backtesting Engine** — Historical simulation with overfitting detection

### 4. Whale Radar
- Track institutional capital flows by asset/timeframe
- Exchange breakdown analysis
- Smart money indicator
- Real-time whale alerts

### 5. Model Marketplace
- Browse/filter quantitative models by category and tier
- Upload and monetize your own models
- Detailed model performance analytics

---

## 🏗️ Slide 4: Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 16)                    │
│  React 19 • Tailwind CSS • Radix UI • Recharts • SWR        │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                      API ROUTES                              │
│  /api/chat     → Quantos AI (Gemini 2.0 Flash)              │
│  /api/polygon  → Real-time stock data                        │
│  /api/exa      → News search                                 │
│  /api/signals  → AI-generated trading signals                │
└──────────┬──────────────────────────────────────────────────┘
           │
┌──────────▼──────────┐  ┌─────────────────┐  ┌──────────────┐
│   Neon PostgreSQL   │  │  Polygon.io     │  │   Exa.ai     │
│   (Serverless DB)   │  │  (Market Data)  │  │  (AI Search) │
└─────────────────────┘  └─────────────────┘  └──────────────┘
```

**Database Tables:**
- `users` — User accounts with tier management
- `strategies` — Trading strategy configurations
- `portfolios` — Portfolio performance tracking
- `signals` — AI-generated trading signals
- `backtest_results` — Historical simulation results
- `watchlist` — User watchlists
- `user_settings` — Preferences and API configurations

---

## 💰 Slide 5: Running Costs (Monthly Estimates)

### Infrastructure Costs

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| **Neon Database** | Free → Launch | **$0 – $19/mo** | Free: 100 CU-hours, 0.5GB. Launch: $0.106/CU-hour, $0.35/GB-month |
| **Gemini 2.0 Flash** | Pay-as-you-go | **~$5-50/mo** | $0.10/1M input tokens, $0.40/1M output tokens |
| **Polygon.io** | Starter → Developer | **$0 – $79/mo** | Free: 5 calls/min. Starter: $29/mo. Developer: $79/mo |
| **Exa.ai** | Pay-as-you-go | **~$5-20/mo** | $5/1k searches, $10 free credits on signup |
| **Vercel** | Hobby → Pro | **$0 – $20/mo** | Hosting + analytics |

### Cost Breakdown by Scale

| User Scale | Monthly Estimate | Breakdown |
|------------|------------------|-----------|
| **MVP/Testing** | **$0-10** | Neon Free + Gemini Free Tier + Polygon Free |
| **Early Stage (100 users)** | **$50-100** | Neon Launch + Gemini ~$20 + Polygon Starter |
| **Growth (1,000 users)** | **$200-400** | Neon Launch + Gemini ~$100 + Polygon Developer |
| **Scale (10,000+ users)** | **$1,000+** | Neon Scale + Volume pricing negotiations |

### AI Cost Deep Dive (Gemini 2.0 Flash)

```
Per 1,000 chat interactions (avg 500 input + 200 output tokens each):
- Input:  500k tokens × $0.10/1M = $0.05
- Output: 200k tokens × $0.40/1M = $0.08
- Total: ~$0.13 per 1,000 chats

At 10,000 daily active users × 5 chats/day = 50k chats/day
Monthly: 1.5M chats × $0.13/1k = ~$195/month AI costs
```

---

## 🎯 Slide 6: Current Status & Roadmap

### ✅ Completed Features

- [x] Command Center Dashboard with real-time metrics
- [x] Quantos AI assistant with tool-calling (stock data, news, market overview)
- [x] Strategy Lab with Model Tuning, Strategy Composer, Backtesting
- [x] Whale Radar with flow visualization and alerts
- [x] Model Marketplace with filters and upload
- [x] Neon PostgreSQL integration (users, strategies, portfolios, signals)
- [x] Settings page for notifications, risk management, display preferences

### 🚧 In Progress / Next Steps

- [ ] User authentication (consider Neon Auth / Auth.js)
- [ ] Live trading integrations (Alpaca, Interactive Brokers)
- [ ] Real-time WebSocket data streaming
- [ ] Mobile-responsive optimization
- [ ] Model performance tracking and analytics
- [ ] Payment integration for marketplace

### 🔮 Future Vision

- Multi-asset support (crypto, forex, options)
- Social trading features
- Advanced ML model deployment
- White-label offering for brokerages

---

## 📊 Slide 7: Why Now & Why Us

### Market Timing

- **AI is mainstream** — ChatGPT proved consumers will adopt AI tools
- **Retail trading boom** — Post-2020 surge in retail participation
- **API economy mature** — Polygon, Neon, OpenRouter make building affordable

### Competitive Advantage

| vs. Traditional Platforms | vs. AI-Only Tools |
|---------------------------|-------------------|
| AI-native from day one | Full trading workflow, not just chat |
| Real-time data integration | Strategy backtesting & validation |
| Explainable AI (XAI) | Portfolio management |

### Unit Economics Advantage

| Competitor | AI Cost | Our Advantage |
|------------|---------|---------------|
| OpenAI GPT-4o | $2.50/1M out | Gemini: $0.40/1M (84% cheaper) |
| Traditional DB | $50-200/mo | Neon: $0-19/mo (serverless) |

---

## 📎 Appendix: Technical Details

### Key Dependencies
```json
{
  "ai": "6.0.3",
  "@ai-sdk/react": "3.0.3",
  "@neondatabase/serverless": "1.0.2",
  "@openrouter/ai-sdk-provider": "1.5.4",
  "next": "16.0.10",
  "react": "19.2.0",
  "recharts": "2.15.4"
}
```

### Environment Variables Required
```
DATABASE_URL=           # Neon PostgreSQL connection string
OPENROUTER_API_KEY=     # For Gemini 2.0 Flash via OpenRouter
POLYGON_API_KEY=        # Polygon.io market data
EXA_API_KEY=            # Exa.ai news search
```

### Database Schema Overview
- Users with tiered access (free/pro/enterprise)
- Strategies with model types (GARCH, LSTM, XGBoost, etc.)
- Portfolios with comprehensive performance metrics
- Signals with confidence scores and reasoning
- Backtests with tear sheet metrics

---

*Last Updated: December 2024*
