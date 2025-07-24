import { ThemeProvider, CssBaseline } from "@mui/material";
import { createAppTheme } from "./theme";
import type { PropsWithChildren } from "react";
import { useThemeContext, ThemeContextProvider } from "./contexts/ThemeContext";
import { useMemo } from "react";

function InnerThemeProvider({ children }: PropsWithChildren) {
  const { actualMode } = useThemeContext();

  // Usar useMemo para evitar recriar o tema desnecessariamente
  const theme = useMemo(() => {
    return createAppTheme(actualMode === "dark");
  }, [actualMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  return (
    <ThemeContextProvider>
      <InnerThemeProvider>{children}</InnerThemeProvider>
    </ThemeContextProvider>
  );
}
