import { useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { Outlet } from "react-router-dom";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem("theme");

  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem("theme", theme);
  }, [isDark, theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="min-h-screen bg-background px-4 pt-16 text-foreground sm:pt-24">
      <button
        type="button"
        aria-label={isDark ? "Alterar para tema claro" : "Alterar para tema escuro"}
        aria-pressed={isDark}
        title={isDark ? "Tema claro" : "Tema escuro"}
        onClick={toggleTheme}
        className="fixed right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card text-card-foreground shadow-md transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {isDark ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
      </button>
      <Outlet />
    </div>
  );
}

export default App;
