document.addEventListener('DOMContentLoaded', () => {
    /* ==================================
    /* 1. LÓGICA DO ACCORDION (FAQ)
    /* ================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const answer = btn.nextElementSibling;

            // Fecha outros itens abertos (opcional, mas recomendado)
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Abre ou fecha o item clicado
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                item.classList.add('active');
                // Define a altura máxima com base no conteúdo da resposta
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* ==================================
    /* 2. LÓGICA DO BOTÃO "VOLTAR AO TOPO"
    /* ================================== */
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        // Mostra/esconde o botão
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) { // Mostra depois de 400px de scroll
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        // Ação de clique (scroll suave)
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==================================
    /* 3. LÓGICA DO SCROLL SUAVE (ÂNCORAS)
    /* ================================== */
    const anchorLinks = document.querySelectorAll('.nav-button');
    const header = document.querySelector('.header');
    const navMenu = document.querySelector('.faq-nav-menu');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                let offset = 0;

                // Pega a altura dos elementos sticky (header e menu de âncora)
                if (header) offset += header.offsetHeight;
                if (navMenu) offset += navMenu.offsetHeight;

                // Calcula a posição final com um buffer
                const targetPosition = targetElement.offsetTop - offset - 20; // 20px de buffer

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ==================================
    /* 4. ANIMAÇÃO ON-SCROLL (se necessário, já está no CSS)
    /* ================================== */
    // O seu CSS já tem a lógica de 'animate-on-scroll', mas falta o JS para ativar.
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => scrollObserver.observe(el));
    }



});