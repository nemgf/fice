// Responsive drawer (top on tablet, side on mobile) + overlay + fade 1s on link click
(() => {
  const init = () => {
    const hamburger = document.getElementById("hamburger");
    const navMobile = document.getElementById("nav-mobile");
    const navClose  = document.getElementById("nav-close");
    if (!hamburger || !navMobile) return;

    // create overlay once
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

    const applyOrientation = () => {
      const mobile = isMobile();
      navMobile.classList.toggle('side', mobile);
      navMobile.classList.toggle('top', !mobile);
    };

    const openMenu = () => {
      applyOrientation();
      // cancel any closing animation
      if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null; navMobile.classList.remove('closing'); }
      // show overlay + lock body
      overlay.classList.add('visible');
      document.documentElement.classList.add('nav-lock');
      // show nav
      navMobile.style.display = 'block';
      void navMobile.offsetWidth; // force reflow
      navMobile.classList.add('show'); // triggers CSS transform
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

    const closeMenu = (opts = {}) => {
      const mobile = isMobile();
      const fromLink = !!opts.fromLink;
      // remove show state
      navMobile.classList.remove('show');
      hamburger.classList.remove('open');
      hamburger.setAttribute("aria-expanded", "false");
      navMobile.setAttribute("aria-hidden", "true");

      if (fromLink && mobile) {
        // fade & slide out 1s
        navMobile.classList.add('closing');
        overlay.classList.remove('visible'); // overlay hides faster (no fade necessary)
        closeTimeout = setTimeout(() => { navMobile.classList.remove('closing'); hideNavCompletely(); closeTimeout = null; hamburger.focus({ preventScroll:true }); }, 1000);
      } else {
        // quick close, matches .35s transition
        closeTimeout = setTimeout(() => { hideNavCompletely(); closeTimeout = null; hamburger.focus({ preventScroll:true }); }, 350);
      }
    };

    // initial attributes and classes
    hamburger.setAttribute("aria-expanded", "false");
    if (!navMobile.hasAttribute("aria-hidden")) navMobile.setAttribute("aria-hidden", "true");
    if (getComputedStyle(navMobile).display === "none") navMobile.style.display = "none";
    applyOrientation();

    // interactions
    hamburger.addEventListener("click", (e) => { e.preventDefault(); navMobile.classList.contains('show') ? closeMenu() : openMenu(); });
    if (navClose) navClose.addEventListener("click", (e)=>{ e.preventDefault(); closeMenu(); });

    // clicking overlay closes menu
    overlay.addEventListener('click', closeMenu);

    // links: if clicked, close (fade on mobile) and then navigate/scroll after delay
    navMobile.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href") || "";
        const mobile = isMobile();
        const isHash = href.startsWith("#");
        const isExternal = /^(https?:)?\/\//i.test(href) && !href.startsWith(location.origin) && !href.startsWith('/');

        if (!isHash && isExternal) {
          // external: close quickly and let browser handle navigation
          closeMenu({ fromLink: false });
          return;
        }

        // prevent immediate navigation so we can animate close
        e.preventDefault();
        closeMenu({ fromLink: mobile });
        const delay = mobile ? 1000 : 350;
        setTimeout(() => {
          if (isHash) {
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: "smooth" });
            history.replaceState(null, "", href);
          } else {
            window.location.href = a.href;
          }
        }, delay);
      });
    });

    // escape to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMobile.classList.contains("show")) { e.preventDefault(); closeMenu(); }
    });

    // on resize re-apply orientation and close on desktop
    const BREAK_DESK = 1024;
    window.addEventListener("resize", () => {
      applyOrientation();
      if (window.innerWidth > BREAK_DESK && navMobile.classList.contains("show")) closeMenu();
    });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
