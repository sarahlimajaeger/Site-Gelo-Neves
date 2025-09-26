document.addEventListener('DOMContentLoaded', () => {

    // --- MENU HAMBURGUER PARA MOBILE ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        document.querySelectorAll(".nav-menu a").forEach(n => n.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }));
    }

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
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // --- FUNCIONALIDADE DE TROCA DE TEMA ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
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
    }

    // --- INICIALIZAÇÃO DO CARROSSEL DE SERVIÇOS (Swiper.js) ---
    if (typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.servicesSwiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 3, spaceBetween: 30 }
            }
        });
    }

     // --- ANIMAÇÃO DO FUNDO EM GRADIENTE AO ROLAR ---
    const animatedBg = document.querySelector(".animated-background");
    if (animatedBg) {
        window.addEventListener('scroll', () => {
            // Calcula a porcentagem de rolagem da página
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (window.scrollY / scrollableHeight) * 100;
            
            // Move a posição Y do fundo com base na porcentagem de rolagem
            // Limitamos a 100% para não passar do final do gradiente
            const backgroundPositionY = Math.min(scrollPercentage, 100);
            
            // Aplica a nova posição ao fundo
            animatedBg.style.backgroundPosition = `50% ${backgroundPositionY}%`;
        });
    }

    

    // ==================================================
    // ========= LÓGICA DO CHATBOT IA (VERSÃO FINAL ROBUSTA) ======
    // ==================================================

    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const chatbotWindow = document.querySelector(".chatbot");
    const chatForm = document.getElementById("chat-form");
    const userInput = document.getElementById("user-input");
    const messagesContainer = document.querySelector(".chat-messages");
    
    if (chatbotToggler && chatbotWindow && chatForm && userInput && messagesContainer) {

        const API_KEY = "AIzaSyAIiDggI2rta6iTsm7xSwEo-AWN8V3Wpt0"; // ⚠️ Lembre-se de proteger esta chave
        
        let chatSession;
        let genAI;
        
        chatbotToggler.addEventListener("click", () => chatbotWindow.classList.toggle("active"));

        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const userMessage = userInput.value.trim();
            if (!userMessage) return;

            addMessage(userMessage, "user-message");
            userInput.value = "";
            
            showTypingIndicator();
            getBotResponse(userMessage);
        });

        const addMessage = (message, className) => {
            const li = document.createElement("li");
            li.classList.add("message", className);
            const p = document.createElement("p");
            p.innerHTML = message;
            li.appendChild(p);
            messagesContainer.appendChild(li);
            scrollToBottom();
        };

        const showTypingIndicator = () => {
            const typingLi = document.createElement("li");
            typingLi.classList.add("message", "bot-message", "typing-indicator");
            const p = document.createElement("p");
            p.innerHTML = `<span></span><span></span><span></span>`;
            typingLi.appendChild(p);
            messagesContainer.appendChild(typingLi);
            scrollToBottom();
        };

        const hideTypingIndicator = () => {
            const typingIndicator = document.querySelector(".typing-indicator");
            if (typingIndicator) typingIndicator.remove();
        };

        const scrollToBottom = () => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        };
        
        addMessage("Olá! Eu sou o Assistente Gelo & Neves. Como posso ajudar com seu ar condicionado hoje?", "bot-message");

        const initializeAI = () => {
            try {
               if (typeof window.GoogleGenerativeAI === 'undefined') {
    throw new Error("SDK do Google AI não foi encontrado. Verifique a URL do script no HTML.");
}
const { GoogleGenerativeAI } = window;
genAI = new GoogleGenerativeAI(API_KEY);
                return true;
            } catch (error) {
                console.error("Falha ao inicializar a IA:", error);
                addMessage("Desculpe, não consigo me conectar à minha inteligência no momento. Por favor, tente recarregar a página.", "bot-message");
                return false;
            }
        };

        const getBotResponse = async (userMessage) => {
            if (!genAI && !initializeAI()) {
                hideTypingIndicator();
                return;
            }

            if (!chatSession) {
                 const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
                 chatSession = model.startChat({
                    history: [],
                    systemInstruction: getSystemInstruction(),
                 });
            }

            try {
                const result = await chatSession.sendMessage(userMessage);
                const responseText = result.response.text();
                
                hideTypingIndicator();
                addMessage(formatResponse(responseText), "bot-message");

            } catch (error) {
                console.error("Erro ao enviar mensagem para a API:", error);
                hideTypingIndicator();
                addMessage("Desculpe, algo deu errado com a minha conexão. Possivelmente a chave de API é inválida ou foi desativada. Tente novamente mais tarde.", "bot-message");
            }
        };

        const formatResponse = (text) => {
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>');
        };

        const getSystemInstruction = () => {
            return `Você é o "Assistente Gelo & Neves", um especialista amigável e educado em climatização.
            **CONHECIMENTO BASE (USE APENAS ISSO):**
            1. **Serviços:** Manutenção Preventiva, Corretiva, Instalação Completa, Limpeza Técnica, Recarga de Gás, Suporte 24h.
            2. **Dicas:** Limpar filtros a cada 15-30 dias; manutenção anual; chamar técnico para barulhos ou falta de refrigeração.
            3. **Área de Atendimento:** Porto Alegre e Região Metropolitana.
            4. **Contato:** Telefone (51) 3333-4444, WhatsApp (51) 99999-9999, E-mail contato@geloeneves.com.br. Atendimento de Seg-Sex (8h-18h) e Sáb (8h-12h).
            **REGRAS:**
            * Se não souber a resposta ou for fora do escopo, direcione para o contato humano.
            * Para preços, sempre direcione para o WhatsApp para um orçamento.`;
        };
    }

// --- LÓGICA PARA O PROCESSO COM IMAGEM STICKY ---
    const processSection = document.querySelector('.process-section');
    if (processSection) {
        const textBlocks = document.querySelectorAll('.step-text-block');
        const processImages = document.querySelectorAll('.process-image');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const step = entry.target.dataset.step;
                    
                    // Atualiza a imagem ativa
                    processImages.forEach(img => {
                        img.classList.remove('is-active');
                        if (img.classList.contains(`step-visual-${step}`)) {
                            img.classList.add('is-active');
                        }
                    });
                    
                    // Atualiza o bloco de texto ativo
                    textBlocks.forEach(block => {
                         block.classList.remove('is-active');
                    });
                    entry.target.classList.add('is-active');
                }
            });
        }, {
            rootMargin: '-50% 0px -50% 0px', // Ativa quando o elemento está no meio da tela
            threshold: 0
        });

        textBlocks.forEach(block => {
            observer.observe(block);
        });
    }

    // --- EFEITO DE ESMAECER (FADE-OUT) NO CONTEÚDO DO HERO AO ROLAR ---
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const fadeOutDistance = 400; // Distância em pixels para o fade-out completo

            if (scrollPosition < fadeOutDistance) {
                // Calcula a opacidade: 1 no topo, 0 a 400px
                const opacity = 1 - (scrollPosition / fadeOutDistance);
                heroContent.style.opacity = Math.max(0, opacity); // Garante que a opacidade não seja negativa
            } else {
                heroContent.style.opacity = 0; // Garante que fique invisível após a distância
            }
        });
    }

});
