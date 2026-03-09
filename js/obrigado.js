// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------- */
    /* 1. LÓGICA DO MENU MOBILE    */
    /* -------------------------- */
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

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

    /* Lógica de fechar menu ao clicar no link */
    const navLinks = document.querySelectorAll('.nav-link');
    if (navMenu && menuToggle) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                    menuToggle.setAttribute('aria-label', 'Abrir menu');
                }
            });
        });
    }


    /* -------------------------- */
    /* 2. LÓGICA DO POP-UP NEWSLETTER */
    /* -------------------------- */
    const popupOverlay = document.getElementById('popup-overlay');
    const popupClose = document.getElementById('popup-close');

    if (popupOverlay && popupClose) {
        // Não mostrar popup na página de obrigado
        /*
        if (!sessionStorage.getItem('apitPopupShown')) {
            setTimeout(() => {
                popupOverlay.classList.add('show');
                sessionStorage.setItem('apitPopupShown', 'true');
            }, 3000);
        }
        */

        popupClose.addEventListener('click', () => {
            popupOverlay.classList.remove('show');
        });

        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) {
                popupOverlay.classList.remove('show');
            }
        });
    }

    /* ------------------------------------- */
    /* 3. LÓGICA DE ANIMAÇÃO ON-SCROLL     */
    /* ------------------------------------- */
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const scrollObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const scrollObserver = new IntersectionObserver(scrollObserverCallback, scrollObserverOptions);
    animatedElements.forEach(el => scrollObserver.observe(el));


    /* ------------------------------------- */
    /* 4. LÓGICA DA BUSCA OVERLAY (Google)   */
    /* ------------------------------------- */
    const searchOverlay = document.getElementById('search-overlay');
    const searchOpenButton = document.getElementById('search-icon-open');
    const searchCloseButton = document.getElementById('search-overlay-close');

    if (searchOverlay && searchOpenButton && searchCloseButton) {
        searchOpenButton.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            const googleInput = document.querySelector('input.gsc-input');
            if (googleInput) {
                googleInput.focus();
            }
        });

        searchCloseButton.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
    }
});