/* ================================== */
/* JS AUTÔNOMO - PÁGINA OBRIGADO
/* ================================== */

/* --- Função para o Menu Mobile --- */
// Aguarda o DOM estar pronto para anexar os eventos
document.addEventListener('DOMContentLoaded', () => {

    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    /* --- Função para o Overlay de Busca --- */
    const searchIcon = document.querySelector('.search-icon');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-overlay-close');

    if (searchIcon && searchOverlay && searchClose) {
        searchIcon.addEventListener('click', () => {
            searchOverlay.classList.add('active');
        });

        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });

        // Fechar ao clicar fora do conteúdo (opcional)
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
            }
        });
    }
});