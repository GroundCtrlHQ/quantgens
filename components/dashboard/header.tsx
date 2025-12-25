"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, User, BarChart3, TrendingUp, Layers, TestTube, ShoppingBag, Activity, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"

interface HeaderProps {
  title?: string
  subtitle?: string
}

export function Header({ title = "Command Center", subtitle }: HeaderProps) {
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })
      if (response.ok) {
        router.push("/login")
        router.refresh()
      }
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const navigationItems = [
    { id: "dashboard", label: "Command Center", icon: BarChart3, href: "/" },
    { id: "lab", label: "Quantgens Lab", icon: TestTube, href: "/lab" },
    { id: "marketplace", label: "Model Marketplace", icon: ShoppingBag, href: "/marketplace" },
    { id: "whale-radar", label: "Whale Radar", icon: Activity, href: "/whale-radar" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ]

  const handleSearchSelect = (href: string) => {
    setSearchOpen(false)
    router.push(href)
  }

  return (
    <>
      <header className="sticky top-0 z-30 glass border-b border-border/50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
            {!subtitle && (
              <Badge variant="outline" className="text-xs text-primary border-primary/30 bg-primary/10">
                Live
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search strategies, assets..."
                className="w-64 pl-9 bg-secondary/50 border-border/50 focus:border-primary/50 cursor-pointer"
                onFocus={() => setSearchOpen(true)}
                onClick={() => setSearchOpen(true)}
                readOnly
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-secondary">
                  <User className="h-5 w-5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-card">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>API Keys</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Command Palette */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search strategies, assets, or navigate..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <CommandItem
                  key={item.id}
                  value={item.label}
                  onSelect={() => handleSearchSelect(item.href)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>
          <CommandGroup heading="Quick Actions">
            <CommandItem
              value="model-tuning"
              onSelect={() => handleSearchSelect("/lab?tab=model-tuning")}
            >
              <TestTube className="h-4 w-4" />
              <span>Model Tuning</span>
            </CommandItem>
            <CommandItem
              value="strategy-composer"
              onSelect={() => handleSearchSelect("/lab?tab=strategy-composer")}
            >
              <Layers className="h-4 w-4" />
              <span>Strategy Composer</span>
            </CommandItem>
            <CommandItem
              value="backtest"
              onSelect={() => handleSearchSelect("/lab?tab=backtest")}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Backtest</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
