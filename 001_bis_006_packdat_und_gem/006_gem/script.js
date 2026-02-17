document.addEventListener('DOMContentLoaded', function() {

    // --- Splash Screen Logic ---
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
                splashAI.style.background = `linear-gradient(to top, var(--color-pink) ${progress}%, transparent ${progress}%)`;
                splashAI.style.webkitBackgroundClip = 'text';
                splashAI.style.backgroundClip = 'text';
            }

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    splashScreen.style.opacity = '0';
                    splashScreen.style.visibility = 'hidden';
                    setTimeout(() => splashScreen.style.display = 'none', 500);
                }, 400);
            }
        }, 25);
    }

    // --- Mobile Navigation Toggle ---
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
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll-to-Top Button Logic ---
    const scrollTopButton = document.querySelector('.scroll-to-top');
    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
            scrollTopButton.classList.toggle('is-visible', window.pageYOffset > 300);
        });
    }

    // --- Video Thumbnail to Player Swap ---
    const videoWrapper = document.querySelector('.video-thumbnail-wrapper');
    if (videoWrapper) {
        videoWrapper.addEventListener('click', function() {
            this.innerHTML = `
                <div style="position:relative;padding-bottom:56.25%;height:0;">
                    <iframe src="https://www.youtube.com/embed/y_ONEJooBqQ?autoplay=1&rel=0" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen 
                            title="Embedded YouTube video"
                            style="position:absolute;top:0;left:0;width:100%;height:100%;">
                    </iframe>
                </div>`;
        });
    }

    // --- Lucide Icons (für Galerie) ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});