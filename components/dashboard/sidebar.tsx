"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Radar,
  FlaskConical,
  Store,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Zap,
  TrendingUp,
  BarChart3,
  Brain,
  Layers,
  Activity,
  GitBranch,
  Sparkles,
  Timer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const models = [
  { id: "linear-regression", name: "Linear Regression", category: "Statistical", icon: TrendingUp },
  { id: "arima", name: "ARIMA", category: "Statistical", icon: Activity },
  { id: "garch", name: "GARCH", category: "Statistical", icon: BarChart3 },
  { id: "kalman-filter", name: "Kalman Filter", category: "Statistical", icon: Timer },
  { id: "random-forest", name: "Random Forest", category: "Machine Learning", icon: GitBranch },
  { id: "xgboost", name: "XGBoost", category: "Machine Learning", icon: Sparkles },
  { id: "lstm", name: "LSTM Network", category: "Deep Learning", icon: Brain },
  { id: "transformer", name: "Transformer", category: "Deep Learning", icon: Layers },
]

const navItems = [
  { icon: LayoutDashboard, label: "Command Center", href: "/" },
  { icon: FlaskConical, label: "Lab", href: "/lab", hasSubmenu: true },
  { icon: Radar, label: "Whale Radar", href: "/whale-radar" },
  { icon: Store, label: "Marketplace", href: "/marketplace" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

interface SidebarProps {
  selectedModel?: string | null
  onSelectModel?: (modelId: string) => void
  onCollapsedChange?: (collapsed: boolean) => void
}

export function Sidebar({ selectedModel, onSelectModel, onCollapsedChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [labExpanded, setLabExpanded] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const isLab = pathname === "/lab"

  const categories = [...new Set(models.map((m) => m.category))]

  const handleCollapse = useCallback(() => {
    const newCollapsed = !collapsed
    setCollapsed(newCollapsed)
    onCollapsedChange?.(newCollapsed)
  }, [collapsed, onCollapsedChange])

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen glass-card transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-border/50">
            {!collapsed && (
              <Link 
                href="https://www.quantgens.ai" 
                target="_self" 
                className="text-lg font-semibold text-foreground hover:text-primary transition-colors no-underline"
              >
                QUANTGENS
              </Link>
            )}
            {collapsed && (
              <Link 
                href="https://www.quantgens.ai" 
                target="_self" 
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 mx-auto hover:opacity-80 transition-opacity"
              >
                <Zap className="h-5 w-5 text-primary" />
              </Link>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const showSubmenu = item.hasSubmenu && isLab && !collapsed

                return (
                  <div key={item.label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {item.hasSubmenu ? (
                          <div
                            data-onboarding-target="sidebar-lab"
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all cursor-pointer",
                              isActive
                                ? "bg-primary/15 text-primary"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                            )}
                            onClick={() => {
                              if (!isLab) {
                                router.push(item.href)
                              } else {
                                setLabExpanded(!labExpanded)
                              }
                            }}
                          >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {!collapsed && (
                              <>
                                <span className="flex-1">{item.label}</span>
                                {isLab && (
                                  <ChevronDown
                                    className={cn(
                                      "h-4 w-4 transition-transform",
                                      labExpanded ? "rotate-0" : "-rotate-90",
                                    )}
                                  />
                                )}
                              </>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            data-onboarding-target={
                              item.label === "Lab"
                                ? "sidebar-lab"
                                : item.label === "Whale Radar"
                                  ? "sidebar-whale-radar"
                                  : item.label === "Marketplace"
                                    ? "sidebar-marketplace"
                                    : item.label === "Settings"
                                      ? "settings-link"
                                      : undefined
                            }
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                              isActive
                                ? "bg-primary/15 text-primary"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                            )}
                          >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                          </Link>
                        )}
                      </TooltipTrigger>
                      {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                    </Tooltip>

                    {showSubmenu && labExpanded && (
                      <div className="mt-2 ml-3 pl-3 border-l border-border/50 space-y-3">
                        {categories.map((category) => (
                          <div key={category}>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 px-2">
                              {category}
                            </p>
                            <div className="space-y-0.5">
                              {models
                                .filter((m) => m.category === category)
                                .map((model) => {
                                  const isModelSelected = selectedModel === model.id
                                  return (
                                    <button
                                      key={model.id}
                                      onClick={() => onSelectModel?.(model.id)}
                                      className={cn(
                                        "w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-all",
                                        isModelSelected
                                          ? "bg-primary/15 text-primary"
                                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                                      )}
                                    >
                                      <model.icon className="h-3.5 w-3.5 flex-shrink-0" />
                                      <span className="truncate">{model.name}</span>
                                    </button>
                                  )
                                })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </nav>

          {/* Collapse Toggle */}
          <div className="border-t border-border/50 p-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center text-muted-foreground hover:text-foreground"
              onClick={handleCollapse}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span>Collapse</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
