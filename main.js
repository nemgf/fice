// ==============================
// Menú hamburguesa: slide in/out
// ==============================
const hamburger = document.getElementById("hamburger");
const navMobile = document.getElementById("nav-mobile");

if (hamburger && navMobile) {
  hamburger.addEventListener("click", () => {
    navMobile.classList.toggle("show");
    hamburger.classList.toggle("open");
    const expanded = hamburger.classList.contains("open");
    hamburger.setAttribute("aria-expanded", expanded ? "true" : "false");
  });

  // Cierra al hacer clic en un enlace
  navMobile.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      navMobile.classList.remove("show");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    })
  );
}
