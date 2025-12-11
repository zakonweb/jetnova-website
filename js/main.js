/**
 * JetNova AI - World-Class AI Travel Platform
 * Premium JavaScript - Animations & Interactions
 * Version: 3.0
 */

(function() {
    'use strict';

    // ============================================================================
    // LOADING SCREEN
    // ============================================================================
    
    const loadingScreen = document.querySelector('.loading-screen');
    
    window.addEventListener('load', () => {
            setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
            // Trigger initial animations
            initAnimations();
        }, 500);
    });

    // ============================================================================
    // HEADER SCROLL EFFECT
    // ============================================================================
    
    const header = document.querySelector('.site-header');
    let lastScrollY = 0;
    
    function handleHeaderScroll() {
        const currentScrollY = window.scrollY;
        
        if (header) {
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        lastScrollY = currentScrollY;
    }
    
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // ============================================================================
    // SCROLL ANIMATIONS - Intersection Observer
    // ============================================================================
    
    function initAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // ============================================================================
    // COUNTER ANIMATION - Number Count Up
    // ============================================================================
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const start = 0;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function - ease out expo
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(start + (target - start) * easeOutExpo);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Initialize counters when they come into view
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };
        
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
                    animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
        }, observerOptions);
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    document.addEventListener('DOMContentLoaded', initCounters);

    // ============================================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================================================
    // BACK TO TOP BUTTON
    // ============================================================================
    
    const backToTop = document.querySelector('.back-to-top');
    
    function handleBackToTop() {
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }
    
    window.addEventListener('scroll', handleBackToTop, { passive: true });
    
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================================================
    // FAQ ACCORDION
    // ============================================================================
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all items
                faqItems.forEach(i => i.classList.remove('active'));
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
      });
    }
  });
  
    // ============================================================================
    // DEMO WIDGET - Interactive Chat with State of the art AI Integration
    // ============================================================================
    
    const demoChat = document.getElementById('demoChat');
    const demoInput = document.getElementById('demoInput');
    const demoSend = document.getElementById('demoSend');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    
    // Chatbase / JetNova API configuration
    // Prefer the WordPress REST endpoint provided via jetnovaData, but
    // fall back to the legacy Cloudflare Worker URL for static previews.
    const CHATBASE_API_URL = (typeof window !== 'undefined' && window.jetnovaData && window.jetnovaData.chatApiUrl)
        ? window.jetnovaData.chatApiUrl
        : 'https://jetnova-website-chat.zakonweb.workers.dev/chat';
    const RATE_LIMIT_MAX = 3;
    const RATE_LIMIT_WINDOW = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    const RATE_LIMIT_KEY = 'jetnova_demo_rate_limit';
    const CONVERSATION_ID_KEY = 'jetnova_demo_conversation_id';
    
    // Conversation history for context
    let conversationHistory = [];
    let conversationId = sessionStorage.getItem(CONVERSATION_ID_KEY) || null;
    let isWaitingForResponse = false;
    
    // Rate limiting functions
    function getRateLimitData() {
        try {
            const data = localStorage.getItem(RATE_LIMIT_KEY);
            if (!data) return { timestamps: [] };
            return JSON.parse(data);
        } catch (e) {
            return { timestamps: [] };
        }
    }
    
    function saveRateLimitData(data) {
        try {
            localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save rate limit data');
        }
    }
    
    function cleanExpiredTimestamps(timestamps) {
        const now = Date.now();
        return timestamps.filter(ts => (now - ts) < RATE_LIMIT_WINDOW);
    }
    
    function canSendMessage() {
        const data = getRateLimitData();
        const validTimestamps = cleanExpiredTimestamps(data.timestamps);
        return validTimestamps.length < RATE_LIMIT_MAX;
    }
    
    function recordMessageSent() {
        const data = getRateLimitData();
        const validTimestamps = cleanExpiredTimestamps(data.timestamps);
        validTimestamps.push(Date.now());
        saveRateLimitData({ timestamps: validTimestamps });
    }
    
    function addMessage(text, isUser = false) {
        const message = document.createElement('div');
        message.className = `message ${isUser ? 'user' : 'bot'}`;
        message.style.opacity = '0';
        message.style.transform = 'translateY(10px)';
        
        // Parse Markdown for bot messages, plain text for user messages
        if (isUser) {
            message.innerHTML = text.replace(/\n/g, '<br>');
        } else {
            // Use marked.js if available, fallback to basic parsing
            if (typeof marked !== 'undefined') {
                message.innerHTML = marked.parse(text);
            } else {
                // Basic Markdown fallback
                let html = text
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.+?)\*/g, '<em>$1</em>')
                    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
                    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
                    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
                    .replace(/^- (.+)$/gm, '<li>$1</li>')
                    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
                    .replace(/\n/g, '<br>');
                message.innerHTML = html;
            }
        }
        
        if (demoChat) {
            demoChat.appendChild(message);
            demoChat.scrollTop = demoChat.scrollHeight;
            
            // Animate in
            setTimeout(() => {
                message.style.transition = 'all 0.3s ease';
                message.style.opacity = '1';
                message.style.transform = 'translateY(0)';
            }, 10);
        }
        
        return message;
    }
    
    function addTypingIndicator() {
        const typing = document.createElement('div');
        typing.className = 'message bot typing-message';
        typing.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        typing.style.opacity = '0';
        typing.style.transform = 'translateY(10px)';
        
        if (demoChat) {
            demoChat.appendChild(typing);
            demoChat.scrollTop = demoChat.scrollHeight;
            
            setTimeout(() => {
                typing.style.transition = 'all 0.3s ease';
                typing.style.opacity = '1';
                typing.style.transform = 'translateY(0)';
            }, 10);
        }
        
        return typing;
    }
    
    function removeTypingIndicator(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }
    
    async function sendToChatbase(userMessage) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s (1.5 min) safety timeout

            const response = await fetch(CHATBASE_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessage,
                    conversationId: conversationId,
                    history: conversationHistory.slice(-10) // Send last 10 messages for context
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                console.error('Chat API JSON parse error:', parseError);
                throw new Error('invalid_json');
            }
            
            if (!response.ok) {
                console.error('Chat API HTTP error:', response.status, data);
                throw new Error('http_error');
            }
            
            // Save conversation ID for session continuity
            if (data.conversationId) {
                conversationId = data.conversationId;
                sessionStorage.setItem(CONVERSATION_ID_KEY, conversationId);
            }
            
            return data.response || "I'm here to help you with travel information. What would you like to know?";
        } catch (error) {
            console.error('Chatbase / JetNova chat API error:', error);
            if (error.name === 'AbortError') {
                return "The JetNova AI server took too long to respond. Please try again in a moment.";
            }
            return "I apologize, but I'm having trouble connecting right now. Please try again in a moment.";
        }
    }
    
    async function handleDemoInput() {
        const text = demoInput.value.trim();
        
        if (!text || isWaitingForResponse) return;
        
        // Check rate limit
        if (!canSendMessage()) {
            addMessage("You've reached your message limit. Please try again later.", false);
            demoInput.value = '';
            return;
        }
        
        // Record the message and update UI
        recordMessageSent();
        addMessage(text, true);
        demoInput.value = '';
        isWaitingForResponse = true;
        
        // Add to conversation history
        conversationHistory.push({ role: 'user', content: text });
        
        // Show typing indicator
        const typingIndicator = addTypingIndicator();
        
        // Disable input while waiting
        if (demoInput) demoInput.disabled = true;
        if (demoSend) demoSend.disabled = true;
        
        try {
            // Get response from Chatbase
            const response = await sendToChatbase(text);
            
            // Remove typing indicator
            removeTypingIndicator(typingIndicator);
            
            // Add bot response
            addMessage(response, false);
            
            // Add to conversation history
            conversationHistory.push({ role: 'assistant', content: response });
            
        } catch (error) {
            removeTypingIndicator(typingIndicator);
            addMessage("I apologize, but something went wrong. Please try again.", false);
        } finally {
            isWaitingForResponse = false;
            if (demoInput) demoInput.disabled = false;
            if (demoSend) demoSend.disabled = false;
            if (demoInput) demoInput.focus();
        }
    }
    
    if (demoSend) {
        demoSend.addEventListener('click', handleDemoInput);
    }
    
    if (demoInput) {
        demoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleDemoInput();
            }
        });
    }
    
    // Suggestion chips
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            if (demoInput && !isWaitingForResponse) {
                demoInput.value = chip.textContent;
                handleDemoInput();
            }
        });
    });

    // ============================================================================
    // VIDEO PLACEHOLDER - Click to Play
    // ============================================================================
    
    const videoTrigger = document.getElementById('videoTrigger');
    
    if (videoTrigger) {
        videoTrigger.addEventListener('click', () => {
            // Replace with actual video embed or modal
            const videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
            
            const iframe = document.createElement('iframe');
            iframe.src = videoUrl;
            iframe.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;';
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('allow', 'autoplay; encrypted-media');
            
            videoTrigger.style.position = 'relative';
            videoTrigger.innerHTML = '';
            videoTrigger.appendChild(iframe);
        });
    }

    // ============================================================================
    // MOBILE MENU TOGGLE
    // ============================================================================
    
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
    if (mobileMenu) {
      mobileMenu.classList.toggle('active');
    }
            document.body.classList.toggle('menu-open');
        });
    }

    // ============================================================================
    // PARALLAX EFFECT - Subtle on Hero
    // ============================================================================
    
    function handleParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
            const offset = scrollY * speed;
            el.style.transform = `translateY(${offset}px)`;
        });
    }
    
    // Only enable parallax on larger screens
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', handleParallax, { passive: true });
    }

    // ============================================================================
    // INTERSECTION OBSERVER FOR STAGGERED ANIMATIONS
    // ============================================================================
    
    function initStaggeredAnimations() {
        const grids = document.querySelectorAll('.indicators-grid, .pricing-grid, .testimonials-grid, .steps-container');
        
        grids.forEach(grid => {
            const children = grid.children;
            
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    Array.from(children).forEach((child, index) => {
    setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                    observer.unobserve(grid);
                }
            }, { threshold: 0.2 });
            
            // Set initial state
            Array.from(children).forEach(child => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(30px)';
                child.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            });
            
            observer.observe(grid);
        });
    }
    
    document.addEventListener('DOMContentLoaded', initStaggeredAnimations);

    // ============================================================================
    // TYPING ANIMATION FOR HERO SUBTITLE
    // ============================================================================
    
    function initTypingAnimation() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(el => {
            const text = el.getAttribute('data-typing');
            const speed = parseInt(el.getAttribute('data-typing-speed')) || 50;
            
            el.textContent = '';
            
            let i = 0;
            function type() {
                if (i < text.length) {
                    el.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            
            // Start typing when element is in view
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    type();
                    observer.unobserve(el);
                }
            });
            
            observer.observe(el);
        });
    }

    // ============================================================================
    // CURSOR GLOW EFFECT - Premium Touch
    // ============================================================================
    
    function initCursorGlow() {
        const glowElements = document.querySelectorAll('.indicator-card, .pricing-card, .feature-visual');
        
        glowElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                el.style.setProperty('--mouse-x', `${x}px`);
                el.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }
    
    document.addEventListener('DOMContentLoaded', initCursorGlow);

    // ============================================================================
    // KEYBOARD NAVIGATION
    // ============================================================================
    
    document.addEventListener('keydown', (e) => {
        // ESC to close mobile menu
        if (e.key === 'Escape') {
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileToggle.click();
            }
        }
    });

    // ============================================================================
    // PERFORMANCE - Request Animation Frame Throttle
    // ============================================================================
    
    let ticking = false;
    
    function requestTick(fn) {
        if (!ticking) {
            requestAnimationFrame(() => {
                fn();
                ticking = false;
            });
            ticking = true;
        }
    }

    // ============================================================================
    // PARTICLE BACKGROUND SYSTEM
    // ============================================================================
    
    function initParticles() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particles-canvas';
        document.body.prepend(canvas);
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resize();
        window.addEventListener('resize', resize);
        
        class Particle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.hue = Math.random() * 60 + 220; // Blue to purple range
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x < 0 || this.x > canvas.width || 
                    this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
                ctx.fill();
            }
        }
        
        // Create particles
        const particleCount = Math.min(80, Math.floor(window.innerWidth / 20));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Draw connections
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(102, 126, 234, ${0.1 * (1 - distance / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });
            
            animationId = requestAnimationFrame(animate);
        }
        
        animate();
        
        // Cleanup on page hide
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    }
    
    // Only init particles on larger screens for performance
    if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.addEventListener('DOMContentLoaded', initParticles);
    }

    // ============================================================================
    // ENHANCED MOBILE MENU
    // ============================================================================
    
    function initMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('.mobile-menu');
        const menuLinks = document.querySelectorAll('.mobile-nav a');
        
        if (!toggle || !menu) return;
        
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking a link
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    document.addEventListener('DOMContentLoaded', initMobileMenu);

    // ============================================================================
    // MAGNETIC BUTTON EFFECT
    // ============================================================================
    
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.btn-primary, .cta-button');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    document.addEventListener('DOMContentLoaded', initMagneticButtons);

    // ============================================================================
    // SCROLL PROGRESS INDICATOR
    // ============================================================================
    
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            z-index: 10000;
            transition: width 0.1s ease;
            width: 0%;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }, { passive: true });
    }
    
    document.addEventListener('DOMContentLoaded', initScrollProgress);

    // ============================================================================
    // TILT EFFECT ON CARDS
    // ============================================================================
    
    function initTiltEffect() {
        const cards = document.querySelectorAll('.indicator-card, .feature-visual, .pricing-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }
    
    // Only on desktop
    if (window.innerWidth > 1024) {
        document.addEventListener('DOMContentLoaded', initTiltEffect);
    }

    // ============================================================================
    // SMOOTH NUMBER INCREMENT
    // ============================================================================
    
    function initSmoothNumbers() {
        const numbers = document.querySelectorAll('.pricing-price');
        
        numbers.forEach(num => {
            const text = num.textContent;
            if (text.includes('$')) {
                num.addEventListener('mouseenter', () => {
                    num.style.transform = 'scale(1.1)';
                    num.style.transition = 'transform 0.3s ease';
                });
                num.addEventListener('mouseleave', () => {
                    num.style.transform = 'scale(1)';
                });
            }
        });
    }
    
    document.addEventListener('DOMContentLoaded', initSmoothNumbers);

    // ============================================================================
    // PRELOAD CRITICAL RESOURCES
    // ============================================================================
    
    function preloadResources() {
        // Preload fonts
        const fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.as = 'style';
        fontPreload.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
        document.head.appendChild(fontPreload);
    }
    
    preloadResources();

    // ============================================================================
    // EASTER EGG - KONAMI CODE
    // ============================================================================
    
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                document.body.style.animation = 'rainbow 2s ease infinite';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 5000);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // ============================================================================
    // INITIALIZE ON DOM READY
    // ============================================================================
    
    document.addEventListener('DOMContentLoaded', () => {
        // Add loaded class to body for CSS transitions
        document.body.classList.add('dom-loaded');
        
        // Console branding
        console.log('%c✈️ JetNova AI', 'font-size: 24px; font-weight: bold; color: #667eea;');
        console.log('%cAI-Powered Travel Platform', 'font-size: 14px; color: #764ba2;');
        console.log('%chttps://jetnova-ai.com', 'font-size: 12px; color: #888;');
    });

})();
