document.addEventListener('DOMContentLoaded', () => {

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
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    /* 2. MODAIS */
    const openModal = (id) => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Trava scroll
        }
    };
    const closeModal = (modal) => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Libera scroll
    };

    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => openModal(btn.getAttribute('data-modal-target')));
    });

    document.querySelectorAll('.custom-modal-close').forEach(btn => {
        btn.addEventListener('click', () => closeModal(document.getElementById(btn.getAttribute('data-target'))));
    });

    document.querySelectorAll('.custom-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });

    /* 3. FUNÇÃO COPIAR */
    document.querySelectorAll('.btn-copy-modal, .btn-copy-action, .btn-copy-icon').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-copy-target');
            const element = document.getElementById(targetId);
            const text = element.tagName === 'INPUT' ? element.value : element.innerText;

            navigator.clipboard.writeText(text).then(() => {
                const originalHTML = btn.innerHTML;
                if (btn.classList.contains('btn-copy-action')) {
                    btn.innerHTML = 'COPIADO!';
                    btn.style.background = 'var(--color-secondary-green)';
                } else {
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                }

                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                }, 2000);
            });
        });
    });

    /* 4. CARROSSEL */
    if (document.querySelector('.logosSwiper-doacao')) {
        new Swiper('.logosSwiper-doacao', {
            loop: true,
            autoplay: { delay: 2500, disableOnInteraction: false },
            navigation: {
                nextEl: '.logos-arrow-doacao.swiper-button-next',
                prevEl: '.logos-arrow-doacao.swiper-button-prev',
            },
            breakpoints: {
                0: { slidesPerView: 2, spaceBetween: 20 },
                600: { slidesPerView: 3, spaceBetween: 30 },
                1024: { slidesPerView: 4, spaceBetween: 40 }
            }
        });
    }
});