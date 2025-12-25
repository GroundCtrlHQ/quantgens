"use client"

import { Newspaper, ExternalLink, Clock } from "lucide-react"

interface Article {
  title: string
  url: string
  snippet: string
  date?: string
}

interface NewsWidgetProps {
  query: string
  articles: Article[]
}

export function NewsWidget({ query, articles }: NewsWidgetProps) {
  if (articles.length === 0) {
    return (
      <div className="rounded-lg border border-border/50 bg-card/50 p-4 my-2">
        <p className="text-sm text-muted-foreground">No recent news found for &quot;{query}&quot;</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border/50 bg-card/50 p-4 my-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20">
          <Newspaper className="h-3 w-3 text-primary" />
        </div>
        <span className="text-sm font-medium text-foreground">Latest News: {query}</span>
      </div>

      <div className="space-y-3">
        {articles.map((article, i) => (
          <a
            key={i}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h4>
              <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-1" />
            </div>
            {article.snippet && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.snippet}</p>}
            {article.date && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(article.date).toLocaleDateString()}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
