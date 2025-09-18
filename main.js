// Drawer: tablet top/down (slide), mobile right→full (fade on close)
(() => {
  const init = () => {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav-mobile');
    const closeBtn = document.getElementById('nav-close');
    if (!hamburger || !nav) return;

    // overlay (debajo del nav)
    let overlay = document.getElementById('nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'nav-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);
    }

    const isMobile = () => matchMedia('(max-width:767px)').matches;
    let t = null;

    const openMenu = () => {
      if (t) { clearTimeout(t); t = null; }
      nav.classList.remove('closing');
      overlay.classList.add('visible');
      document.documentElement.classList.add('nav-lock');
      nav.style.display = 'block';
      void nav.offsetWidth;             // reflow
      nav.classList.add('show');        // dispara transición
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded','true');
      nav.setAttribute('aria-hidden','false');
      const first = nav.querySelector('a,button'); first && first.focus({preventScroll:true});
    };

    const hideNav = () => {
      nav.style.display = 'none';
      overlay.classList.remove('visible');
      document.documentElement.classList.remove('nav-lock');
    };

    const closeMenu = () => {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded','false');
      nav.setAttribute('aria-hidden','true');

      if (isMobile()) {
        // móvil: fade-out 1s, sin deslizar
        nav.classList.add('closing');        // mantenemos .show para que quede en X=0
        overlay.classList.remove('visible');
        t = setTimeout(() => {
          nav.classList.remove('closing');
          nav.classList.remove('show');
          hideNav();
          hamburger.focus({preventScroll:true});
          t = null;
        }, 1000);
      } else {
        // tablet: slide-up rápido
        nav.classList.remove('show');        // vuelve a translateY(-110%)
        overlay.classList.remove('visible');
        t = setTimeout(() => {
          hideNav();
          hamburger.focus({preventScroll:true});
          t = null;
        }, 350);
      }
    };

    // toggles
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      nav.classList.contains('show') ? closeMenu() : openMenu();
    });
    closeBtn && closeBtn.addEventListener('click', (e)=>{ e.preventDefault(); closeMenu(); });
    overlay.addEventListener('click', closeMenu);

    // links: cerrar y luego navegar/scroll
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href') || '';
        const isHash = href.startsWith('#');
        const external = /^(https?:)?\/\//i.test(href) && !href.startsWith(location.origin) && !href.startsWith('/');
        if (!isHash && external) { closeMenu(); return; }

        e.preventDefault();
        closeMenu();
        const delay = isMobile() ? 1000 : 350;
        setTimeout(() => {
          if (isHash) {
            const target = document.querySelector(href);
            target ? target.scrollIntoView({behavior:'smooth'}) : (location.hash = href);
            history.replaceState(null,'',href);
          } else {
            window.location.href = a.href;
          }
        }, delay);
      });
    });

    // limpieza en resize
    window.addEventListener('resize', () => {
      if (!nav.classList.contains('show')) nav.classList.remove('closing');
    });

    // a11y init
    hamburger.setAttribute('aria-expanded','false');
    if (!nav.hasAttribute('aria-hidden')) nav.setAttribute('aria-hidden','true');
    if (getComputedStyle(nav).display === 'none') nav.style.display = 'none';
  };

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded',init) : init();
})();
