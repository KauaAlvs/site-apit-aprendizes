/* ================================== */
/* JS AUTÔNOMO - PÁGINA EMPRESAS
/* ================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Função para o Menu Mobile --- */
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            /* === ADICIONADO: Troca de ícone === */
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

    /* --- 2. Função para Animação on-scroll --- */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    /* --- 3. NOVO: Validador e Máscara de CNPJ --- */
    const cnpjInput = document.getElementById('cnpj');
    const cnpjError = document.getElementById('cnpj-error');
    const cnpjFormGroup = document.querySelector('.fg-cnpj');

    if (cnpjInput && cnpjError && cnpjFormGroup) {
        // A. Aplica a máscara
        cnpjInput.addEventListener('input', (e) => {
            e.target.value = mascaraCNPJ(e.target.value);
        });

        // B. Valida ao sair do campo
        cnpjInput.addEventListener('blur', (e) => {
            const cnpj = e.target.value;
            if (cnpj.length === 0) {
                // Se vazio, reseta
                cnpjFormGroup.classList.remove('invalid', 'valid');
                cnpjError.textContent = '';
                return;
            }

            if (validaCNPJ(cnpj)) {
                cnpjFormGroup.classList.add('valid');
                cnpjFormGroup.classList.remove('invalid');
                cnpjError.textContent = '';
            } else {
                cnpjFormGroup.classList.add('invalid');
                cnpjFormGroup.classList.remove('valid');
                cnpjError.textContent = 'CNPJ inválido.';
            }
        });
    }

    function mascaraCNPJ(valor) {
        valor = valor.replace(/\D/g, ''); // Remove tudo que não é dígito
        valor = valor.substring(0, 14); // Limita a 14 dígitos

        if (valor.length > 12) {
            // XX.XXX.XXX/XXXX-XX
            valor = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
        } else if (valor.length > 8) {
            // XX.XXX.XXX/XXXX
            valor = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, "$1.$2.$3/$4");
        } else if (valor.length > 5) {
            // XX.XXX.XXX
            valor = valor.replace(/^(\d{2})(\d{3})(\d{0,3})/, "$1.$2.$3");
        } else if (valor.length > 2) {
            // XX.XXX
            valor = valor.replace(/^(\d{2})(\d{0,3})/, "$1.$2");
        }
        return valor;
    }

    function validaCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj == '') return false;
        if (cnpj.length != 14) return false;

        // Elimina CNPJs inválidos conhecidos
        if (/^(\d)\1+$/.test(cnpj)) return false;

        // Valida DVs
        let tamanho = cnpj.length - 2
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1)) return false;

        return true;
    }

    /* --- 4. NOVO: Lógica de Upload de Arquivo --- */
    const fileInputEmpresa = document.getElementById('documento-empresa');
    const fileNameDisplayEmpresa = document.getElementById('file-name-empresa');

    if (fileInputEmpresa && fileNameDisplayEmpresa) {
        fileInputEmpresa.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                fileNameDisplayEmpresa.textContent = e.target.files[0].name;
                fileNameDisplayEmpresa.style.color = '#34A853'; // Verde
            } else {
                fileNameDisplayEmpresa.textContent = 'Nenhum arquivo selecionado';
                fileNameDisplayEmpresa.style.color = '#555';
            }
        });
    }

    /* --- 5. Função para o Overlay de Busca --- */
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

        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
            }
        });
    }

});