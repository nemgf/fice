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

/* === Full Ice · Init branding del drawer (idempotente) === */
(function initFullIceDrawerBranding() {
  const nav = document.querySelector('nav#nav-mobile');
  if (!nav) return;

  // ---- helpers ----
  const seg = location.pathname.split('/').filter(Boolean)[0] || '';
  const BASE = location.origin + (seg ? `/${seg}/` : '/');
  const norm = s => (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');

  // ---- brand superior: clona el logo del header ----
  let brand = nav.querySelector('.fi-nav-brand');
  if (!brand) { brand = document.createElement('div'); brand.className = 'fi-nav-brand'; nav.insertBefore(brand, nav.firstChild); }
  if (!brand.querySelector('img,svg')) {
    const headerLogo = document.querySelector('header img, header svg');
    if (headerLogo) brand.appendChild(headerLogo.cloneNode(true));
  }

  // ---- wrap de links ----
  let links = nav.querySelector('.fi-links');
  if (!links) {
    links = document.createElement('div'); links.className = 'fi-links';
    [...nav.querySelectorAll(':scope > a')].forEach(a => links.appendChild(a));
    if (!links.parentNode) brand.after(links);
  }

  // ---- iconografía: mantener los existentes; sólo forzar Beneficios ----
  const benefitIconUrl = BASE + 'assets/fulliceicon.svg';
  const svgs = {
    home:  `<svg viewBox="0 0 24 24"><path d="M3 9.5l9-7 9 7"/><path d="M9 22V12h6v10"/></svg>`,
    user:  `<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5 21v-2c0-3.5 3.5-5 7-5s7 1.5 7 5v2"/></svg>`,
    star:  `<svg viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3L6 14.2 1 9.3l6.9-1z"/></svg>`,
    phone: `<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.6.6A2 2 0 0 1 22 16.9z"/></svg>`
  };

  links.querySelectorAll('a').forEach(a => {
    const t = norm(a.textContent.trim());
    let ico = a.querySelector('.fi-ico');
    if (!ico) { ico = document.createElement('span'); ico.className = 'fi-ico'; a.prepend(ico); }
    if (t.includes('benef')) {
      ico.innerHTML = `<img src="${benefitIconUrl}" alt="Beneficios">`;
      return;
    }
    // Si ya hay ícono, respétalo
    if (ico.innerHTML.trim()) return;
    // Si no hay, ponemos uno por defecto según el texto
    if (t.includes('inicio'))                   { ico.innerHTML = svgs.home;  return; }
    if (t.includes('servicio'))                 { ico.innerHTML = svgs.user;  return; }
    if (t.includes('casos') || t.includes('exito')) { ico.innerHTML = svgs.star;  return; }
    if (t.includes('contact'))                  { ico.innerHTML = svgs.phone; return; }
  });

  // ---- sello inferior: imagotipo + texto Roboto en línea ----
  let sign = nav.querySelector('.fi-nav-sign');
  if (!sign) { sign = document.createElement('div'); sign.className = 'fi-nav-sign'; nav.appendChild(sign); }
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
})();
