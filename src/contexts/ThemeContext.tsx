import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type ThemeMode = "light" | "dark" | "auto";

interface ThemeContextType {
  themeMode: ThemeMode;
  actualMode: "light" | "dark";
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeContextProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem("portal-theme-mode");
      return (saved as ThemeMode) || "light"; // Começar com light por padrão
    } catch {
      return "light";
    }
  });

  const [actualMode, setActualMode] = useState<"light" | "dark">("light");

  // Detectar preferência do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateActualMode = () => {
      if (themeMode === "auto") {
        setActualMode(mediaQuery.matches ? "dark" : "light");
      } else {
        setActualMode(themeMode);
      }
    };

    updateActualMode();
    mediaQuery.addEventListener("change", updateActualMode);

    return () => mediaQuery.removeEventListener("change", updateActualMode);
  }, [themeMode]);

  // Salvar no localStorage
  useEffect(() => {
    try {
      localStorage.setItem("portal-theme-mode", themeMode);
    } catch (error) {
      console.warn("Erro ao salvar tema:", error);
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        actualMode,
        toggleTheme,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useThemeContext must be used within a ThemeContextProvider"
    );
  }
  return context;
}
