# Quantgens - AI-Powered Quantitative Trading Platform

> **Democratizing quantitative trading tools that were once exclusive to hedge funds.**

Quantgens is a unified AI-powered platform that gives every trader access to sophisticated quantitative models, whale tracking, strategy backtesting, and real-time market intelligence.

![Quantgens](public/icon.svg)

## 🚀 Features

### 🎯 Command Center Dashboard
- **Real-time portfolio metrics** - Total value, daily P&L, win rate, Sharpe ratio
- **Performance charts** - Strategy vs benchmark visualization
- **Live signals feed** - AI-generated BUY/SELL/HOLD recommendations
- **Risk metrics** - Max drawdown, beta exposure, VaR

### 🤖 Quantos AI Assistant
- Natural language queries for stocks, news, and market conditions
- Real-time stock data via Polygon.io
- AI-powered news search via Exa.ai
- Market overview and major indices performance
- Causal attribution explaining model predictions

### 🧪 Quantgens Lab
- **Model Tuning** - Parameter optimization for GARCH, LSTM, XGBoost models
- **Strategy Composer** - Build multi-strategy portfolios with drift alerts
- **Backtesting** - Comprehensive backtesting with overfitting detection

### 🐋 Whale Radar
- Track institutional capital flows in real-time
- Identify smart money vs retail flow
- Visualize flow patterns and market sentiment
- Get alerts on significant capital movements

### 🏪 Model Marketplace
- Discover community-contributed models
- Share and monetize your own strategies
- Browse by category and performance metrics

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Frontend"
        A[Command Center Dashboard]
        B[Quantgens Lab]
        C[Whale Radar]
        D[Marketplace]
        E[Quantos AI Chat]
    end
    
    subgraph "API Layer"
        F[Next.js API Routes]
        G[Auth Routes]
        H[Chat API]
        I[Market Data API]
        J[Settings API]
    end
    
    subgraph "AI Services"
        K[Quantos AI - Gemini 2.0]
        L[OpenRouter]
    end
    
    subgraph "Data Services"
        M[Polygon.io]
        N[Exa.ai]
        O[Neon PostgreSQL]
    end
    
    subgraph "External Integrations"
        P[Databricks API]
    end
    
    A --> F
    B --> F
    C --> F
    D --> F
    E --> H
    
    F --> G
    H --> K
    K --> L
    
    F --> M
    F --> N
    F --> O
    
    B --> P
    
    style A fill:#006CFF,color:#fff
    style B fill:#006CFF,color:#fff
    style C fill:#006CFF,color:#fff
    style D fill:#006CFF,color:#fff
    style E fill:#006CFF,color:#fff
    style K fill:#006CFF,color:#fff
    style O fill:#006CFF,color:#fff
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Database**: Neon Serverless PostgreSQL
- **AI**: Gemini 2.0 Flash (via OpenRouter)
- **Market Data**: Polygon.io
- **News Search**: Exa.ai
- **Charts**: Recharts
- **State Management**: SWR, React Hooks

## 📦 Installation

### Prerequisites

- Node.js 22.x or higher
- pnpm (recommended) or npm
- PostgreSQL database (Neon recommended)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/GroundCtrlHQ/quantgens.git
   cd quantgens
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env.local
   ```

4. **Set up your environment variables in `.env.local`**:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

   # AI Services
   OPENROUTER_API_KEY=your_openrouter_api_key

   # Market Data
   POLYGON_API_KEY=your_polygon_api_key

   # News Search
   EXA_API_KEY=your_exa_api_key

   # Authentication (optional)
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_password
   ```

5. **Set up the database schema**
   ```sql
   -- Run the SQL schema from your Neon dashboard
   -- or use Prisma migrations if configured
   ```

6. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

7. **Open [http://localhost:3000](http://localhost:3000)**

## 🎨 Project Structure

```
quantgens/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── chat/         # Quantos AI chat API
│   │   ├── news/         # News aggregation
│   │   └── signals/      # Trading signals
│   ├── lab/              # Strategy lab page
│   ├── marketplace/      # Model marketplace
│   ├── whale-radar/      # Whale tracking
│   └── settings/         # User settings
├── components/            # React components
│   ├── dashboard/        # Dashboard components
│   ├── quantos/          # Quantos AI components
│   ├── onboarding/       # Onboarding flow
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities and services
│   ├── db/               # Database layer
│   └── services/         # External API services
└── public/               # Static assets
```

## 🔐 Environment Variables

See `env.example` for all required environment variables. **Never commit your `.env.local` file!**

### Required Variables

- `DATABASE_URL` - PostgreSQL connection string (Neon recommended)
- `OPENROUTER_API_KEY` - For Gemini 2.0 Flash AI
- `POLYGON_API_KEY` - For market data (free tier: 5 calls/min)
- `EXA_API_KEY` - For news search

### Optional Variables

- `ADMIN_USERNAME` - Admin login username
- `ADMIN_PASSWORD` - Admin login password

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js 16:
- Railway
- Render
- AWS Amplify
- Google Cloud Run

## 🧪 Development

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## 📊 Key Features Explained

### Quantos AI
The AI assistant uses Gemini 2.0 Flash via OpenRouter to provide intelligent trading insights. It can:
- Answer questions about market conditions
- Fetch real-time stock data
- Search for relevant news
- Explain model behavior and predictions

### Strategy Lab
Build and test quantitative trading strategies:
- Tune model parameters (GARCH, LSTM, XGBoost, etc.)
- Compose multi-strategy portfolios
- Run comprehensive backtests
- Monitor strategy drift and performance

### Whale Radar
Track institutional money flows:
- Identify large trades
- Analyze smart money vs retail flow
- Visualize capital movements
- Get alerts on significant activity

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Market data from [Polygon.io](https://polygon.io/)
- News search via [Exa.ai](https://exa.ai/)
- AI powered by [Google Gemini](https://gemini.google.com/) via [OpenRouter](https://openrouter.ai/)

---

**Built with ❤️ by GroundCtrlHQ**

