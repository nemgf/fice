/* main.js — Full replacement: Drawer + Link scroll offset robusto + Branding (copy-paste whole file) */

/* Drawer lateral (tablet + móvil) con overlay y fade al cerrar */
(() => {
  const init = () => {
    const hamburger = document.getElementById("hamburger");
    const navMobile = document.getElementById("nav-mobile");
    const navClose  = document.getElementById("nav-close");
    if (!hamburger || !navMobile) return;

    // overlay (idempotente y transparente)
    let overlay = document.getElementById('nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'nav-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      // estilos mínimos (si no están en CSS)
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.background = 'transparent'; // dejamos transparente, solo captura clics
      overlay.style.zIndex = '998';
      overlay.style.pointerEvents = 'none';
      document.body.appendChild(overlay);
    }

    const firstLink = navMobile.querySelector("a");
    const isMobile = () => window.matchMedia("(max-width:767px)").matches;
    let closeTimeout = null;

    const applyWidth = () => {
      if (isMobile()) {
        navMobile.style.width = "100vw";   // móvil ocupa todo
      } else {
        // usamos 60vw pero limitamos a 480px
        const vw = Math.round(window.innerWidth * 0.6);
        navMobile.style.width = (vw > 480 ? "480px" : vw + "px");
      }
    };

    const openMenu = () => {
      applyWidth();
      if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null; navMobile.classList.remove('closing'); }
      overlay.classList.add('visible');
      overlay.style.pointerEvents = 'auto';
      document.documentElement.classList.add('nav-lock');
      navMobile.style.display = 'block';
      void navMobile.offsetWidth; // reflow for animation
      navMobile.classList.add('show');
      hamburger.classList.add('open');
      hamburger.setAttribute("aria-expanded", "true");
      navMobile.setAttribute("aria-hidden", "false");
      if (firstLink) firstLink.focus({ preventScroll: true });
    };

    const hideNavCompletely = () => {
      navMobile.style.display = 'none';
      overlay.classList.remove('visible');
      overlay.style.pointerEvents = 'none';
      document.documentElement.classList.remove('nav-lock');
    };

    const closeMenu = () => {
      // start fade/close
      navMobile.classList.remove('show');
      navMobile.classList.add('closing');
      hamburger.classList.remove('open');
      hamburger.setAttribute("aria-expanded", "false");
      navMobile.setAttribute("aria-hidden", "true");

      // after fade duration hide for real
      closeTimeout = setTimeout(() => {
        navMobile.classList.remove('closing');
        hideNavCompletely();
        closeTimeout = null;
        try { hamburger.focus({ preventScroll:true }); } catch(e){}
      }, 1000); // fade out 1s
    };

    // init ARIA and styles idempotent
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

    // links: add listeners once (idempotent)
    const attachLinkHandlers = () => {
      navMobile.querySelectorAll("a").forEach(a => {
        if (a.dataset.fiLinked) return; // already attached
        a.dataset.fiLinked = "1";
        a.addEventListener("click", (e) => {
          const href = a.getAttribute("href") || "";
          const isHash = href.startsWith("#");

          e.preventDefault();
          closeMenu();

          // Esperamos al fade out (1s) y luego hacemos un cálculo robusto y retried del scroll
          setTimeout(() => {
            if (isHash) {
              const target = document.querySelector(href);
              if (!target) return;

              // altura del header (si existe)
              const header = document.querySelector('header');
              const headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
              const extra = 12;

              // función que calcula y hace scroll con seguridad
              const computeAndScroll = () => {
                const rect = target.getBoundingClientRect();
                const absoluteTop = (typeof window.pageYOffset === 'number' ? window.pageYOffset : window.scrollY) + rect.top;
                const docTop = absoluteTop || (target.offsetTop || 0);
                const finalTop = Math.max(0, Math.round(docTop - headerH - extra));

                if (Math.abs(window.scrollY - finalTop) <= 2) return;
                window.scrollTo({ top: finalTop, behavior: 'smooth' });
              };

              // Ejecutar tras dos rafs (espera al siguiente repaint) y con fallback timeout corto
              requestAnimationFrame(() => requestAnimationFrame(computeAndScroll));
              setTimeout(computeAndScroll, 80);
              // actualiza URL sin recargar
              try { history.replaceState(null, "", href); } catch(e){}
            } else {
              window.location.href = a.href;
            }
          }, 1000); // coincide con fade
        }, { passive: false });
      });
    };

    // initial attach and also reattach on resize (in case nav content changes)
    attachLinkHandlers();

    // keyboard escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMobile.classList.contains("show")) {
        e.preventDefault();
        closeMenu();
      }
    });

    // adjust width on resize and reattach handlers if new anchors appear
    window.addEventListener("resize", () => {
      applyWidth();
      attachLinkHandlers();
    });

    // expose for debugging (optional)
    navMobile.__fi = { openMenu, closeMenu, attachLinkHandlers };

  }; // end init

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* === Full Ice · Init branding del drawer (idempotente) === */
(function initFullIceDrawerBranding() {
  const nav = document.querySelector('nav#nav-mobile');
  if (!nav) return;

  // helpers
  const seg = location.pathname.split('/').filter(Boolean)[0] || '';
  const BASE = location.origin + (seg ? `/${seg}/` : '/');
  const norm = s => (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');

  // brand top (clona logo del header si existe)
  let brand = nav.querySelector('.fi-nav-brand');
  if (!brand) {
    brand = document.createElement('div');
    brand.className = 'fi-nav-brand';
    nav.insertBefore(brand, nav.firstChild);
  }
  if (!brand.querySelector('img,svg')) {
    const headerLogo = document.querySelector('header img, header svg');
    if (headerLogo) brand.appendChild(headerLogo.cloneNode(true));
  }

  // wrap links: take direct child anchors and group them
  let links = nav.querySelector('.fi-links');
  if (!links) {
    links = document.createElement('div');
    links.className = 'fi-links';
    // move only direct a children (avoid moving nested markup)
    [...nav.querySelectorAll(':scope > a')].forEach(a => links.appendChild(a));
    brand.after(links);
  }

  // Íconos por defecto (inline SVG)
  const svgs = {
    home:  `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9.5l9-7 9 7"/><path d="M9 22V12h6v10"/></svg>`,
    user:  `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M5 21v-2c0-3.5 3.5-5 7-5s7 1.5 7 5v2"/></svg>`,
    star:  `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3L6 14.2 1 9.3l6.9-1z"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.6.6A2 2 0 0 1 22 16.9z"/></svg>`
  };

  // ensure icons and preserve any existing icon markup (only replace missing)
  const benefitIconUrl = BASE + 'assets/fulliceicon.svg';
  links.querySelectorAll('a').forEach(a => {
    const t = norm(a.textContent || a.innerText || a.getAttribute('aria-label') || '');
    let ico = a.querySelector('.fi-ico');
    if (!ico) {
      ico = document.createElement('span');
      ico.className = 'fi-ico';
      a.prepend(ico);
    }
    // if it already has an image or svg inside, skip altering innerHTML (we preserve existing)
    const hasInner = !!ico.querySelector('svg, img, i');
    if (hasInner && !t.includes('benef')) return;

    if (t.includes('benef')) {
      ico.innerHTML = `<img src="${benefitIconUrl}" alt="Beneficios">`;
      return;
    }
    // only set default icons if no inner content
    if (!hasInner) {
      if (t.includes('inicio') || t.includes('home'))       { ico.innerHTML = svgs.home;   return; }
      if (t.includes('servicio') || t.includes('servicios')){ ico.innerHTML = svgs.user;   return; }
      if (t.includes('casos') || t.includes('exito'))       { ico.innerHTML = svgs.star;   return; }
      if (t.includes('contact'))                            { ico.innerHTML = svgs.phone;  return; }
    }
  });

  // sello inferior: imagotipo + texto Roboto en línea
  let sign = nav.querySelector('.fi-nav-sign');
  if (!sign) {
    sign = document.createElement('div');
    sign.className = 'fi-nav-sign';
    nav.appendChild(sign);
  }
  // set img if not present
  if (!sign.querySelector('img')) {
    const img = document.createElement('img');
    img.src = BASE + 'assets/imagotipo.webp';
    img.alt = 'Full Ice';
    sign.appendChild(img);
  }
  if (!sign.querySelector('.fi-cap')) {
    const cap = document.createElement('div');
    cap.className = 'fi-cap';
    cap.textContent = 'EXPERTOS EN AIRE ACONDICIONADO';
    sign.appendChild(cap);
  }

  // ensure link handlers are attached (in case branding runs after drawer init)
  try { if (nav.__fi && typeof nav.__fi.attachLinkHandlers === 'function') nav.__fi.attachLinkHandlers(); } catch(e){}

})(); // end branding

/* === Full Ice · Back to top (mobile/tablet) — persisted === */
(function initFiBackToTop(){
  if (document.getElementById('fi-backtotop')) return;

  // Create button
  const btn = document.createElement('button');
  btn.id = 'fi-backtotop';
  btn.type = 'button';
  btn.setAttribute('aria-label','Volver al inicio');
  btn.title = 'Subir al inicio';
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 15l6-6 6 6"/>
    </svg>
  `;
  document.body.appendChild(btn);

  const adjustPositionAboveWhats = () => {
    const candidate = document.querySelector('[id*="whats" i], [class*="whats" i], .whatsapp, .whats-fab, .whatsapp-fab, .whatsapp-button, .floating-whatsapp');
    if (candidate) {
      try {
        const r = candidate.getBoundingClientRect();
        const bottom = Math.max(56, Math.round(window.innerHeight - r.top + 12));
        btn.style.bottom = bottom + 'px';
        return;
      } catch(e){}
    }
    btn.style.bottom = '88px';
  };

  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset;
    if (y > 200) {
      btn.classList.add('show'); btn.classList.remove('hide');
    } else {
      btn.classList.remove('show'); btn.classList.add('hide');
    }
  };

  const scrollToTop = (e) => {
    e && e.preventDefault();
    try {
      const nav = document.getElementById('nav-mobile');
      if (nav && nav.classList.contains('show') && nav.__fi && typeof nav.__fi.closeMenu === 'function') {
        nav.__fi.closeMenu();
      }
    } catch(e){}
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  btn.addEventListener('click', scrollToTop);
  btn.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); scrollToTop(); } });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { adjustPositionAboveWhats(); onScroll(); }, { passive: true });

  adjustPositionAboveWhats();
  setTimeout(adjustPositionAboveWhats, 600);
  setTimeout(onScroll, 80);
})();
