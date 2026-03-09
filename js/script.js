document.addEventListener('DOMContentLoaded', () => {

    /* 0. CONTROLE ELEMENTOS FIXOS (SCROLL) */
    const fixedElements = document.querySelectorAll('.fixed-element');
    const heroSection = document.querySelector('.hero-carousel');

    const handleScrollFixed = () => {
        if (!heroSection) return;

        // Detecta altura do hero para esconder elementos fixos no topo
        const triggerHeight = heroSection.offsetHeight - 100;

        if (window.scrollY > triggerHeight) {
            fixedElements.forEach(el => el.classList.add('visible'));
        } else {
            fixedElements.forEach(el => el.classList.remove('visible'));
        }
    };

    window.addEventListener('scroll', handleScrollFixed);
    handleScrollFixed();

    /* 1. MENU MOBILE */
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                menuToggle.setAttribute('aria-label', 'Fechar menu');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                menuToggle.setAttribute('aria-label', 'Abrir menu');
            }
        });
    }

    /* 2. SWIPER */
    // Hero Carousel
    if (document.querySelector('.heroSwiper')) {
        new Swiper('.heroSwiper', {
            loop: true,
            autoplay: { delay: 5000, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.hero-carousel .swiper-button-next', prevEl: '.hero-carousel .swiper-button-prev' },
            effect: 'fade', fadeEffect: { crossFade: true },
        });
    }

    // Logos Parceiros
    if (document.querySelector('.logosSwiper')) {
        new Swiper('.logosSwiper', {
            loop: true,
            autoplay: { delay: 2500, disableOnInteraction: false },
            navigation: { nextEl: '.logos-arrow.swiper-button-next', prevEl: '.logos-arrow.swiper-button-prev' },
            breakpoints: {
                0: { slidesPerView: 2, spaceBetween: 20 },
                480: { slidesPerView: 2, spaceBetween: 30 },
                768: { slidesPerView: 3, spaceBetween: 40 },
                1024: { slidesPerView: 5, spaceBetween: 50 }
            }
        });
    }

    // Blog Swiper
    if (document.querySelector('.blogSwiper')) {
        new Swiper('.blogSwiper', {
            loop: true,
            autoplay: { delay: 4000, disableOnInteraction: false },
            pagination: { el: '.blog-pagination', clickable: true },
            navigation: { nextEl: '.blogSwiper .swiper-button-next', prevEl: '.blogSwiper .swiper-button-prev' },
            breakpoints: {
                0: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 1, spaceBetween: 30 },
                1024: { slidesPerView: 2, spaceBetween: 30 }
            }
        });
    }

    /* 3. ANIMAÇÃO ON-SCROLL */
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => scrollObserver.observe(el));

    /* 4. ABAS (TABS) */
    const tabNavButtons = document.querySelectorAll('.tab-nav-item');
    const tabPanels = document.querySelectorAll('.tab-panel');

    const openTab = (tabId) => {
        tabNavButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        const btn = document.querySelector(`.tab-nav-item[data-tab="${tabId}"]`);
        const panel = document.querySelector(`.tab-panel[data-tab="${tabId}"]`);
        if (btn && panel) {
            btn.classList.add('active');
            panel.classList.add('active');
        }
    };
    tabNavButtons.forEach(btn => {
        btn.addEventListener('click', () => openTab(btn.getAttribute('data-tab')));
    });

    // Deep Link Check
    if (window.location.hash === '#empresas') openTab('tab-empresas');
    if (window.location.hash === '#jovens') openTab('tab-jovens');

    /* 5. CONTADORES DE IMPACTO */
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const ids = ['count-jovens', 'count-atendidos', 'count-vagas'];
                ids.forEach(id => {
                    const counter = document.getElementById(id);
                    if (counter) {
                        const target = +counter.getAttribute('data-goal');
                        let start = 0;
                        const duration = 2000;
                        const step = (ts) => {
                            if (!start) start = ts;
                            const prog = ts - start;
                            const current = Math.min(Math.floor(prog / duration * target), target);
                            counter.innerText = `+${current.toLocaleString('pt-BR')}`;
                            if (current < target) requestAnimationFrame(step);
                        };
                        requestAnimationFrame(step);
                    }
                });
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    const impactSection = document.getElementById('impact-counters');
    if (impactSection) counterObserver.observe(impactSection);

    /* 6. FLIP CARDS MOBILE CLICK */
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('click', () => {
            if (window.matchMedia("(hover: none)").matches) {
                card.querySelector('.flip-card-inner').classList.toggle('active');
            }
        });
    });

});