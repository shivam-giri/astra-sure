import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const ColorModeContext = createContext({ mode: "light", toggle: () => {} });
export const useColorMode = () => useContext(ColorModeContext);

function getInitialMode() {
  // 1) honor saved preference
  const saved = localStorage.getItem("color-scheme");
  if (saved === "light" || saved === "dark") return saved;

  // 2) fallback to system preference
  if (typeof window !== "undefined") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }
  return "light";
}

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);

  // Follow system changes only if user hasn't explicitly set a choice
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      const hasUserChoice = !!localStorage.getItem("color-scheme");
      if (!hasUserChoice) setMode(e.matches ? "dark" : "light");
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  // Useful for styling hooks or global CSS
  useEffect(() => {
    document.documentElement.setAttribute("data-color-scheme", mode);
  }, [mode]);

  const toggle = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("color-scheme", next);
      return next;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: { main: "#1976d2" },
                background: { default: "#fafafa", paper: "#fff" },
                text: { primary: "#0d1b2a" },
              }
            : {
                primary: { main: "#90caf9" },
                background: { default: "#0b1220", paper: "#0f172a" },
                text: { primary: "#e1e7ef" },
              }),
        },
        shape: { borderRadius: 10 },
        typography: {
          fontFamily: '"Inter","Roboto","Helvetica","Arial",sans-serif',
        },
        components: {
          MuiPaper: {
            styleOverrides: { root: { transition: "background-color .2s ease" } },
          },
          MuiButton: {
            styleOverrides: { root: { borderRadius: 8 } },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}