/* Donnerstag, 18. Dezember 2025 13:50  */

document.addEventListener('DOMContentLoaded', function() {
	
	function playVideo(card) {
  const video = card.querySelector('video');
  const img = card.querySelector('img');
  const overlay = card.querySelector('.video-play-overlay');

  if (!video) return;

  if (img) img.classList.add('hidden');
  if (overlay) overlay.classList.add('hidden');

  video.classList.remove('hidden');
  video.setAttribute('controls', 'true');
  video.play();
}


  /* =========================
     SPLASH SCREEN (optional)
  ========================== */
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const splashAI = document.getElementById('splash-ai');
    let progress = 0;

    const interval = setInterval(() => {
      progress += 1;
      if (progressBar) progressBar.style.width = progress + '%';
      if (progressText) progressText.textContent = progress + '%';

      if (splashAI) {
        if (progress < 30) splashAI.textContent = 'Lade Branding-Module...';
        else if (progress < 60) splashAI.textContent = 'Initialisiere KI-Workflow...';
        else if (progress < 90) splashAI.textContent = 'Synchronisiere Projekte...';
        else splashAI.textContent = 'Bereit!';
      }

      if (progress >= 100) {
        clearInterval(interval);
        splashScreen.classList.add('hide');
        setTimeout(() => splashScreen.remove(), 600);
      }
    }, 25);
  }

  /* =========================
     STICKY HEADER SHADOW
  ========================== */
  const header = document.querySelector('.main-header');
  const onScrollHeader = () => {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add('header-scrolled');
    else header.classList.remove('header-scrolled');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* =========================
     BACK-TO-TOP BUTTON
  ========================== */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    const toggleBtn = () => backToTop.classList.toggle('show', window.scrollY > 400);
    toggleBtn();
    window.addEventListener('scroll', toggleBtn, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* =========================
     VIDEO LIGHTBOX (optional)
  ========================== */
  document.querySelectorAll('[data-video]').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-video');
      if (!url) return;
      const overlay = document.createElement('div');
      overlay.className = 'video-overlay';
      overlay.innerHTML = `
        <div class="video-wrapper">
          <button class="video-close" aria-label="Schließen">×</button>
          <iframe 
            src="${url}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen 
            title="Embedded video"
            style="position:absolute;top:0;left:0;width:100%;height:100%;">
          </iframe>
        </div>`;
      document.body.appendChild(overlay);
      overlay.querySelector('.video-close').addEventListener('click', () => overlay.remove());
      overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    });
  });

  /* =========================
     MOBILE NAV TOGGLE
  ========================== */
  const navToggle = document.querySelector('.navbar-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = mobileNav.classList.toggle('is-active');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && !navToggle.contains(e.target)) {
        mobileNav.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* =========================
     SMOOTH SCROLL + HEADER OFFSET
     (verhindert "Ansprung" unter festen Header)
  ========================== */
  const getHeaderOffset = () => {
    if (!header) return 0;
    const h = Math.ceil(header.getBoundingClientRect().height);
    return h > 0 ? h : 0;
  };
  const scrollToTargetWithOffset = (el) => {
    const top = el.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
    window.scrollTo({ top, behavior: 'smooth' });
  };
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToTargetWithOffset(target);
      // URL-Hash pflegen
      history.replaceState(null, "", '#'+id);
    });
  });

  /* =========================
     NAV ACTIVE (ONE-PAGER SCROLLSPY)
     - hält aktiven Menüpunkt rot + unterstrichen
     - erwartet: href="#section-id" und <section id="section-id">
  ========================== */
  const links = Array.from(document.querySelectorAll('.nav-left a, .nav-right a:not(.cta-button)'))
    .filter(a => a.hash && a.hash.length > 1);
  const linkByHash = new Map(links.map(a => [a.hash, a]));

  // Sofortiger Active-State beim Klick (bis Scrollspy übernimmt)
  links.forEach(a => a.addEventListener('click', () => {
    links.forEach(l => {
      l.classList.remove('is-active');
      l.removeAttribute('aria-current');
    });
    a.classList.add('is-active');
    a.setAttribute('aria-current','page');
  }));

  // Scrollspy: markiert den sichtbarsten Abschnitt
  const io = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;

    const hash = '#' + visible.target.id;
    const activeLink = linkByHash.get(hash);
    if (!activeLink) return;

    links.forEach(l => {
      l.classList.remove('is-active');
      l.removeAttribute('aria-current');
    });
    activeLink.classList.add('is-active');
    activeLink.setAttribute('aria-current','page');
  }, { root: null, threshold: [0.25, 0.5, 0.75], rootMargin: '0px 0px -40% 0px' });

  document.querySelectorAll('section[id]').forEach(sec => io.observe(sec));

  /* =========================
     VIDEO-CARD: PLAY HANDLER
  ========================== */
  window.playVideo = function (card) {
    const video   = card.querySelector('video');                 // Video-Element
    const img     = card.querySelector('img');                   // Vorschaubild
    const overlay = card.querySelector('.video-play-overlay');   // Play-Overlay

    if (!video) return;

    if (img) img.classList.add('hidden');          // Bild ausblenden
    if (overlay) overlay.classList.add('hidden');  // Overlay ausblenden

    video.classList.remove('hidden');              // Video einblenden
    video.setAttribute('controls', 'true');        // Controls aktivieren
    video.play();                                  // Abspielen
  };
  /* ===== END: VIDEO-CARD: PLAY HANDLER ===== */

  /* =========================
     LUCIDE ICONS (optional)
  ========================== */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

});

