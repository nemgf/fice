(() => {
  const init = () => {
    const hamburger = document.getElementById("hamburger");
    const navMobile = document.getElementById("nav-mobile");
    const navClose  = document.getElementById("nav-close");

    if (!hamburger || !navMobile) return;

    const lockScroll = () => document.body.style.overflow = 'hidden';
    const unlockScroll = () => document.body.style.overflow = '';

    const openMenu = () => {
      navMobile.classList.add("show");
      hamburger.classList.add("open");
      hamburger.setAttribute("aria-expanded", "true");
      navMobile.setAttribute("aria-hidden", "false");
      lockScroll();
    };

    const closeMenu = () => {
      navMobile.classList.remove("show");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      navMobile.setAttribute("aria-hidden", "true");
      unlockScroll();
      hamburger.focus({ preventScroll: true });
    };
    
    // Asegura el estado inicial correcto al cargar la página
    closeMenu();

    hamburger.addEventListener("click", () => {
      navMobile.classList.contains("show") ? closeMenu() : openMenu();
    });

    if (navClose) navClose.addEventListener("click", closeMenu);

    navMobile.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", closeMenu)
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMobile.classList.contains("show")) {
        closeMenu();
      }
    });

    const BREAKPOINT = 1024;
    window.addEventListener("resize", () => {
      if (window.innerWidth > BREAKPOINT && navMobile.classList.contains("show")) {
        closeMenu();
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
