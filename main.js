// ==============================
// Menú hamburguesa: slide top in/out
// ==============================
(() => {
  const init = () => {
    const hamburger = document.getElementById("hamburger");
    const navMobile = document.getElementById("nav-mobile");
    const navClose  = document.getElementById("nav-close");
    if (!hamburger || !navMobile) return;

    const firstLink = navMobile.querySelector("a");

    const openMenu = () => {
      navMobile.classList.add("show");
      hamburger.classList.add("open");
      hamburger.setAttribute("aria-expanded", "true");
      navMobile.setAttribute("aria-hidden", "false");
      if (firstLink) firstLink.focus({ preventScroll: true });
    };

    const closeMenu = () => {
      navMobile.classList.remove("show");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      navMobile.setAttribute("aria-hidden", "true");
      hamburger.focus({ preventScroll: true });
    };

    // Toggle con el botón hamburguesa
    hamburger.addEventListener("click", () => {
      navMobile.classList.contains("show") ? closeMenu() : openMenu();
    });

    // Botón X dentro del drawer
    if (navClose) navClose.addEventListener("click", closeMenu);

    // Cerrar al hacer clic en un enlace del menú
    navMobile.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", closeMenu)
    );

    // Cerrar con Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMobile.classList.contains("show")) {
        closeMenu();
      }
    });

    // Reset si pasas a desktop (>1024px)
    const BREAKPOINT = 1024;
    window.addEventListener("resize", () => {
      if (window.innerWidth > BREAKPOINT) closeMenu();
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
