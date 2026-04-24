"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Settings {
  arabicFontSize: number;
  translationFontSize: number;
  translationId: number;
  showTajweed: boolean;
  showTranslation: boolean;
  showLatin: boolean;
  tafsirId: number;
}

interface SettingsContextType extends Settings {
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  setTranslationId: (id: number) => void;
  setShowTajweed: (show: boolean) => void;
  setShowTranslation: (show: boolean) => void;
  setShowLatin: (show: boolean) => void;
  setTafsirId: (id: number) => void;
}

const DEFAULT_SETTINGS: Settings = {
  arabicFontSize: 32,
  translationFontSize: 16,
  translationId: 33, // Kemenag (ID)
  showTajweed: true,
  showTranslation: true,
  showLatin: true,
  tafsirId: 0,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on initial mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('syamna_quran_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('syamna_quran_settings', JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const setArabicFontSize = (size: number) => setSettings(prev => ({ ...prev, arabicFontSize: size }));
  const setTranslationFontSize = (size: number) => setSettings(prev => ({ ...prev, translationFontSize: size }));
  const setTranslationId = (id: number) => setSettings(prev => ({ ...prev, translationId: id }));
  const setShowTajweed = (show: boolean) => setSettings(prev => ({ ...prev, showTajweed: show }));
  const setShowTranslation = (show: boolean) => setSettings(prev => ({ ...prev, showTranslation: show }));
  const setShowLatin = (show: boolean) => setSettings(prev => ({ ...prev, showLatin: show }));
  const setTafsirId = (id: number) => setSettings(prev => ({ ...prev, tafsirId: id }));

  const value = {
    ...settings,
    setArabicFontSize,
    setTranslationFontSize,
    setTranslationId,
    setShowTajweed,
    setShowTranslation,
    setShowLatin,
    setTafsirId,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
