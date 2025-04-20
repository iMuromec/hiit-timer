"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { translations } from "@/lib/translations";
import { getDictionary, type Dictionary } from "@/dictionaries";
import { useRouter } from "next/navigation";
import { defaultLanguage } from "@/lib/languages";

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
  initialLang = "en",
}: {
  children: ReactNode;
  initialLang?: string;
}) {
  const [language, setLanguageState] = useState(initialLang);
  const router = useRouter();

  useEffect(() => {
    // Store the current language in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("hiit-timer-language", language);
    }
  }, [language]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);

    // Navigate to the new language route
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname
        .split("/")
        .slice(2)
        .join("/");
      const newPath = `/${lang}${currentPath ? `/${currentPath}` : ""}`;
      router.push(newPath);
    }
  };

  // Translation function using type safety
  const t = (key: string): string => {
    try {
      // Get dictionary for the current language or default
      const dictionary = getDictionary(language);

      // Try to get from dictionary safely
      if (key in dictionary) {
        return String(dictionary[key as keyof Dictionary]);
      }

      // Fallback to default language
      return key;
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
