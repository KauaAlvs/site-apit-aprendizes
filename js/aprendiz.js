// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Função para o Menu Mobile --- */
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');

            // Lógica para trocar o ícone do menu
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

    /* --- 2. Lógica de fechar menu ao clicar no link --- */
    const navLinks = document.querySelectorAll('.nav-link');
    if (navMenu && menuToggle) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Verifica se é uma âncora interna E se estamos na página 'aprendiz.html'
                if (href.startsWith('aprendiz.html#')) {
                    // Lógica de scroll suave para âncoras
                    e.preventDefault();
                    const targetId = href.split('#')[1]; // Pega o ID após o '#'
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                } else if (!href.startsWith('#')) {
                    // Se for um link externo (outra página), apenas navega
                    // O e.preventDefault() não será chamado
                }


                // Fecha o menu mobile (apenas se estiver em modo mobile)
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                    menuToggle.setAttribute('aria-label', 'Abrir menu');
                }
            });
        });
    }



    /* ------------------------------------- */
    /* 4. LÓGICA DE ANIMAÇÃO ON-SCROLL     */
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
    /* 5. LÓGICA DAS ABAS (REMOVIDO) */
    /* Este código foi removido pois não há abas nesta página. */
    /* ------------------------------------- */


    /* ------------------------------------- */
    /* 6. LÓGICA DO UPLOAD (FORMULÁRIO PRINCIPAL) */
    /* ------------------------------------- */
    const fileInput = document.getElementById('curriculo');
    const fileNameDisplay = document.getElementById('file-name');

    if (fileInput && fileNameDisplay) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                fileNameDisplay.textContent = e.target.files[0].name;
                fileNameDisplay.style.color = '#34A853'; // Cor de sucesso (verde)
            } else {
                fileNameDisplay.textContent = 'Nenhum arquivo selecionado';
                fileNameDisplay.style.color = '#555';
            }
        });
    }

    /* ------------------------------------- */
    /* 7. LÓGICA DE AUTO-PREENCHIMENTO DO CEP */
    /* ------------------------------------- */
    const cepInput = document.getElementById('cep');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');

    if (cepInput && cidadeInput && estadoInput) {
        cepInput.addEventListener('blur', async (e) => {
            const cep = e.target.value.replace(/\D/g, ''); // Remove não-números
            if (cep.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    if (!response.ok) throw new Error('CEP não encontrado');

                    const data = await response.json();
                    if (data.erro) {
                        throw new Error('CEP inválido');
                    }

                    cidadeInput.value = data.localidade;
                    estadoInput.value = data.uf;
                } catch (error) {
                    console.error(error.message);
                    cidadeInput.value = '';
                    estadoInput.value = '';
                }
            }
        });
    }
    /* ==================================
    8. NOVA LÓGICA - POPUP DE VAGA
   ================================== */
    const vagaPopupButtons = document.querySelectorAll('.btn-vaga-popup');
    const vagaPopup = document.getElementById('popup-vaga');

    // Verifica se o popup de vaga existe na página
    if (vagaPopup) {
        const vagaPopupClose = vagaPopup.querySelector('.popup-close-vaga');
        const vagaPopupNome = document.getElementById('popup-vaga-nome');
        const vagaTituloInput = document.getElementById('vaga-titulo-input');
        const vagaDescInput = document.getElementById('vaga-desc-input');

        vagaPopupButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Pega os dados do card-pai
                const card = e.target.closest('.vaga-card');
                const title = card.dataset.title;
                const desc = card.dataset.desc;

                // Preenche o formulário do popup
                vagaPopupNome.textContent = title; // Texto visível
                vagaTituloInput.value = title;   // Input oculto
                vagaDescInput.value = desc;     // Input oculto

                // Mostra o popup
                vagaPopup.style.display = 'flex';
                setTimeout(() => {
                    vagaPopup.classList.add('active');
                    document.body.classList.add('popup-active'); // Trava o scroll do body
                }, 10); // Pequeno delay para a transição de opacidade
            });
        });

        // Função para fechar o popup
        const closeVagaPopup = () => {
            vagaPopup.classList.remove('active');
            document.body.classList.remove('popup-active'); // Destrava o scroll do body
            setTimeout(() => {
                vagaPopup.style.display = 'none';
            }, 300); // Aguarda a transição de opacidade
        }

        vagaPopupClose.addEventListener('click', closeVagaPopup);
        vagaPopup.addEventListener('click', (e) => {
            if (e.target === vagaPopup) {
                closeVagaPopup(); // <<< CORREÇÃO DO ERRO DE DIGITAÇÃO
            }
        });
    } // Fim do if (vagaPopup)

    /* ==================================
    9. NOVA LÓGICA - UPLOAD DE ARQUIVO (POPUP VAGA)
   ================================== */
    const vagaFileInput = document.getElementById('vaga-curriculo');
    const vagaFileNameDisplay = document.getElementById('vaga-file-name');

    if (vagaFileInput && vagaFileNameDisplay) {
        vagaFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                vagaFileNameDisplay.textContent = e.target.files[0].name;
                vagaFileNameDisplay.style.color = '#34A853';
            } else {
                vagaFileNameDisplay.textContent = 'Nenhum arquivo selecionado';
                vagaFileNameDisplay.style.color = '#555';
            }
        });
    }


    /* ==================================
    10. LÓGICA DE BUSCA (Mantida)
   ================================== */
    const searchForm = document.getElementById('overlay-search-form');
    const searchInput = document.getElementById('overlay-search-input');

    if (searchForm && searchInput) {

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o envio real do formulário
            const query = searchInput.value.toLowerCase().trim();

            if (!query) return; // Não faz nada se a busca estiver vazia

            // Mapa de palavras-chave para redirecionamento
            const routes = {
                // 'seja-aprendiz.html'
                'vaga': 'aprendiz.html',
                'vagas': 'aprendiz.html',
                'aprendiz': 'aprendiz.html',
                'inscrever': 'aprendiz.html',
                'inscrição': 'aprendiz.html',
                'cadastro': 'aprendiz.html',

                // 'para-empresas.html'
                'empresa': 'empresas.html',
                'empresas': 'empresas.html',
                'contratar': 'empresas.html',
                'parceria': 'empresas.html',
                'cota': 'empresas.html',

                // 'ajuda.html'
                'dúvida': 'ajuda.html',
                'duvida': 'ajuda.html',
                'dúvidas': 'ajuda.html',
                'duvidas': 'ajuda.html',
                'ajuda': 'ajuda.html',
                'faq': 'ajuda.html',
                'pergunta': 'ajuda.html',
                'requisito': 'ajuda.html',

                // 'programas.html'
                'programa': 'programas.html',
                'programas': 'programas.html',
                'curso': 'programas.html',
                'cursos': 'programas.html',

                // 'quem-somos.html'
                'quem somos': 'index.html',
                'sobre': 'index.html',
                'institucional': 'index.html',
                'apit': 'index.html'
            };

            let found = false;
            // Procura se a *frase inteira* da busca *contém* uma palavra-chave
            for (const key in routes) {
                if (query.includes(key)) {
                    window.location.href = routes[key]; // Redireciona
                    found = true;
                    break;
                }
            }

            // Se não encontrar nada
            if (!found) {
                searchInput.value = ''; // Limpa o campo
                searchInput.placeholder = 'Não encontrado. Tente "vagas" ou "dúvidas".';

                // Opcional: balança o campo para indicar erro
                searchForm.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    searchForm.style.animation = '';
                }, 500);
            }
        });
    }

    /* ==================================
     11. NOVO: INICIALIZAÇÃO DO SWIPER (CARROSSEL)
    ================================== */
    // Verifica se a classe Swiper existe (se o script foi carregado)
    if (typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.beneficios-swiper', {
            loop: true,
            autoplay: {
                delay: 5000, // 5 segundos
                disableOnInteraction: false, // Continua depois do clique
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            // Breakpoints responsivos
            breakpoints: {
                // Mobile
                0: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                // Tablet
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                // Desktop
                1024: {
                    slidesPerView: 2,
                    spaceBetween: 30
                }
            }
        });
    } else {
        console.warn('O script do Swiper.js não foi carregado.');
    }

});