/* GLASS-SLIDER | Version 3.0.0 | Tag: GS-300 */
/* =========================================================
   FLOATING / INVISIBLE SLIDER
   - weichere Bildwechsel über Fade statt hartes Slider-Schieben
   - permanenter Ambient-Wiggle auch ohne Maus
   - Mouse-Wiggle zusätzlich oben drauf
   - optionale Layer haben eigene Tiefenbewegung
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const sliderRoot = document.querySelector(".hb-fashion-slider");
  if (!sliderRoot || typeof Swiper === "undefined") return;

  /* -------------------------------------------------------
     SWIPER BASICS
     delay = Standzeit eines Bildes
     speed = Dauer des Übergangs
     effect: fade = weniger klassischer Slider-Look
     ------------------------------------------------------- */
  const hbFashionSlider = new Swiper(sliderRoot, {
    loop: true,
    speed: 1600,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    grabCursor: true,
    allowTouchMove: true,
    watchSlidesProgress: true,

    autoplay: {
      delay: 8600,
      disableOnInteraction: false,
      pauseOnMouseEnter: false
    },

    navigation: {
      nextEl: ".hb-slider-nav.swiper-button-next",
      prevEl: ".hb-slider-nav.swiper-button-prev"
    },

    pagination: {
      el: ".hb-slider-progress",
      type: "progressbar"
    }
  });

  const slideStates = new WeakMap();

  hbFashionSlider.slides.forEach((slide) => {
    slideStates.set(slide, {
      mouseTargetX: 0,
      mouseTargetY: 0,
      mouseCurrentX: 0,
      mouseCurrentY: 0
    });

    slide.addEventListener("mousemove", function (event) {
      const rect = slide.getBoundingClientRect();
      const relX = event.clientX - rect.left - rect.width / 2;
      const relY = event.clientY - rect.top - rect.height / 2;

      const state = slideStates.get(slide);
      if (!state) return;

      state.mouseTargetX = relX;
      state.mouseTargetY = relY;
    });

    slide.addEventListener("mouseleave", function () {
      const state = slideStates.get(slide);
      if (!state) return;

      state.mouseTargetX = 0;
      state.mouseTargetY = 0;
    });
  });

  /* -------------------------------------------------------
     WICHTIGE STELLSCHRAUBEN FÜR DIE DAUERBEWEGUNG
     Diese Werte kannst du direkt anpassen.
     ------------------------------------------------------- */

  /* Ambient-Bewegung ohne Maus:
     höher = stärkeres ständiges Schweben */
  const AMBIENT_IMG_X = 12;
  const AMBIENT_IMG_Y = 8;
  const AMBIENT_COPY_X = 6;
  const AMBIENT_COPY_Y = 4;
  const AMBIENT_LAYER_1_X = 18;
  const AMBIENT_LAYER_1_Y = 12;
  const AMBIENT_LAYER_2_X = 24;
  const AMBIENT_LAYER_2_Y = 16;
  const AMBIENT_LAYER_3_X = 30;
  const AMBIENT_LAYER_3_Y = 20;

  /* Geschwindigkeit der Dauerbewegung:
     kleinere Werte = langsamer / träger
     größere Werte = lebendiger */
  const AMBIENT_SPEED_A = 0.00055;
  const AMBIENT_SPEED_B = 0.00038;
  const AMBIENT_SPEED_C = 0.00072;

  /* Mouse-Einfluss:
     höher = Mausbewegung wirkt stärker */
  const MOUSE_EASE = 0.08;
  const MOUSE_IMG_FACTOR = 0.08;
  const MOUSE_COPY_FACTOR = 0.04;
  const MOUSE_LAYER_1_FACTOR = 0.12;
  const MOUSE_LAYER_2_FACTOR = 0.16;
  const MOUSE_LAYER_3_FACTOR = 0.20;

  function setSlideVars(slide, vars) {
    slide.style.setProperty("--img-wiggle-x", `${vars.imgX}px`);
    slide.style.setProperty("--img-wiggle-y", `${vars.imgY}px`);
    slide.style.setProperty("--copy-wiggle-x", `${vars.copyX}px`);
    slide.style.setProperty("--copy-wiggle-y", `${vars.copyY}px`);
    slide.style.setProperty("--layer1-wiggle-x", `${vars.layer1X}px`);
    slide.style.setProperty("--layer1-wiggle-y", `${vars.layer1Y}px`);
    slide.style.setProperty("--layer2-wiggle-x", `${vars.layer2X}px`);
    slide.style.setProperty("--layer2-wiggle-y", `${vars.layer2Y}px`);
    slide.style.setProperty("--layer3-wiggle-x", `${vars.layer3X}px`);
    slide.style.setProperty("--layer3-wiggle-y", `${vars.layer3Y}px`);
  }

  function resetSlideVars(slide) {
    setSlideVars(slide, {
      imgX: 0,
      imgY: 0,
      copyX: 0,
      copyY: 0,
      layer1X: 0,
      layer1Y: 0,
      layer2X: 0,
      layer2Y: 0,
      layer3X: 0,
      layer3Y: 0
    });
  }

  function animateMotion(time) {
    const activeSlide = sliderRoot.querySelector(".swiper-slide-active");

    hbFashionSlider.slides.forEach((slide) => {
      const state = slideStates.get(slide);
      if (!state) return;

      state.mouseCurrentX += (state.mouseTargetX - state.mouseCurrentX) * MOUSE_EASE;
      state.mouseCurrentY += (state.mouseTargetY - state.mouseCurrentY) * MOUSE_EASE;

      if (slide !== activeSlide) {
        resetSlideVars(slide);
        return;
      }

      /* Ambient-Wave:
         sorgt für das dauerhafte leichte Schweben auch ohne Maus */
      const waveA = Math.sin(time * AMBIENT_SPEED_A);
      const waveB = Math.cos(time * AMBIENT_SPEED_B);
      const waveC = Math.sin(time * AMBIENT_SPEED_C);

      const ambientImgX = waveA * AMBIENT_IMG_X;
      const ambientImgY = waveB * AMBIENT_IMG_Y;

      const ambientCopyX = waveB * AMBIENT_COPY_X;
      const ambientCopyY = waveC * AMBIENT_COPY_Y;

      const ambientLayer1X = waveA * AMBIENT_LAYER_1_X;
      const ambientLayer1Y = waveB * AMBIENT_LAYER_1_Y;

      const ambientLayer2X = waveB * AMBIENT_LAYER_2_X;
      const ambientLayer2Y = waveC * AMBIENT_LAYER_2_Y;

      const ambientLayer3X = waveC * AMBIENT_LAYER_3_X;
      const ambientLayer3Y = waveA * AMBIENT_LAYER_3_Y;

      setSlideVars(slide, {
        imgX: ambientImgX + state.mouseCurrentX * MOUSE_IMG_FACTOR,
        imgY: ambientImgY + state.mouseCurrentY * MOUSE_IMG_FACTOR,

        copyX: ambientCopyX + state.mouseCurrentX * MOUSE_COPY_FACTOR,
        copyY: ambientCopyY + state.mouseCurrentY * MOUSE_COPY_FACTOR,

        layer1X: ambientLayer1X + state.mouseCurrentX * MOUSE_LAYER_1_FACTOR,
        layer1Y: ambientLayer1Y + state.mouseCurrentY * MOUSE_LAYER_1_FACTOR,

        layer2X: ambientLayer2X + state.mouseCurrentX * MOUSE_LAYER_2_FACTOR,
        layer2Y: ambientLayer2Y + state.mouseCurrentY * MOUSE_LAYER_2_FACTOR,

        layer3X: ambientLayer3X + state.mouseCurrentX * MOUSE_LAYER_3_FACTOR,
        layer3Y: ambientLayer3Y + state.mouseCurrentY * MOUSE_LAYER_3_FACTOR
      });
    });

    requestAnimationFrame(animateMotion);
  }

  requestAnimationFrame(animateMotion);
});