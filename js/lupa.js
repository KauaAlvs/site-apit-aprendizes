/* ================================== */
/* JS AUTÔNOMO - LUPA DE BUSCA (SITE-WIDE)
/* ================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Função para o Overlay de Busca (Abrir/Fechar) --- */
    const searchIcon = document.querySelector('.search-icon');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-overlay-close');

    if (searchIcon && searchOverlay && searchClose) {
        searchIcon.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            // Foca no campo de input quando abre
            document.getElementById('overlay-search-input').focus();
        });

        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });

        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
            }
        });
    }

    /* --- LÓGICA - BUSCA DE NAVEGAÇÃO --- */
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
                'requisito': 'aprendiz.html',
                'requisitos': 'aprendiz.html',
                'aprendiz': 'aprendiz.html',
                'curso': 'aprendiz.html',
                'realizar': 'aprendiz.html',

                // 'para-empresas.html'
                'empresa': 'empresas.html',
                'empresas': 'empresas.html',
                'contratar': 'empresas.html',
                'parceria': 'empresas.html',
                'cota': 'empresas.html',
                'empresariar': 'empresas.html',
                'parceiro': 'empresas.html',
                'parceiros': 'empresas.html',
                'parcerias': 'empresas.html',
                'rh': 'empresas.html',

                // 'ajuda.html'
                'dúvida': 'ajuda.html',
                'duvida': 'ajuda.html',
                'dúvidas': 'ajuda.html',
                'duvidas': 'ajuda.html',
                'ajuda': 'ajuda.html',
                'faq': 'ajuda.html',
                'pergunta': 'ajuda.html',
                'perguntas': 'ajuda.html',
                'direito': 'ajuda.html',
                'direitos': 'ajuda.html',

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
                const originalPlaceholder = searchInput.placeholder;
                searchInput.value = ''; // Limpa o campo
                searchInput.placeholder = 'Não encontrado. Tente "vagas" ou "dúvidas".';

                // Balança o campo para indicar erro
                searchForm.style.animation = 'shake 0.5s';

                setTimeout(() => {
                    searchForm.style.animation = '';
                    searchInput.placeholder = originalPlaceholder; // Restaura o placeholder
                }, 2000); // Espera 2 segundos
            }
        });
    }

    /* Adiciona a animação de "shake" no CSS */
    try {
        const styleSheet = document.styleSheets[0];
        styleSheet.insertRule(`
            @keyframes shake {
                0% { transform: translateX(0); }
                25% { transform: translateX(10px); }
                50% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
                100% { transform: translateX(0); }
            }
        `, styleSheet.cssRules.length);
    } catch (e) {
        console.warn("Não foi possível inserir a animação @keyframes 'shake'.", e);
    }
});