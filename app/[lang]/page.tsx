"use client";

import { useState, useEffect } from "react";
import { Settings } from "@/components/settings";
import { TimerDisplay } from "@/components/timer-display";
import { useLanguage } from "@/hooks/use-language";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useAudio } from "@/hooks/use-audio";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

export default function HiitTimer() {
  const { t } = useLanguage();
  const { getStoredSettings, storeSettings } = useLocalStorage();
  const { playSound, toggleSound, isSoundEnabled } = useAudio();

  // Default settings
  const defaultSettings = {
    prepTime: 10,
    workTime: 30,
    restTime: 15,
    rounds: 5,
  };

  // Get stored settings or use defaults
  const [settings, setSettings] = useState(
    () => getStoredSettings() || defaultSettings
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("prep"); // prep, work, rest
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(settings.prepTime);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [totalWorkoutTimeRemaining, setTotalWorkoutTimeRemaining] = useState(
    settings.prepTime +
      (settings.workTime + settings.restTime) * settings.rounds
  );

  // Update time left when settings change
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(settings.prepTime);
      setTotalWorkoutTimeRemaining(
        settings.prepTime +
          (settings.workTime + settings.restTime) * settings.rounds
      );
    }
  }, [settings, isRunning]);

  // Timer logic
  useEffect(() => {
    let interval = null;

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((prevTime: number) => {
          // Play countdown sound for last 3 seconds of each phase
          if (prevTime <= 4 && prevTime > 1 && isSoundEnabled) {
            playSound("countdown");
          }

          if (prevTime <= 1) {
            // Phase complete
            if (isSoundEnabled) {
              playSound("phaseChange");
            }

            // Determine next phase
            if (currentPhase === "prep") {
              setCurrentPhase("work");
              return settings.workTime;
            } else if (currentPhase === "work") {
              setCurrentPhase("rest");
              return settings.restTime;
            } else if (currentPhase === "rest") {
              // Check if all rounds are complete
              if (currentRound >= settings.rounds) {
                // Workout complete
                setIsRunning(false);
                if (isSoundEnabled) {
                  playSound("complete");
                }
                // Reset to initial state when workout is complete
                setCurrentPhase("prep");
                setCurrentRound(1);
                setTotalWorkoutTimeRemaining(
                  settings.prepTime +
                    (settings.workTime + settings.restTime) * settings.rounds
                );
                return settings.prepTime;
              } else {
                // Next round - Update currentRound first, then change phase
                const nextRound = currentRound + 1;
                setCurrentRound(nextRound);
                setCurrentPhase("work");
                return settings.workTime;
              }
            }
          }
          return prevTime - 1;
        });

        // Decrease total workout time by 1 second
        setTotalWorkoutTimeRemaining((prev: number) => Math.max(0, prev - 1));
      }, 1000);
    }

    return () => clearInterval(interval as NodeJS.Timeout);
  }, [
    isRunning,
    isPaused,
    currentPhase,
    currentRound,
    settings,
    playSound,
    isSoundEnabled,
  ]);

  // Handle start/pause
  const handleStartPause = () => {
    if (!isRunning) {
      // Start new workout
      setIsRunning(true);
      setIsPaused(false);
      setCurrentPhase("prep");
      setCurrentRound(1);
      setTimeLeft(settings.prepTime);
      // Reset total workout time
      setTotalWorkoutTimeRemaining(
        settings.prepTime +
          (settings.workTime + settings.restTime) * settings.rounds
      );
    } else {
      // Toggle pause
      setIsPaused(!isPaused);
    }
  };

  // Handle reset
  const handleReset = () => {
    if (isRunning) {
      setIsResetConfirmOpen(true);
    } else {
      // If timer is not running, reset without confirmation
      performReset();
    }
  };

  // Add this new function to perform the actual reset
  const performReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentPhase("prep");
    setCurrentRound(1);
    setTimeLeft(settings.prepTime);
    // Reset total workout time
    setTotalWorkoutTimeRemaining(
      settings.prepTime +
        (settings.workTime + settings.restTime) * settings.rounds
    );
    setIsResetConfirmOpen(false);
  };

  // Handle fullscreen
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle settings update
  const handleSettingsUpdate = (newSettings: typeof settings) => {
    setSettings(newSettings);
    storeSettings(newSettings);
    setIsSettingsOpen(false);

    if (!isRunning) {
      setTimeLeft(newSettings.prepTime);
      setTotalWorkoutTimeRemaining(
        newSettings.prepTime +
          (newSettings.workTime + newSettings.restTime) * newSettings.rounds
      );
    }
  };

  // Get next phase info
  const getNextPhaseInfo = () => {
    if (currentPhase === "prep") {
      return {
        phase: "work",
        time: settings.workTime,
      };
    } else if (currentPhase === "work") {
      return {
        phase: "rest",
        time: settings.restTime,
      };
    } else {
      return {
        phase: "work",
        time: settings.workTime,
      };
    }
  };

  const nextPhaseInfo = getNextPhaseInfo();

  return (
    <div className="min-h-screen flex flex-col">
      <TimerDisplay
        timeLeft={timeLeft}
        currentPhase={currentPhase}
        currentRound={currentRound}
        totalRounds={settings.rounds}
        nextPhaseInfo={nextPhaseInfo}
        isRunning={isRunning}
        isPaused={isPaused}
        onStartPause={handleStartPause}
        onReset={handleReset}
        onFullscreen={handleFullscreen}
        onToggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
        onToggleSound={toggleSound}
        isSoundEnabled={isSoundEnabled}
        isFullscreen={isFullscreen}
        t={t}
        workoutTimeRemaining={totalWorkoutTimeRemaining}
      />

      {isSettingsOpen && (
        <Settings
          settings={settings}
          onUpdate={handleSettingsUpdate}
          onCancel={() => setIsSettingsOpen(false)}
          t={t}
        />
      )}
      {isResetConfirmOpen && (
        <ConfirmationDialog
          isOpen={isResetConfirmOpen}
          onConfirm={performReset}
          onCancel={() => setIsResetConfirmOpen(false)}
          title={t("resetConfirmTitle")}
          message={t("resetConfirmMessage")}
          confirmText={t("confirm")}
          cancelText={t("cancel")}
        />
      )}
    </div>
  );
}
