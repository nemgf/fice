// Drawer lateral (tablet + móvil) con overlay y fade al cerrar
(() => {
  const init = () => {
    const hamburger = document.getElementById("hamburger");
    const navMobile = document.getElementById("nav-mobile");
    const navClose  = document.getElementById("nav-close");
    if (!hamburger || !navMobile) return;

    // overlay
    let overlay = document.getElementById('nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'nav-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);
    }

    const firstLink = navMobile.querySelector("a");
    const isMobile = () => window.matchMedia("(max-width:767px)").matches;
    let closeTimeout = null;

    const applyWidth = () => {
      if (isMobile()) {
        navMobile.style.width = "100vw";   // móvil ocupa todo
      } else {
        navMobile.style.width = "60vw";    // tablet ocupa 60%
        if (parseInt(navMobile.style.width) > 480) {
          navMobile.style.width = "480px"; // ancho máx
        }
      }
    };

    const openMenu = () => {
      applyWidth();
      if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null; navMobile.classList.remove('closing'); }
      overlay.classList.add('visible');
      document.documentElement.classList.add('nav-lock');
      navMobile.style.display = 'block';
      void navMobile.offsetWidth;
      navMobile.classList.add('show');
      hamburger.classList.add('open');
      hamburger.setAttribute("aria-expanded", "true");
      navMobile.setAttribute("aria-hidden", "false");
      if (firstLink) firstLink.focus({ preventScroll: true });
    };

    const hideNavCompletely = () => {
      navMobile.style.display = 'none';
      overlay.classList.remove('visible');
      document.documentElement.classList.remove('nav-lock');
    };

    const closeMenu = () => {
      navMobile.classList.remove('show');
      navMobile.classList.add('closing');
      hamburger.classList.remove('open');
      hamburger.setAttribute("aria-expanded", "false");
      navMobile.setAttribute("aria-hidden", "true");

      closeTimeout = setTimeout(() => {
        navMobile.classList.remove('closing');
        hideNavCompletely();
        closeTimeout = null;
        hamburger.focus({ preventScroll:true });
      }, 1000); // fade out 1s
    };

    // init
    hamburger.setAttribute("aria-expanded", "false");
    if (!navMobile.hasAttribute("aria-hidden")) navMobile.setAttribute("aria-hidden", "true");
    if (getComputedStyle(navMobile).display === "none") navMobile.style.display = "none";
    applyWidth();

    // events
    hamburger.addEventListener("click", (e) => {
      e.preventDefault();
      navMobile.classList.contains('show') ? closeMenu() : openMenu();
    });
    if (navClose) navClose.addEventListener("click", (e)=>{ e.preventDefault(); closeMenu(); });
    overlay.addEventListener('click', closeMenu);

    // links
    navMobile.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href") || "";
        const isHash = href.startsWith("#");

        e.preventDefault();
        closeMenu();

        setTimeout(() => {
          if (isHash) {
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: "smooth" });
            history.replaceState(null, "", href);
          } else {
            window.location.href = a.href;
          }
        }, 1000); // espera fade out
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMobile.classList.contains("show")) {
        e.preventDefault();
        closeMenu();
      }
    });

    window.addEventListener("resize", applyWidth);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
