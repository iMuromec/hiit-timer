"use client"

import { Button } from "@/components/ui/button"
import { Settings, Play, Pause, RotateCcw, Maximize, Minimize, Volume2, VolumeX } from "lucide-react"

interface ControlsProps {
  isRunning: boolean
  isPaused: boolean
  isFullscreen: boolean
  isSoundEnabled: boolean
  onStartPause: () => void
  onReset: () => void
  onFullscreen: () => void
  onToggleSettings: () => void
  onToggleSound: () => void
  t: (key: string) => string
}

export function Controls({
  isRunning,
  isPaused,
  isFullscreen,
  isSoundEnabled,
  onStartPause,
  onReset,
  onFullscreen,
  onToggleSettings,
  onToggleSound,
  t,
}: ControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center gap-4">
        <Button onClick={onStartPause} className="w-32 h-12 text-lg" variant="default">
          {isRunning ? (
            isPaused ? (
              <>
                <Play className="mr-2 h-5 w-5" />
                {t("resume")}
              </>
            ) : (
              <>
                <Pause className="mr-2 h-5 w-5" />
                {t("pause")}
              </>
            )
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              {t("start")}
            </>
          )}
        </Button>

        <Button onClick={onReset} variant="outline" className="h-12">
          <RotateCcw className="h-5 w-5" />
          <span className="sr-only">{t("reset")}</span>
        </Button>
      </div>

      <div className="flex justify-center gap-2">
        <Button onClick={onToggleSettings} variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">{t("settings")}</span>
        </Button>

        <Button onClick={onFullscreen} variant="ghost" size="icon">
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          <span className="sr-only">{t("fullscreen")}</span>
        </Button>

        <Button onClick={onToggleSound} variant="ghost" size="icon">
          {isSoundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          <span className="sr-only">{t("sound")}</span>
        </Button>
      </div>
    </div>
  )
}
