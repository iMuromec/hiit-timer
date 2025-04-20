"use client";

import { useState, useEffect, useCallback } from "react";

export function useAudio() {
  const [isSoundEnabled, setSoundEnabled] = useState(true);
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    // Initialize audio context on client side
    if (typeof window !== "undefined" && !audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        setAudioContext(new AudioContext());
      }
    }

    // Load sound preference from localStorage
    const storedSoundPref = localStorage.getItem("hiit-timer-sound");
    if (storedSoundPref !== null) {
      setSoundEnabled(storedSoundPref === "true");
    }

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioContext]);

  const toggleSound = useCallback(() => {
    const newValue = !isSoundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem("hiit-timer-sound", String(newValue));
  }, [isSoundEnabled]);

  const playSound = useCallback(
    (type) => {
      if (!audioContext || !isSoundEnabled) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different sound types
      switch (type) {
        case "countdown":
          oscillator.frequency.value = 800;
          gainNode.gain.value = 0.2;
          oscillator.start();
          setTimeout(() => oscillator.stop(), 200);
          break;
        case "phaseChange":
          oscillator.frequency.value = 1000;
          gainNode.gain.value = 0.3;
          oscillator.start();
          setTimeout(() => {
            oscillator.frequency.value = 1200;
            setTimeout(() => oscillator.stop(), 200);
          }, 200);
          break;
        case "complete":
          oscillator.frequency.value = 800;
          gainNode.gain.value = 0.3;
          oscillator.start();
          setTimeout(() => {
            oscillator.frequency.value = 1000;
            setTimeout(() => {
              oscillator.frequency.value = 1200;
              setTimeout(() => oscillator.stop(), 300);
            }, 300);
          }, 300);
          break;
        default:
          oscillator.frequency.value = 440;
          gainNode.gain.value = 0.2;
          oscillator.start();
          setTimeout(() => oscillator.stop(), 200);
      }
    },
    [audioContext, isSoundEnabled]
  );

  return { playSound, toggleSound, isSoundEnabled };
}
