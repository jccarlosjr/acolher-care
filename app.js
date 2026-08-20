/* --------------------------------------------------
   ACOLHER - INTERATIVIDADE & REGRA DE NEGÓCIOS
   Cuidado • Acolhimento • Conexão em Todas as Fases
   -------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializar Ícones Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Menu de Navegação Fixo (Sticky Header)
    const header = document.getElementById("header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
        updateActiveNavLink();
    });

    // 3. Menu Mobile Toggle
    const menuToggle = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav");
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            mainNav.classList.toggle("active");
            const isOpen = mainNav.classList.contains("active");
            menuToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });

        // Fechar menu mobile ao clicar em um link
        const navLinks = mainNav.querySelectorAll("a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("active");
                menuToggle.innerHTML = '<i data-lucide="menu"></i>';
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        });
    }

    // Indicador de Seção Ativa no Menu
    const sections = document.querySelectorAll("section[id]");
    function updateActiveNavLink() {
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute("id");
            const navLink = document.querySelector(`.main-nav a[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add("active");
                } else {
                    navLink.classList.remove("active");
                }
            }
        });
    }

    // 4. FAQ Accordion
    const faqTriggers = document.querySelectorAll(".faq-trigger");
    faqTriggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
            const item = trigger.parentElement;
            const content = item.querySelector(".faq-content");
            const isActive = item.classList.contains("active");

            // Fechar outros itens
            document.querySelectorAll(".faq-item").forEach(other => {
                if (other !== item) {
                    other.classList.remove("active");
                    const otherContent = other.querySelector(".faq-content");
                    if (otherContent) otherContent.style.maxHeight = null;
                }
            });

            if (!isActive) {
                item.classList.add("active");
                content.style.maxHeight = content.scrollHeight + 30 + "px";
            } else {
                item.classList.remove("active");
                content.style.maxHeight = null;
            }
        });
    });

    // 5. Carrossel de Depoimentos
    const testimonialCards = document.querySelectorAll(".testimonial-card");
    const dots = document.querySelectorAll(".carousel-dots .dot");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    let currentSlide = 0;

    function showSlide(index) {
        if (!testimonialCards.length) return;
        
        testimonialCards.forEach(card => card.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));

        if (index >= testimonialCards.length) currentSlide = 0;
        else if (index < 0) currentSlide = testimonialCards.length - 1;
        else currentSlide = index;

        testimonialCards[currentSlide].classList.add("active");
        if (dots[currentSlide]) dots[currentSlide].classList.add("active");
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
        nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
        
        dots.forEach(dot => {
            dot.addEventListener("click", () => {
                const idx = parseInt(dot.getAttribute("data-index"));
                showSlide(idx);
            });
        });

        // Autoplay carrossel a cada 7 segundos
        setInterval(() => {
            showSlide(currentSlide + 1);
        }, 7000);
    }

    // 6. Máscara de Telefone / WhatsApp no Formato Brasileiro
    function applyPhoneMask(value) {
        if (!value) return "";
        let digits = value.replace(/\D/g, "");
        if (digits.length > 11) digits = digits.slice(0, 11);

        if (digits.length === 0) return "";
        if (digits.length <= 2) return `(${digits}`;
        if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }

    const phoneInputs = document.querySelectorAll('input[type="tel"], #client-phone, #pro-phone');
    phoneInputs.forEach(input => {
        input.setAttribute("maxlength", "15");
        
        input.addEventListener("input", (e) => {
            const cursorPosition = e.target.selectionStart;
            const prevLength = e.target.value.length;
            
            e.target.value = applyPhoneMask(e.target.value);
            
            // Ajuste inteligente da posição do cursor se o usuário estiver digitando no final
            if (cursorPosition === prevLength) {
                e.target.setSelectionRange(e.target.value.length, e.target.value.length);
            }
        });

        input.addEventListener("blur", (e) => {
            e.target.value = applyPhoneMask(e.target.value);
        });

        // Aplicar formatação se já houver valor inicial
        if (input.value) {
            input.value = applyPhoneMask(input.value);
        }
    });
});
