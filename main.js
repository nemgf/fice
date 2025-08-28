// ==============================
// Menú hamburguesa: slide top in/out
// ==============================
(() => {
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

  // Cerrar al hacer clic en un enlace
  navMobile.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", closeMenu)
  );

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMobile.classList.contains("show")) {
      closeMenu();
    }
  });
})();
