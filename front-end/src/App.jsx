import { useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { LuScanLine, LuArrowUpRight } from "react-icons/lu";
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
    <div className="app-shell">
      <header className="studio-header">
        <a className="studio-brand" href="/" aria-label="Poster Generator — início">
          <span className="brand-mark"><LuScanLine aria-hidden="true" /></span>
          <span>poster<span className="brand-light">studio</span><small>GERADOR DE CARTAZES</small></span>
        </a>
        <div className="header-actions">
          <a className="header-create" href="#editor">Área de criação <LuArrowUpRight aria-hidden="true" /></a>
          <button
            type="button"
            aria-label={isDark ? "Alterar para tema claro" : "Alterar para tema escuro"}
            aria-pressed={isDark}
            title={isDark ? "Tema claro" : "Tema escuro"}
            onClick={toggleTheme}
            className="theme-toggle"
          >
            {isDark ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

export default App;
