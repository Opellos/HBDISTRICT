/* Dienstag, 13. Januar 2026 13:37 */

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

// script.js

// Lucide Icons initialisieren
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // Carousel Dots initialisieren (falls existierend)
  updateCarouselDots('carousel1');
  updateCarouselDots('carousel2');
  updateCarouselDots('carousel3');
  updateCarouselDots('carousel4');

  // Touch-Swipe Support
  document.querySelectorAll('.carousel-container').forEach(carousel => {
    let startX = 0;
    let scrollLeft = 0;

    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX;
      scrollLeft = carousel.scrollLeft;
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX;
      const walk = (startX - x) * 2;
      carousel.scrollLeft = scrollLeft + walk;
    }, { passive: true });
  });

  // 3.1 Slider initialisieren
  initK3Slider();
});

/**
 * Scrolls a carousel container by a specified direction.
 * @param {string} carouselId - The ID of the carousel container.
 * @param {number} direction - -1 for left, 1 for right.
 */
window.scrollCarousel = function (carouselId, direction) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;
  const scrollAmount = carousel.offsetWidth;
  carousel.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
};

/**
 * Navigates a carousel to a specific slide index.
 * @param {string} carouselId - The ID of the carousel container.
 * @param {number} index - The zero-based index of the slide to go to.
 */
window.goToSlide = function (carouselId, index) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;
  const scrollAmount = carousel.offsetWidth;
  carousel.scrollTo({ left: scrollAmount * index, behavior: 'smooth' });
};

/**
 * Updates the active state of carousel dots based on current scroll position.
 * @param {string} carouselId - The ID of the carousel container.
 */
function updateCarouselDots(carouselId) {
  const carousel = document.getElementById(carouselId);
  const dotsContainer = document.getElementById(carouselId + '-dots');
  if (!carousel || !dotsContainer) return;

  const applyState = () => {
    const scrollLeft = carousel.scrollLeft;
    const scrollWidth = carousel.offsetWidth || 1;
    const currentIndex = Math.round(scrollLeft / scrollWidth);

    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        if (carouselId === 'carousel1') {
          dot.classList.remove('bg-gray-300');
          dot.classList.add('bg-gray-900');
        } else {
          dot.classList.remove('bg-white/50');
          dot.classList.add('bg-white');
        }
      } else {
        if (carouselId === 'carousel1') {
          dot.classList.remove('bg-gray-900');
          dot.classList.add('bg-gray-300');
        } else {
          dot.classList.remove('bg-white');
          dot.classList.add('bg-white/50');
        }
      }
    });
  };

  carousel.addEventListener('scroll', applyState, { passive: true });
  applyState();
}

/**
 * Plays a video within a given element, hiding its thumbnail image and showing controls.
 * @param {HTMLElement} element - The parent element containing the video and image.
 */
window.playVideo = function (element) {
  const video = element.querySelector('video');
  const img = element.querySelector('img');
  const overlay = element.querySelector('.video-play-overlay');

  if (!video) return;

  if (img) img.classList.add('hidden');
  if (overlay) overlay.classList.add('hidden');

  video.classList.remove('hidden');
  video.setAttribute('controls', 'true');
  video.play().catch(() => {});
};

/**
 * 3.1 Slider (k3) – exakt einmal initialisieren
 */
function initK3Slider() {
  const track = document.getElementById('k3Track');
  const dotsWrap = document.getElementById('k3Dots');
  const shell = track?.closest('.k3-shell');
  const bg = shell?.querySelector('.k3-parallax');
  if (!track || !shell) return;

  const slides = Array.from(track.querySelectorAll('.k3-slide'));
  if (!slides.length) return;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const makeDots = () => {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'k3-dot';
      b.setAttribute('aria-label', 'Slide ' + (i + 1));
      b.addEventListener('click', () => {
        slides[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
      dotsWrap.appendChild(b);
    });
  };

  const activeIndex = () => {
    const r = track.getBoundingClientRect();
    const center = r.left + r.width / 2;

    let best = 0;
    let bestDist = Infinity;

    slides.forEach((el, i) => {
      const er = el.getBoundingClientRect();
      const c = er.left + er.width / 2;
      const d = Math.abs(c - center);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  };

  const setActive = (idx) => {
    slides.forEach((el, i) => el.classList.toggle('is-active', i === idx));
    if (dotsWrap) {
      const dots = Array.from(dotsWrap.querySelectorAll('.k3-dot'));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    }
  };

  const parallaxCaptions = () => {
    const tr = track.getBoundingClientRect();
    const center = tr.left + tr.width / 2;

    slides.forEach((el) => {
      const cap = el.querySelector('.k3-caption-inner');
      if (!cap) return;

      const er = el.getBoundingClientRect();
      const elCenter = er.left + er.width / 2;
      const delta = (elCenter - center) / tr.width;

      const x = clamp(delta * -26, -26, 26);
      const y = clamp(delta * 18, -18, 18);
      cap.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  };

  const parallaxBackground = () => {
    if (!bg) return;
    const max = track.scrollWidth - track.clientWidth;
    const p = max > 0 ? (track.scrollLeft / max) : 0;
    const x = (p - 0.5) * 120;
    bg.style.transform = `translate3d(${x}px,0,0) scale(1.08)`;
  };

  let autoplay = true;
  let last = performance.now();
  let idleTimer = 0;

  const pause = () => {
    autoplay = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { autoplay = true; }, 2000);
  };

  track.addEventListener('wheel', pause, { passive:true });
  track.addEventListener('pointerdown', pause);
  track.addEventListener('touchstart', pause, { passive:true });
  track.addEventListener('keydown', pause);

  const tick = (ts) => {
    const dt = Math.min(40, ts - last);
    last = ts;

    if (autoplay) {
      track.scrollLeft += 0.18 * dt;
      const end = track.scrollWidth - track.clientWidth - 2;
      if (track.scrollLeft >= end) track.scrollLeft = 0;
    }

    requestAnimationFrame(tick);
  };

  let raf = 0;
  const onScroll = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const idx = activeIndex();
      setActive(idx);
      parallaxCaptions();
      parallaxBackground();
    });
  };

  makeDots();
  onScroll();

  track.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', () => { makeDots(); onScroll(); });

  requestAnimationFrame(tick);
}
