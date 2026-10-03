"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);
const THEME_STORAGE_EVENT = "thread-nextjs-theme-storage";

const isTheme = (value: string | null): value is Theme =>
  value === "dark" || value === "light" || value === "system";

const subscribeToThemeStorage = (onStoreChange: () => void) => {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_STORAGE_EVENT, onStoreChange);
  };
};

const getStoredTheme = (storageKey: string, defaultTheme: Theme) => {
  if (typeof window === "undefined") return defaultTheme;

  const storedTheme = localStorage.getItem(storageKey);
  return isTheme(storedTheme) ? storedTheme : defaultTheme;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const theme = useSyncExternalStore(
    subscribeToThemeStorage,
    () => getStoredTheme(storageKey, defaultTheme),
    () => defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const setTheme = useCallback(
    (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      window.dispatchEvent(new Event(THEME_STORAGE_EVENT));
    },
    [storageKey],
  );

  const value = useMemo(() => ({
    theme,
    setTheme,
  }), [setTheme, theme]);

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
