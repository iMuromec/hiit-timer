"use client";

import { formatTime } from "@/lib/utils";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useState } from "react";

interface TimerDisplayProps {
  timeLeft: number;
  currentPhase: string;
  currentRound: number;
  totalRounds: number;
  nextPhaseInfo: {
    phase: string;
    time: number;
  };
  isRunning: boolean;
  isPaused: boolean;
  isFullscreen: boolean;
  isSoundEnabled: boolean;
  onStartPause: () => void;
  onReset: () => void;
  onFullscreen: () => void;
  onToggleSettings: () => void;
  onToggleSound: () => void;
  t: (key: string) => string;
  workoutTimeRemaining?: number;
}

export function TimerDisplay({
  timeLeft,
  currentPhase,
  currentRound,
  totalRounds,
  nextPhaseInfo,
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
  workoutTimeRemaining,
}: TimerDisplayProps) {
  // State to track viewport size
  const [isMobile, setIsMobile] = useState(false);

  // Effect to check viewport size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Phase colors
  const phaseColors = {
    prep: "bg-[#fdff3c]",
    work: "bg-[#99ff47]",
    rest: "bg-[#f13829]",
  };

  // Format time as MM:SS
  const formattedTime = formatTime(timeLeft);

  // Split time into minutes and seconds
  const [minutes, seconds] = formattedTime.split(":");

  // Completely rewritten accurate calculation of total remaining workout time
  const calculateTotalRemainingTime = () => {
    // We'll use the most accurate values from nextPhaseInfo which contains real values from settings
    // First get the current phase time left
    let totalTime = timeLeft;

    // If this is the last round's rest phase, just return time left
    if (currentPhase === "rest" && currentRound === totalRounds) {
      return totalTime;
    }

    // We need to calculate remaining time in the current round plus all future rounds

    // Handle current round remaining phases
    if (currentPhase === "prep") {
      // Add workout time for current round
      totalTime += nextPhaseInfo.time; // workTime from settings

      // Add rest time for current round, using real rest time from nextPhaseInfo
      // In prep phase, nextPhaseInfo.phase is "work" and the phase after work is rest
      // We need to approximate rest time
      totalTime += nextPhaseInfo.time / 2; // Estimate rest as proportion of work time
    } else if (currentPhase === "work") {
      // Add rest time for current round
      totalTime += nextPhaseInfo.time; // restTime from settings
    }
    // For "rest" phase, we don't need to add any more time for the current round

    // Add time for remaining full rounds
    const remainingFullRounds =
      totalRounds - currentRound - (currentPhase === "rest" ? 1 : 0);

    if (remainingFullRounds > 0) {
      // For each remaining round, add work and rest time
      // For accurate values, we need workTime and restTime
      // Next phase gives us one of these values

      let workTime = 0;
      let restTime = 0;

      if (nextPhaseInfo.phase === "work") {
        // We know the exact work time
        workTime = nextPhaseInfo.time;
        // Estimate rest time based on usual 2:1 work:rest ratio
        restTime = Math.round(workTime / 2);
      } else if (nextPhaseInfo.phase === "rest") {
        // We know the exact rest time
        restTime = nextPhaseInfo.time;
        // Estimate work time based on usual 2:1 work:rest ratio
        workTime = restTime * 2;
      }

      // Calculate time per round and multiply by remaining rounds
      const timePerRound = workTime + restTime;
      totalTime += remainingFullRounds * timePerRound;
    }

    return totalTime;
  };

  // Use provided workout time remaining if available, otherwise calculate it
  const totalRemainingTime = workoutTimeRemaining
    ? formatTime(workoutTimeRemaining)
    : formatTime(calculateTotalRemainingTime());

  return (
    <div
      className={`flex flex-col h-screen ${
        phaseColors[currentPhase as keyof typeof phaseColors]
      } transition-colors duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 md:p-4 bg-black/10">
        {/* Empty div to maintain layout */}
        <div className="w-12 h-12 md:w-16 md:h-16"></div>

        {/* H1 and total remaining time in center */}
        <div className="flex flex-col items-center">
          {/* H1 heading */}
          <h1
            className={`text-sm md:text-base lg:text-lg font-bold uppercase ${
              currentPhase === "rest" ? "text-white" : "text-black/70"
            }`}
          >
            {t("hiitTimer")}
          </h1>

          {/* Total remaining workout time */}
          <div
            className={`text-base md:text-lg lg:text-xl font-bold ${
              currentPhase === "rest" ? "text-white" : "text-black"
            }`}
          >
            {totalRemainingTime}
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center"
        >
          <RotateCcw
            className={`w-5 h-5 md:w-6 md:h-6 ${
              currentPhase === "prep"
                ? "text-[#fdff3c]"
                : currentPhase === "work"
                ? "text-[#99ff47]"
                : "text-[#f13829]"
            }`}
          />
        </button>
      </div>

      {/* Main Timer - explicitly centered with flex */}
      <div className="flex-1 flex flex-col">
        {/* Current phase display - larger with more margin */}
        <div className="w-full text-center mt-14">
          <div
            className={`text-4xl md:text-4xl lg:text-5xl font-black uppercase ${
              currentPhase === "rest" ? "text-white" : "text-black"
            }`}
          >
            {t(currentPhase)}
          </div>
        </div>

        {/* Timer display centered in remaining space */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className={`text-[40vw] md:text-[20vw] lg:text-[25vw] md:-mt-[6rem] leading-none font-black ${
              currentPhase === "rest" ? "text-white" : "text-black"
            } tracking-tighter`}
          >
            {minutes}:{seconds}
          </div>
        </div>
      </div>

      {/* Footer with three equal blocks */}
      <div className="flex flex-col md:flex-row items-stretch">
        {/* Round info block */}
        <div
          className={`flex-1 flex items-center justify-center py-4 md:py-0 md:h-20 lg:h-24`}
        >
          <span
            className={`text-2xl md:text-2xl lg:text-3xl font-bold ${
              currentPhase === "rest" ? "text-white" : "text-black"
            }`}
          >
            {t("round").toUpperCase()} {currentRound} {t("of")} {totalRounds}
          </span>
        </div>

        {/* Play/Pause button block */}
        <div
          className={`flex-1 flex items-center justify-center py-4 md:py-0 md:h-20 lg:h-24`}
        >
          <button
            onClick={onStartPause}
            className="w-20 h-20 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-black rounded-full flex items-center justify-center mb-6"
          >
            {isRunning && !isPaused ? (
              <Pause
                className={`w-10 h-10 md:w-10 md:h-10 lg:w-12 lg:h-12 ${
                  currentPhase === "rest" ? "text-[#f13829]" : "text-green-400"
                }`}
              />
            ) : (
              <Play
                className={`w-10 h-10 md:w-10 md:h-10 lg:w-12 lg:h-12 ${
                  currentPhase === "rest" ? "text-[#f13829]" : "text-green-400"
                }`}
              />
            )}
          </button>
        </div>

        {/* Next phase info block */}
        <div
          className={`flex-1 ${
            phaseColors[nextPhaseInfo.phase as keyof typeof phaseColors]
          } flex items-center justify-center py-4 md:py-0 md:h-20 lg:h-24`}
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center flex-col">
              <span
                className={`text-sm md:text-sm lg:text-base uppercase font-medium ${
                  nextPhaseInfo.phase === "rest"
                    ? "text-white/80"
                    : "text-black/70"
                }`}
              >
                {t("next")}
              </span>
              <span
                className={`text-2xl md:text-2xl lg:text-3xl font-bold uppercase ${
                  nextPhaseInfo.phase === "rest" ? "text-white" : "text-black"
                }`}
              >
                {t(nextPhaseInfo.phase)}: {formatTime(nextPhaseInfo.time)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings buttons - small and discrete */}
      <div className="absolute bottom-28 md:bottom-24 lg:bottom-28 right-2 md:right-4 flex flex-col gap-2">
        <button
          onClick={onToggleSettings}
          className="w-8 h-8 md:w-10 md:h-10 bg-black/30 rounded-full flex items-center justify-center"
        >
          <Settings className="w-4 h-4 md:w-5 md:h-5 text-black" />
        </button>
        <button
          onClick={onFullscreen}
          className="w-8 h-8 md:w-10 md:h-10 bg-black/30 rounded-full flex items-center justify-center"
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4 md:w-5 md:h-5 text-black" />
          ) : (
            <Maximize className="w-4 h-4 md:w-5 md:h-5 text-black" />
          )}
        </button>
        <button
          onClick={onToggleSound}
          className="w-8 h-8 md:w-10 md:h-10 bg-black/30 rounded-full flex items-center justify-center"
        >
          {isSoundEnabled ? (
            <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-black" />
          ) : (
            <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-black" />
          )}
        </button>
      </div>
    </div>
  );
}
