import AsyncStorage from "@react-native-async-storage/async-storage";
import { reloadAppAsync } from "expo";
import * as Haptics from "expo-haptics";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { I18nManager, Platform } from "react-native";

import i18n from "@/i18n";

const LANG_KEY = "biomaster_language";
export type AppLanguage = "en" | "ar";

interface LanguageContextType {
  language: AppLanguage;
  isRTL: boolean;
  changeLanguage: (lang: AppLanguage) => Promise<void>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>("ar");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY)
      .then((saved) => {
        const lang: AppLanguage = saved === "en" ? "en" : "ar";
        setLanguage(lang);
        i18n.changeLanguage(lang);
        if (Platform.OS !== "web") {
          const shouldBeRTL = lang === "ar";
          if (I18nManager.isRTL !== shouldBeRTL) {
            I18nManager.forceRTL(shouldBeRTL);
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const changeLanguage = useCallback(async (lang: AppLanguage) => {
    Haptics.selectionAsync();
    await AsyncStorage.setItem(LANG_KEY, lang);

    const shouldBeRTL = lang === "ar";
    const needsRTLSwitch =
      Platform.OS !== "web" && I18nManager.isRTL !== shouldBeRTL;

    if (needsRTLSwitch) {
      I18nManager.forceRTL(shouldBeRTL);
      await reloadAppAsync("Language changed — applying RTL layout");
    } else {
      await i18n.changeLanguage(lang);
      setLanguage(lang);
    }
  }, []);

  const isRTL =
    Platform.OS !== "web" ? I18nManager.isRTL : language === "ar";

  return (
    <LanguageContext.Provider
      value={{ language, isRTL, changeLanguage, isLoading }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
