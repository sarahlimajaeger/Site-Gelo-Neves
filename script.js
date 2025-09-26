document.addEventListener('DOMContentLoaded', function() {

    // --- MENU HAMBURGUER PARA MOBILE ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-menu a").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));

    // --- ANIMAÇÃO DE SCROLL ---
    const scrollElements = document.querySelectorAll(".animate-on-scroll");
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
    };
    const displayScrollElement = (element) => {
        element.classList.add("is-visible");
    };
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };
    window.addEventListener("scroll", handleScrollAnimation);
    handleScrollAnimation();

    // --- EFEITO DA HEADER AO SCROLLAR ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- FUNCIONALIDADE DO CHATBOT ---
    const chatbotIcon = document.querySelector('.chatbot-icon');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const closeChat = document.querySelector('.close-chat');
    chatbotIcon.addEventListener('click', () => { chatbotWindow.classList.toggle('active'); });
    closeChat.addEventListener('click', () => { chatbotWindow.classList.remove('active'); });
    document.addEventListener('click', (event) => {
        if (!chatbotWindow.contains(event.target) && !chatbotIcon.contains(event.target)) {
            chatbotWindow.classList.remove('active');
        }
    });

    // --- FUNCIONALIDADE DE TROCA DE TEMA ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    };
    
    applyTheme(currentTheme);

    themeToggle.addEventListener('click', () => {
        let newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
});