// Global theme manager
(() => {
  function applyTheme(mode) {
    const target = mode === "light" ? "light" : "dark";
    document.body.classList.toggle("light-theme", target === "light");
    localStorage.setItem("themeMode", target);
  }

  const stored = localStorage.getItem("themeMode") || "dark";

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => applyTheme(stored));
  } else {
    applyTheme(stored);
  }

  window.setAppTheme = applyTheme;
})();

