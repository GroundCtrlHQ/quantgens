"use client"

import { Upload, FileCode, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UploadModel() {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-foreground">Upload Your Model</h3>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        Share your quantitative models with the community. Earn commissions on premium model sales.
      </p>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileCode className="h-3.5 w-3.5 text-primary" />
          <span>Supports Python, R, and Julia</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span>Your IP is protected via zero-trust sandbox</span>
        </div>
      </div>

      <Button className="w-full bg-primary hover:bg-primary/90">
        <Upload className="h-4 w-4 mr-2" />
        Upload Model
      </Button>
    </div>
  )
}
