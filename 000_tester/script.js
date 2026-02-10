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

  // Drag/Swipe + Tastaturzugriff für Carousels
  document.querySelectorAll('.carousel-container').forEach((carousel) => {
    let isPointerDown = false;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let moved = false;

    const startDrag = (event) => {
      isPointerDown = true;
      moved = false;
      startX = event.clientX;
      startY = event.clientY;
      scrollLeft = carousel.scrollLeft;
      carousel.classList.add('is-dragging');
      carousel.setPointerCapture?.(event.pointerId);
    };

    const moveDrag = (event) => {
      if (!isPointerDown) return;

      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      if (Math.abs(deltaX) > 6) moved = true;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        event.preventDefault();
        carousel.scrollLeft = scrollLeft - deltaX * 1.15;
      }
    };

    const endDrag = (event) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      carousel.classList.remove('is-dragging');
      if (event.pointerId != null) carousel.releasePointerCapture?.(event.pointerId);

      if (moved) {
        const suppressClick = (clickEvent) => {
          clickEvent.preventDefault();
          clickEvent.stopPropagation();
          carousel.removeEventListener('click', suppressClick, true);
        };
        carousel.addEventListener('click', suppressClick, true);
      }
    };

    carousel.addEventListener('pointerdown', startDrag);
    carousel.addEventListener('pointermove', moveDrag, { passive: false });
    carousel.addEventListener('pointerup', endDrag);
    carousel.addEventListener('pointercancel', endDrag);
    carousel.addEventListener('pointerleave', endDrag);

    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        window.scrollCarousel(carousel.id, 1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        window.scrollCarousel(carousel.id, -1);
      }
    });
  });

  // K3 Slider initialisieren
  initK3Slider('k3Track');
  initK3Slider('k3Track32');
  initK3Slider('k3Track33');
  initCarouselParallax('carousel1');
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
  carousel.focus({ preventScroll: true });
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
      const isActive = index === currentIndex;
      dot.setAttribute('aria-selected', String(isActive));
      dot.setAttribute('tabindex', isActive ? '0' : '-1');

      if (isActive) {
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

function initCarouselParallax(carouselId) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const mediaItems = Array.from(carousel.querySelectorAll('[data-parallax-media]'));
  if (!mediaItems.length) return;

  mediaItems.forEach((item) => {
    item.setAttribute('draggable', 'false');
  });

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const render = () => {
    const width = carousel.offsetWidth || 1;
    const progress = carousel.scrollLeft / width;

    mediaItems.forEach((item, index) => {
      const distance = index - progress;
      const offset = clamp(distance * 24, -24, 24);
      const scale = clamp(1.08 - Math.abs(distance) * 0.05, 1.01, 1.08);
      item.style.transform = `translate3d(${offset}px, 0, 0) scale(${scale})`;
    });
  };

  carousel.addEventListener('scroll', render, { passive: true });
  window.addEventListener('resize', render);
  render();
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
function initK3Slider(trackId) {
  const track = document.getElementById(trackId);
  const shell = track?.closest('.k3-shell');
  const bg = shell?.querySelector('.k3-parallax');
  if (!track || !shell) return;

  const slides = Array.from(track.querySelectorAll('.k3-slide'));
  if (!slides.length) return;

  track.setAttribute('role', 'region');
  track.setAttribute('aria-roledescription', 'carousel');
  if (!track.hasAttribute('tabindex')) track.setAttribute('tabindex', '0');

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

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
    slides.forEach((el, i) => {
      const active = i === idx;
      el.classList.toggle('is-active', active);
      el.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
  };

  let smoothLeft = track.scrollLeft;
  let smoothVelocity = 0;

  const parallaxCaptions = (scrollLeftRef = track.scrollLeft) => {
    const tr = track.getBoundingClientRect();
    const center = tr.left + tr.width / 2;

    slides.forEach((el) => {
      const cap = el.querySelector('.k3-caption-inner');
      if (!cap) return;

      const er = el.getBoundingClientRect();
      const visualShift = track.scrollLeft - scrollLeftRef;
      const elCenter = er.left + er.width / 2 + visualShift;
      const delta = (elCenter - center) / tr.width;

      const x = clamp(delta * -68, -68, 68);
      const y = clamp(delta * 18, -18, 18);
      cap.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  };

  const parallaxMedia = (scrollLeftRef = track.scrollLeft) => {
    const tr = track.getBoundingClientRect();
    const center = tr.left + tr.width / 2;

    slides.forEach((el) => {
      const media = el.querySelector('.k3-media img');
      if (!media) return;

      const er = el.getBoundingClientRect();
      const visualShift = track.scrollLeft - scrollLeftRef;
      const elCenter = er.left + er.width / 2 + visualShift;
      const delta = (elCenter - center) / tr.width;

      const x = clamp(delta * -54, -54, 54);
      const scale = clamp(1.14 - Math.abs(delta) * 0.16, 1.0, 1.14);
      media.style.transform = `translate3d(${x}px,0,0) scale(${scale})`;
    });
  };

  const parallaxBackground = (scrollLeftRef = track.scrollLeft) => {
    if (!bg) return;
    const max = track.scrollWidth - track.clientWidth;
    const p = max > 0 ? (scrollLeftRef / max) : 0;
    const x = (p - 0.5) * 220;
    bg.style.transform = `translate3d(${x}px,0,0) scale(1.12)`;
  };

  const scrollToIndex = (idx) => {
    const target = slides[idx];
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  let isPointerDown = false;
  let startX = 0;
  let startY = 0;
  let baseLeft = 0;
  let moved = false;

  const onPointerDown = (event) => {
    isPointerDown = true;
    moved = false;
    startX = event.clientX;
    startY = event.clientY;
    baseLeft = track.scrollLeft;
    track.classList.add('is-dragging');
    track.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!isPointerDown) return;

    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    if (Math.abs(dx) > 6) moved = true;
    if (Math.abs(dx) > Math.abs(dy)) {
      event.preventDefault();
      track.scrollLeft = baseLeft - dx * 1.08;
    }
  };

  const onPointerEnd = (event) => {
    if (!isPointerDown) return;
    isPointerDown = false;
    track.classList.remove('is-dragging');
    if (event.pointerId != null) track.releasePointerCapture?.(event.pointerId);

    if (moved) {
      const suppressClick = (clickEvent) => {
        clickEvent.preventDefault();
        clickEvent.stopPropagation();
        track.removeEventListener('click', suppressClick, true);
      };
      track.addEventListener('click', suppressClick, true);
    }

    scrollToIndex(activeIndex());
  };

  track.addEventListener('pointerdown', onPointerDown);
  track.addEventListener('pointermove', onPointerMove, { passive: false });
  track.addEventListener('pointerup', onPointerEnd);
  track.addEventListener('pointercancel', onPointerEnd);
  track.addEventListener('pointerleave', onPointerEnd);

  track.addEventListener('keydown', (event) => {
    const idx = activeIndex();

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollToIndex(Math.min(slides.length - 1, idx + 1));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollToIndex(Math.max(0, idx - 1));
    }
  });

  let raf = 0;
  const renderParallax = () => {
    const force = (track.scrollLeft - smoothLeft) * 0.16;
    smoothVelocity = (smoothVelocity + force) * 0.78;
    smoothLeft += smoothVelocity;

    setActive(activeIndex());
    parallaxCaptions(smoothLeft);
    parallaxMedia(smoothLeft);
    parallaxBackground(smoothLeft);

    raf = requestAnimationFrame(renderParallax);
  };

  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(renderParallax);
  };

  onScroll();
  track.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}


