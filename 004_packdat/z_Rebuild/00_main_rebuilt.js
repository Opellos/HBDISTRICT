const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const isReducedMotion = () => prefersReducedMotion.matches;

const clampIndex = (value, length) => {
  const normalized = ((value % length) + length) % length;
  return normalized;
};

const smoothScrollTo = (target, offset = 0) => {
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: isReducedMotion() ? 'auto' : 'smooth' });
};

const initNavigation = () => {
  const header = document.querySelector('#nav-main');
  const navLinks = header ? header.querySelectorAll('a[href^="#"]') : [];

  const getHeaderHeight = () => (header ? header.offsetHeight : 0);

  const handleLink = (event, hash) => {
    const target = document.querySelector(hash);
    if (!target) return;
    event.preventDefault();
    window.requestAnimationFrame(() => smoothScrollTo(target, getHeaderHeight() + 12));
  };

  navLinks.forEach((link) => {
    const hash = link.getAttribute('href');
    if (!hash || hash.length <= 1) return;
    link.addEventListener('click', (event) => handleLink(event, hash));
  });

  const handleScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 32);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  return getHeaderHeight;
};

const initReveals = () => {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }
};

const initCarousel = () => {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector('[data-carousel-track]');
  const slides = Array.from(track?.children || []);
  const prevButton = carousel.querySelector('[data-carousel-prev]');
  const nextButton = carousel.querySelector('[data-carousel-next]');
  const autoInterval = Number(carousel.getAttribute('data-auto-interval')) || 7000;
  let activeIndex = 0;
  let autoTimer = null;

  const updateMediaState = () => {
    slides.forEach((slide, index) => {
      const videos = slide.querySelectorAll('video');
      videos.forEach((video) => {
        if (index === activeIndex) {
          if (!isReducedMotion()) {
            video.play().catch(() => {});
          }
        } else {
          video.pause();
          if (!video.hasAttribute('data-preserve-time')) {
            video.currentTime = 0;
          }
        }
      });
    });
  };

  const render = () => {
    if (!track) return;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    slides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === activeIndex);
    });
    updateMediaState();
  };

  const goTo = (index) => {
    if (!slides.length) return;
    activeIndex = clampIndex(index, slides.length);
    render();
  };

  const next = () => goTo(activeIndex + 1);
  const prev = () => goTo(activeIndex - 1);

  const stopAuto = () => {
    if (autoTimer) {
      window.clearInterval(autoTimer);
      autoTimer = null;
    }
  };

  const startAuto = () => {
    stopAuto();
    if (isReducedMotion()) return;
    autoTimer = window.setInterval(next, autoInterval);
  };

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      stopAuto();
      prev();
      startAuto();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      stopAuto();
      next();
      startAuto();
    });
  }

  carousel.addEventListener('pointerenter', stopAuto);
  carousel.addEventListener('pointerleave', startAuto);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAuto();
    } else {
      startAuto();
    }
  });

  prefersReducedMotion.addEventListener('change', () => {
    if (isReducedMotion()) {
      stopAuto();
    } else {
      startAuto();
    }
  });

  render();
  startAuto();
};

const initVideoTrigger = () => {
  const wrappers = document.querySelectorAll('[data-video-trigger]');
  wrappers.forEach((wrapper) => {
    const id = wrapper.getAttribute('data-video-id');
    if (!id) return;

    const button = wrapper.querySelector('button');
    const activate = () => {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&rel=0`;
      iframe.title = 'YouTube Video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      wrapper.replaceChildren(iframe);
    };

    if (button) {
      button.addEventListener('click', activate);
    }

    wrapper.addEventListener('click', (event) => {
      if (event.target === wrapper) {
        activate();
      }
    });
  });
};

const initTopLink = () => {
  const topLink = document.querySelector('[data-back-to-top]');
  if (!topLink) return;

  const handleScroll = () => {
    const threshold = window.innerHeight * 0.6;
    if (window.scrollY > threshold) {
      topLink.classList.add('is-visible');
    } else {
      topLink.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
};

const initPartnerMarquee = () => {
  const track = document.querySelector('[data-partner-track]');
  if (!track) return;

  const applyMotionPreference = () => {
    track.style.animationPlayState = isReducedMotion() ? 'paused' : 'running';
  };

  prefersReducedMotion.addEventListener('change', applyMotionPreference);
  applyMotionPreference();
};

const initInternalAnchors = (getHeaderHeight) => {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    const hash = link.getAttribute('href');
    if (!hash || hash.length <= 1) return;
    if (link.closest('[data-nav-panel]')) return;
    if (link.closest('.nav-inline')) return;

    link.addEventListener('click', (event) => {
      const target = document.querySelector(hash);
      if (!target) return;
      const samePage = link.pathname === window.location.pathname;
      if (!samePage) return;
      event.preventDefault();
      smoothScrollTo(target, (getHeaderHeight ? getHeaderHeight() : 0) + 12);
    });
  });
};

const boot = () => {
  const getHeaderHeight = initNavigation();
  initReveals();
  initCarousel();
  initVideoTrigger();
  initTopLink();
  initPartnerMarquee();
  initInternalAnchors(getHeaderHeight);
};

document.addEventListener('DOMContentLoaded', boot);
