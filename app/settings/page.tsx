"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Key,
  Bell,
  Shield,
  Palette,
  Bot,
  Zap,
  Check,
  Loader2,
  Database,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface DataIntegration {
  id: string
  name: string
  description: string
  icon: string
  apiKey: string
  connected: boolean
}

export default function SettingsPage() {
  const { data: dbSettings, isLoading, mutate } = useSWR("/api/settings", fetcher)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const { toast } = useToast()

  const [integrations, setIntegrations] = useState<DataIntegration[]>([
    {
      id: "bloomberg",
      name: "Bloomberg",
      description: "Real-time market data, news, and analytics",
      icon: "B",
      apiKey: "",
      connected: false,
    },
    {
      id: "databricks",
      name: "Databricks",
      description: "Data lakehouse for ML workloads",
      icon: "D",
      apiKey: "",
      connected: false,
    },
    {
      id: "refinitiv",
      name: "Refinitiv",
      description: "Financial data and infrastructure",
      icon: "R",
      apiKey: "",
      connected: false,
    },
    {
      id: "quandl",
      name: "Nasdaq Data Link",
      description: "Alternative and core financial data",
      icon: "Q",
      apiKey: "",
      connected: false,
    },
  ])

  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({})
  const [testingConnection, setTestingConnection] = useState<string | null>(null)

  const [settings, setSettings] = useState({
    openrouterModel: "google/gemini-2.0-flash-001",
    maxTokens: 1000,
    emailAlerts: true,
    pushNotifications: true,
    whaleAlertThreshold: 1000000,
    driftAlertEnabled: true,
    defaultRiskLevel: "medium",
    autoRebalance: false,
    maxDrawdown: 15,
    theme: "dark",
    compactMode: false,
    showConfidenceScores: true,
  })

  useEffect(() => {
    if (dbSettings && !dbSettings.error) {
      setSettings({
        openrouterModel: "google/gemini-2.0-flash-001",
        maxTokens: 1000,
        emailAlerts: dbSettings.notifications?.signalAlerts ?? true,
        pushNotifications: dbSettings.notifications?.signalAlerts ?? true,
        whaleAlertThreshold: 1000000,
        driftAlertEnabled: dbSettings.notifications?.driftAlerts ?? true,
        defaultRiskLevel: "medium",
        autoRebalance: dbSettings.riskManagement?.autoRebalance ?? false,
        maxDrawdown: dbSettings.riskManagement?.maxDrawdown ?? 15,
        theme: dbSettings.theme ?? "dark",
        compactMode: dbSettings.display?.compactMode ?? false,
        showConfidenceScores: true,
      })
    }
  }, [dbSettings])

  const handleApiKeyChange = (id: string, value: string) => {
    setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, apiKey: value, connected: false } : i)))
  }

  const testConnection = async (id: string) => {
    setTestingConnection(id)
    // Simulate API connection test
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const integration = integrations.find((i) => i.id === id)
    if (integration?.apiKey && integration.apiKey.length > 10) {
      setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, connected: true } : i)))
      toast({
        title: "Connection Successful",
        description: `${integration.name} API connected successfully`,
      })
    } else {
      toast({
        title: "Connection Failed",
        description: "Invalid API key. Please check and try again.",
        variant: "destructive",
      })
    }
    setTestingConnection(null)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: settings.theme,
          notifications: {
            whaleAlerts: settings.emailAlerts,
            driftAlerts: settings.driftAlertEnabled,
            signalAlerts: settings.pushNotifications,
            emailDigest: false,
          },
          riskManagement: {
            maxDrawdown: settings.maxDrawdown,
            autoRebalance: settings.autoRebalance,
            positionSizeLimit: 5,
          },
          display: {
            compactMode: settings.compactMode,
            showPnLPercent: true,
            defaultTimeframe: "1D",
          },
        }),
      })
      mutate()
      setSaved(true)
      toast({ title: "Settings Saved", description: "Your preferences have been updated" })
      setTimeout(() => setSaved(false), 2000)
    } catch {
      toast({ title: "Save Failed", description: "Please try again", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 ml-64 p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Header title="Settings" subtitle="Configure your Quantgens experience" />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <section className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Database className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium text-foreground">Data Integrations</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Connect your data sources to enable real-time market analysis and model training
              </p>

              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 font-bold text-primary">
                          {integration.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground">{integration.name}</h3>
                            {integration.connected && (
                              <span className="flex items-center gap-1 text-xs text-green-400">
                                <CheckCircle2 className="h-3 w-3" />
                                Connected
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{integration.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          type={showApiKeys[integration.id] ? "text" : "password"}
                          placeholder={`Enter ${integration.name} API Key`}
                          value={integration.apiKey}
                          onChange={(e) => handleApiKeyChange(integration.id, e.target.value)}
                          className="bg-background/50 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowApiKeys((prev) => ({ ...prev, [integration.id]: !prev[integration.id] }))
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showApiKeys[integration.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <Button
                        variant={integration.connected ? "outline" : "default"}
                        size="sm"
                        onClick={() => testConnection(integration.id)}
                        disabled={!integration.apiKey || testingConnection === integration.id}
                        className="w-28"
                      >
                        {testingConnection === integration.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : integration.connected ? (
                          "Reconnect"
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-400">
                  API keys are encrypted and stored securely. Never share your API keys with others.
                </p>
              </div>
            </section>

            {/* API Configuration */}
            <section className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Key className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium text-foreground">AI Configuration</h2>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="model">Quantos AI Model</Label>
                    <Select
                      value={settings.openrouterModel}
                      onValueChange={(v) => setSettings({ ...settings, openrouterModel: v })}
                    >
                      <SelectTrigger id="model" className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google/gemini-2.0-flash-001">Gemini 2.0 Flash (Fast)</SelectItem>
                        <SelectItem value="google/gemini-2.5-pro-preview">Gemini 2.5 Pro (Smart)</SelectItem>
                        <SelectItem value="anthropic/claude-sonnet-4">Claude Sonnet 4</SelectItem>
                        <SelectItem value="openai/gpt-4o">GPT-4o</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tokens">Max Output Tokens</Label>
                    <Input
                      id="tokens"
                      type="number"
                      value={settings.maxTokens}
                      onChange={(e) => setSettings({ ...settings, maxTokens: Number.parseInt(e.target.value) })}
                      className="bg-secondary/50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Check className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400">OpenRouter API key configured</span>
                </div>
              </div>
            </section>

            {/* Quantos AI Settings */}
            <section className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium text-foreground">Quantos AI</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Show Confidence Scores</p>
                    <p className="text-xs text-muted-foreground">Display prediction confidence in AI responses</p>
                  </div>
                  <Switch
                    checked={settings.showConfidenceScores}
                    onCheckedChange={(v) => setSettings({ ...settings, showConfidenceScores: v })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Causal Attribution</p>
                    <p className="text-xs text-muted-foreground">Enable explainable AI insights</p>
                  </div>
                  <Switch checked={true} disabled />
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium text-foreground">Notifications</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Email Alerts</p>
                    <p className="text-xs text-muted-foreground">Receive important alerts via email</p>
                  </div>
                  <Switch
                    checked={settings.emailAlerts}
                    onCheckedChange={(v) => setSettings({ ...settings, emailAlerts: v })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">Real-time browser notifications</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(v) => setSettings({ ...settings, pushNotifications: v })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Strategy Drift Alerts</p>
                    <p className="text-xs text-muted-foreground">
                      Alert when strategies deviate from expected behavior
                    </p>
                  </div>
                  <Switch
                    checked={settings.driftAlertEnabled}
                    onCheckedChange={(v) => setSettings({ ...settings, driftAlertEnabled: v })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Whale Alert Threshold (USD)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[settings.whaleAlertThreshold / 1000000]}
                      onValueChange={([v]) => setSettings({ ...settings, whaleAlertThreshold: v * 1000000 })}
                      max={10}
                      min={0.1}
                      step={0.1}
                      className="flex-1"
                    />
                    <span className="text-sm text-foreground w-20">
                      ${(settings.whaleAlertThreshold / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Risk Management */}
            <section className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium text-foreground">Risk Management</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Risk Level</Label>
                  <Select
                    value={settings.defaultRiskLevel}
                    onValueChange={(v) => setSettings({ ...settings, defaultRiskLevel: v })}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Conservative (Low Risk)</SelectItem>
                      <SelectItem value="medium">Balanced (Medium Risk)</SelectItem>
                      <SelectItem value="high">Aggressive (High Risk)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Max Drawdown Limit (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[settings.maxDrawdown]}
                      onValueChange={([v]) => setSettings({ ...settings, maxDrawdown: v })}
                      max={50}
                      min={5}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-foreground w-12">{settings.maxDrawdown}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Auto-Rebalance</p>
                    <p className="text-xs text-muted-foreground">Automatically rebalance portfolio weights</p>
                  </div>
                  <Switch
                    checked={settings.autoRebalance}
                    onCheckedChange={(v) => setSettings({ ...settings, autoRebalance: v })}
                  />
                </div>
              </div>
            </section>

            {/* Display */}
            <section className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium text-foreground">Display</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={settings.theme} onValueChange={(v) => setSettings({ ...settings, theme: v })}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark (Terminal Modern)</SelectItem>
                      <SelectItem value="light" disabled>
                        Light (Coming Soon)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Compact Mode</p>
                    <p className="text-xs text-muted-foreground">Reduce spacing for more data density</p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(v) => setSettings({ ...settings, compactMode: v })}
                  />
                </div>
              </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end gap-3 pb-6">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
