import React, { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextProps {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colorScheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextProps>({
  mode: "system",
  setMode: () => {},
  colorScheme: "light",
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme() ?? "light";
   console.log("systemScheme:", systemScheme);
  const [mode, setMode] = useState<ThemeMode>("system");

  // If user sets mode to "system", use device theme; otherwise use user's choice
  const colorScheme = mode === "system" ? systemScheme : mode;

  return (
    <ThemeContext.Provider value={{ mode, setMode, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);