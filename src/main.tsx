import React from "react";
import ReactDOM from "react-dom/client";
import MainRoutes from "./routes";
import { AppThemeProvider } from "./ThemeProvider";
import "./pwa";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppThemeProvider>
      <MainRoutes />
    </AppThemeProvider>
  </React.StrictMode>
);
