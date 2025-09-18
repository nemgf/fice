// ==============================
// Responsive drawer: top on tablet, side on mobile + 1s fade on link click
// Reemplaza tu bloque anterior por este
// ==============================
(() => {
  const init = () => {
    const hamburger = document.getElementById("hamburger");
    const navMobile = document.getElementById("nav-mobile");
    const navClose  = document.getElementById("nav-close");
    if (!hamburger || !navMobile) return;

    // inject minimal CSS for the responsive behavior (safe, won't overwrite main rules)
    if (!document.getElementById("nav-mobile-responsive-style")) {
      const st = document.createElement("style");
      st.id = "nav-mobile-responsive-style";
      st.textContent = `
/* base */
.nav-mobile{ background:#fff; z-index:9999; box-shadow:0 8px 24px rgba(0,0,0,.12); }

/* top (tablet) - slide down from top */
.nav-mobile.top{
  position:fixed; left:0; right:0; top:0;
  width:100%; max-height:100vh; overflow:auto;
  transform: translateY(-110%); transition: transform .35s ease, opacity .35s ease;
  opacity:1;
}
.nav-mobile.top.show{ transform: translateY(0); }

/* side (mobile) - slide from right */
.nav-mobile.side{
  position:fixed; top:0; right:0; height:100vh;
  width:320px; max-width:90vw; overflow:auto;
  transform: translateX(110%); transition: transform .35s ease, opacity .35s ease;
  opacity:1;
}
.nav-mobile.side.show{ transform: translateX(0); }

/* closing state used when link-click on mobile: fade & slide out in 1s */
.nav-mobile.closing{ opacity:0; transition: opacity 1s ease, transform 1s ease; }
.nav-mobile.side.closing{ transform: translateX(110%); }
.nav-mobile.top.closing{ transform: translateY(-110%); }

/* ensure display:none is respected when hidden */
.nav-mobile[style*="display: none"]{ display:none !important; }
`;
      document.head.appendChild(st);
    }

    const firstLink = navMobile.querySelector("a");
    const isMobile = () => window.matchMedia("(max-width:767px)").matches;
    let closeTimeout = null;

    const applyOrientationClasses = () => {
      const mobile = isMobile();
      navMobile.classList.toggle("side", mobile);
      navMobile.classList.toggle("top", !mobile);
    };

    const openMenu = () => {
      // set correct orientation
      applyOrientationClasses();
      // cancel any running close timeout
      if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null; navMobile.classList.remove("closing"); }
      // make it visible and animate in
      navMobile.style.display = "block";
      // force reflow before adding show to trigger transition
      void navMobile.offsetWidth;
      navMobile.classList.add("show");
      hamburger.classList.add("open");
      hamburger.setAttribute("aria-expanded", "true");
      navMobile.setAttribute("aria-hidden", "false");
      if (firstLink) firstLink.focus({ preventScroll: true });
    };

    const closeMenu = (opts = {}) => {
      // opts.fromLink === true => fade behavior on mobile (1s)
      const mobile = isMobile();
      const fromLink = !!opts.fromLink;
      // remove open state
      navMobile.classList.remove("show");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      navMobile.setAttribute("aria-hidden", "true");

      if (fromLink && mobile) {
        // apply closing (1s fade) then hide
        navMobile.classList.add("closing");
        // ensure transform for proper slide-out is applied (class rules handle it)
        closeTimeout = setTimeout(() => {
          navMobile.classList.remove("closing");
          navMobile.style.display = "none";
          hamburger.focus({ preventScroll: true });
          closeTimeout = null;
        }, 1000);
      } else {
        // quick close (same timing as .top/.side transition)
        // hide after 350ms
        closeTimeout = setTimeout(() => {
          navMobile.style.display = "none";
          hamburger.focus({ preventScroll: true });
          closeTimeout = null;
        }, 350);
      }
    };

    // initial accessibility attributes
    hamburger.setAttribute("aria-expanded", "false");
    if (!navMobile.hasAttribute("aria-hidden")) navMobile.setAttribute("aria-hidden", "true");
    if (getComputedStyle(navMobile).display === "none") navMobile.style.display = "none";
    // ensure orientation classes on load
    applyOrientationClasses();

    // Toggle with hamburger
    hamburger.addEventListener("click", (e) => {
      e.preventDefault();
      navMobile.classList.contains("show") ? closeMenu() : openMenu();
    });

    // Close button inside drawer
    if (navClose) navClose.addEventListener("click", (e) => { e.preventDefault(); closeMenu(); });

    // Links: if clicked, close (fade on mobile) and handle internal anchors after close for smoother UX
    navMobile.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href") || "";
        const mobile = isMobile();
        // if it's an in-page anchor (starts with #) or same-origin link, we delay navigation until after close so fade is visible
        const isHash = href.startsWith("#");
        const isExternal = /^(https?:)?\/\//i.test(href) && !href.startsWith(location.origin) && !href.startsWith('/');
        // For external absolute links, just close and let browser navigate immediately
        if (!isHash && isExternal) {
          closeMenu({ fromLink: false });
          return;
        }

        // Prevent default navigation to play the fade
        e.preventDefault();
        // close with appropriate behavior
        closeMenu({ fromLink: mobile });
        const delay = mobile ? 1000 : 350;
        setTimeout(() => {
          if (isHash) {
            const target = document.querySelector(href);
            if (target) {
              // smooth scroll into view
              target.scrollIntoView({ behavior: "smooth" });
              // update URL hash without creating history entry
              history.replaceState(null, "", href);
            } else {
              // no element found, still update hash to keep link behavior
              location.hash = href;
            }
          } else {
            // relative or absolute same-origin link -> navigate
            window.location.href = a.href;
          }
        }, delay);
      });
    });

    // Escape to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMobile.classList.contains("show")) {
        e.preventDefault();
        closeMenu();
      }
    });

    // Reset/hide if you resize to desktop (use your BREAKPOINT if you prefer)
    const BREAKPOINT_DESKTOP = 1024;
    window.addEventListener("resize", () => {
      applyOrientationClasses();
      if (window.innerWidth > BREAKPOINT_DESKTOP && navMobile.classList.contains("show")) {
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
