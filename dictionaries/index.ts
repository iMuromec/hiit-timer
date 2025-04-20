import { ru } from "./ru";
import { en } from "./en";
import { zh } from "./zh";
import { ar } from "./ar";
import { hi } from "./hi";
import { es } from "./es";
import { bn } from "./bn";
import { pt } from "./pt";
import { ja } from "./ja";
import { de } from "./de";
import { ko } from "./ko";
import { fr } from "./fr";
import { jv } from "./jv";
import { it } from "./it";
import { tr } from "./tr";

import { defaultLanguage } from "@/lib/languages";

const dictionaries = {
  ru,
  en,
  zh,
  ar,
  hi,
  es,
  bn,
  pt,
  ja,
  de,
  ko,
  fr,
  jv,
  it,
  tr,
};

// Explicitly define all required fields to ensure type-safety
export interface Dictionary {
  // Language metadata
  lang: string;
  title: string;
  description: string;

  // UI translations
  prep: string;
  work: string;
  rest: string;
  start: string;
  pause: string;
  resume: string;
  reset: string;
  settings: string;
  fullscreen: string;
  sound: string;
  round: string;
  rounds: string;
  next: string;
  of: string;
  prepTime: string;
  workTime: string;
  restTime: string;
  numRounds: string;
  save: string;
  cancel: string;
  language: string;
  selectLanguage: string;
  hiitTimer: string;
  timerSettings: string;
  done: string;
  resetConfirmTitle: string;
  resetConfirmMessage: string;
  confirm: string;

  // Additional fields can be added here
  [key: string]: string;
}

export const getDictionary = (locale: string): Dictionary => {
  if (!Object.keys(dictionaries).includes(locale)) {
    return dictionaries[defaultLanguage as keyof typeof dictionaries];
  }
  return dictionaries[locale as keyof typeof dictionaries];
};
