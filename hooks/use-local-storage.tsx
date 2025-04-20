"use client"

export function useLocalStorage() {
  const STORAGE_KEY = "hiit-timer-settings"

  const getStoredSettings = () => {
    if (typeof window === "undefined") return null

    try {
      const storedSettings = localStorage.getItem(STORAGE_KEY)
      return storedSettings ? JSON.parse(storedSettings) : null
    } catch (error) {
      console.error("Error retrieving settings from localStorage:", error)
      return null
    }
  }

  const storeSettings = (settings) => {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error("Error storing settings in localStorage:", error)
    }
  }

  return { getStoredSettings, storeSettings }
}
