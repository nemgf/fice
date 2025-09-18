/* main.js - drawer control (tablet top / mobile side, fade-on-close mobile) */
(() => {
  const SELECTORS = {
    hamburger: '#hamburger',
    nav: '#nav-mobile',
    close: '#nav-close',
    overlay: '#nav-overlay'
  };

  const qs = (sel) => document.querySelector(sel);

  const hamburger = qs(SELECTORS.hamburger);
  const nav = qs(SELECTORS.nav);
  const closeBtn = qs(SELECTORS.close);
  let overlay = qs(SELECTORS.overlay);

  if (!nav || !hamburger) return;

  // create overlay if missing
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'nav-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
  }

  // breakpoint test: mobile if width < 768
  const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

  // ensure nav has initial class according to current device
  const applyVariantClass = () => {
    nav.classList.remove('top', 'side', 'show', 'closing');
    if (isMobile()) {
      nav.classList.add('side');
    } else {
      nav.classList.add('top');
    }
    // keep it hidden initially (transforms control visibility)
    nav.setAttribute('aria-hidden', 'true');
  };

  applyVariantClass();

  // open menu
  const openMenu = () => {
    if (nav._closingTimer) { clearTimeout(nav._closingTimer); nav._closingTimer = null; }
    nav.classList.remove('closing');
    overlay.classList.add('visible');
    document.documentElement.classList.add('nav-lock');
    nav.classList.add('show');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    nav.setAttribute('aria-hidden', 'false');

    // focus first link
    const first = nav.querySelector('a,button');
    first && first.focus({ preventScroll: true });
  };

  // hide helper: remove overlay & scroll lock
  const finalizeHide = () => {
    overlay.classList.remove('visible');
    document.documentElement.classList.remove('nav-lock');
  };

  // close menu with behavior depending on device
  const closeMenu = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');

    if (isMobile()) {
      // mobile: fade out (nav stays at X=0) for 1s
      nav.classList.add('closing');
      // after fade remove show and closing
      nav._closingTimer = setTimeout(() => {
        nav.classList.remove('show', 'closing');
        finalizeHide();
        hamburger.focus({ preventScroll: true });
        nav._closingTimer = null;
      }, 1000);
    } else {
      // tablet: slide up (remove .show => translateY negative)
      nav.classList.remove('show');
      // wait transition end (approx 350ms) then cleanup
      nav._closingTimer = setTimeout(() => {
        finalizeHide();
        hamburger.focus({ preventScroll: true });
        nav._closingTimer = null;
      }, 350);
    }
  };

  // toggle
  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    nav.classList.contains('show') ? closeMenu() : openMenu();
  });

  // close btn
  if (closeBtn) closeBtn.addEventListener('click', (e) => { e.preventDefault(); closeMenu(); });

  // overlay click closes
  overlay.addEventListener('click', (e) => { closeMenu(); });

  // handle link clicks: close first, then navigate (anchors = smooth scroll)
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href') || '';
      const isHash = href.startsWith('#') && href.length > 1;
      // prevent double-navigations, close then navigate after delay
      e.preventDefault();
      closeMenu();

      const delay = isMobile() ? 1000 : 350;
      setTimeout(() => {
        if (isHash) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            // update hash without adding history entry
            history.replaceState(null, '', href);
          } else {
            // fallback: set location
            location.hash = href;
          }
        } else {
          // external or regular link
          location.href = a.href;
        }
      }, delay);
    });
  });

  // keep variant class in sync on resize (debounced)
  let rto = null;
  window.addEventListener('resize', () => {
    if (rto) clearTimeout(rto);
    rto = setTimeout(() => {
      // if variant changed, reapply classes and close menu
      const currentIsMobile = nav.classList.contains('side');
      if (isMobile() && !currentIsMobile) {
        // switched to mobile
        nav.classList.remove('top'); nav.classList.add('side');
      } else if (!isMobile() && currentIsMobile) {
        // switched to tablet/desktop
        nav.classList.remove('side'); nav.classList.add('top');
      }
      // if open and passed desktop breakpoint, ensure no stuck closing state
      if (!nav.classList.contains('show')) {
        nav.classList.remove('closing');
      }
    }, 120);
  });

  // accessibility defaults
  hamburger.setAttribute('aria-expanded', 'false');
  if (!nav.hasAttribute('aria-hidden')) nav.setAttribute('aria-hidden', 'true');
})();
