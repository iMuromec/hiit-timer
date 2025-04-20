import { formatTime } from "@/lib/utils"

interface TimerProps {
  timeLeft: number
  currentPhase: string
  t: (key: string) => string
}

export function Timer({ timeLeft, currentPhase, t }: TimerProps) {
  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <div className="text-7xl font-bold tabular-nums">{formatTime(timeLeft)}</div>
      <div className="text-xl mt-2 font-medium">{t(currentPhase)}</div>
    </div>
  )
}
