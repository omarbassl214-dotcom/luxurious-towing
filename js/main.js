document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#tow-form');
    const addressInput = document.querySelector('#address');
    const locationHint = document.querySelector('#location-hint');
    const priceNotice = document.querySelector('#price-notice');

    if (!form || !addressInput) return;

    // Splash Screen
    const splash = document.getElementById('splash-screen');
    if (splash) {
        setTimeout(() => {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
            }, 500);
        }, 2000);
    }

    // Simulate location checking
    addressInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        if (value.length > 5) {
            locationHint.textContent = "Checking coverage...";
            locationHint.style.color = "#d4af37";
            setTimeout(() => {
                const isLocal = value.includes('detroit') ||
                    value.includes('ann arbor') ||
                    value.includes('mi') ||
                    value.includes('michigan') ||
                    value.includes('grand rapids');
                if (isLocal) {
                    locationHint.textContent = "✓ In standard coverage area";
                    locationHint.style.color = "#4CAF50";
                    priceNotice.classList.add('hidden');
                } else {
                    locationHint.textContent = "Outside standard zone";
                    locationHint.style.color = "#ff4444";
                    priceNotice.classList.remove('hidden');
                }
            }, 500);
        } else {
            locationHint.textContent = "Checking coverage area...";
            locationHint.style.color = "rgba(255,255,255,0.5)";
            priceNotice.classList.add('hidden');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.textContent;
        const vehicleType = document.querySelector('#vehicle-type').value;
        const typeLabel = vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1);
        btn.textContent = "Dispatching...";
        btn.disabled = true;
        setTimeout(() => {
            alert(`Request Received for ${typeLabel} Towing! A dispatch team has been notified.`);
            btn.textContent = "Request Sent";
            btn.style.background = "#4CAF50";
            btn.style.color = "#fff";
            form.reset();
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.background = "";
                btn.style.color = "";
            }, 3000);
        }, 1500);
    });

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.glass-nav');
        if (nav) {
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(5, 5, 5, 0.95)';
            } else {
                nav.style.background = 'rgba(5, 5, 5, 0.8)';
            }
        }
    });

    // VIDEO HERO LOGIC (Canvas-based to bypass browser controls)
    const scrollAnim = document.getElementById('scroll-animation');
    const vid = document.getElementById('v0');
    const canvas = document.getElementById('hero-canvas');

    if (scrollAnim && vid && canvas) {
        const ctx = canvas.getContext('2d');

        const render = () => {
            if (vid.readyState >= 2) { // Ensure video has enough data
                if (canvas.width !== vid.videoWidth || canvas.height !== vid.videoHeight) {
                    canvas.width = vid.videoWidth;
                    canvas.height = vid.videoHeight;
                    console.log('Canvas resized to:', canvas.width, canvas.height);
                }
                ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
            }
            requestAnimationFrame(render);
        };

        const startEffect = () => {
            console.log("Starting video-to-canvas rendering...");
            vid.play().catch(e => console.log("Auto-play blocked:", e));
            render();
            scrollAnim.style.display = 'block';
            scrollAnim.style.opacity = '1';
        };

        vid.addEventListener('canplay', startEffect);
        vid.addEventListener('play', () => console.log("Video is playing"));

        // Fallback for already playing/loaded video
        if (vid.readyState >= 2) {
            startEffect();
        }
    }

    // Mobile Menu Toggle logic
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const menuLinks = document.querySelectorAll('.mobile-links a');

    if (menuToggle && menuOverlay) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : '';
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Service Cards Tap-to-Expand (Mobile only optimization)
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                // If there's an already expanded card, close it (optional accordion effect)
                serviceCards.forEach(c => {
                    if (c !== card) c.classList.remove('expanded');
                });

                this.classList.toggle('expanded');

                // Scroll into view if expanded
                if (this.classList.contains('expanded')) {
                    setTimeout(() => {
                        this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 300);
                }
            }
        });
    });
    // AI Concierge Logic
    const chatbotTrigger = document.getElementById('chatbot-trigger');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input-field');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    if (chatbotTrigger && chatbotWindow) {
        chatbotTrigger.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
        });

        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });

        const addMessage = (text, sender) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${sender}`;
            msgDiv.textContent = text;
            chatbotMessages.appendChild(msgDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        };

        const responsePools = {
            status: [
                "I'm doing great, thank you for asking! Just here and ready to help you get moving again.",
                "All systems are clear and our dispatch team is currently on standby. How can I make your day better?"
            ],
            greetings: [
                "Hello! How can the Luxurious Towing team assist you today?",
                "Hi there! I'm your signature concierge. How's your day going despite the car trouble?",
                "Greetings! I'm here to help you with any premium recovery or transport questions."
            ],
            identity: [
                "I'm your Luxurious Towing Signature Concierge—dedicated to making your recovery experience as seamless as possible.",
                "I represent Michigan's elite towing team. I'm here to guide you through our premium services and handle any questions you have."
            ],
            capabilities: [
                "You can ask me about our white-glove exotic recovery, our Michigan-wide coverage, or get a quick estimate on pricing!",
                "I'm trained to help with service details, accident recovery procedures, and helping you understand what makes our 'Luxurious' service different."
            ],
            exotics: [
                "Exotics are our specialty. We use non-marring soft-strap tie-downs and low-clearance ramps to treat your McLaren, Corvette, or Ferrari with absolute care.",
                "We understand the value of your asset. Our team is trained specifically for luxury car transport, ensuring zero-damage recovery every time."
            ],
            location: [
                "We provide 24/7 premium recovery across the entire state of Michigan. We're most rapid in the Metro Detroit and Southeast Michigan areas!",
                "Wherever you are in Michigan, our dispatch is on call. We specialize in spanning the whole state for high-end recovery."
            ],
            pricing: [
                "Every job is unique, but our premium local towing typically ranges between $95 - $250 depending on the vehicle and distance.",
                "For exotic recovery, we provide bespoke quotes. Usually, you're looking at a $150 base with distance fees, but the 'Request Now' form will give you the most accurate number."
            ],
            services: [
                "We handle everything: from emergency lockouts and jumpstarts to heavy-duty truck recovery and long-distance transport.",
                "Whether it's a simple tire change or a complex accident recovery, we bring the same 'White Glove' level of care to every job."
            ]
        };

        const pickRandom = (pool) => pool[Math.floor(Math.random() * pool.length)];

        const generateResponse = (input) => {
            const query = input.toLowerCase();

            if (query.includes('how are you') || query.includes('how\'s it going')) return pickRandom(responsePools.status);
            if (query.includes('hello') || query.includes('hi') || query.includes('hey')) return pickRandom(responsePools.greetings);
            if (query.includes('who are you') || query.includes('your name')) return pickRandom(responsePools.identity);
            if (query.includes('what can i ask') || query.includes('what can you do')) return pickRandom(responsePools.capabilities);

            if (query.includes('mclaren') || query.includes('corvette') || query.includes('exotic') || query.includes('luxury') || query.includes('ferrari')) {
                return pickRandom(responsePools.exotics);
            }
            if (query.includes('location') || query.includes('detroit') || query.includes('michigan') || query.includes('area') || query.includes('where')) {
                return pickRandom(responsePools.location);
            }
            if (query.includes('price') || query.includes('cost') || query.includes('quote') || query.includes('much')) {
                return pickRandom(responsePools.pricing);
            }
            if (query.includes('services') || query.includes('towing') || query.includes('lockout') || query.includes('help')) {
                return pickRandom(responsePools.services);
            }

            return "That's an interesting point! To give you the absolute best assistance, I recommend a quick chat with our dispatch through the 'Request Now' form, or I can tell you more about our Michigan coverage.";
        };

        const handleSend = () => {
            const text = chatbotInput.value.trim();
            if (text) {
                addMessage(text, 'user');
                chatbotInput.value = '';

                // Simulate bot thinking
                setTimeout(() => {
                    const response = generateResponse(text);
                    addMessage(response, 'bot');
                }, 600);
            }
        };

        chatbotSend.addEventListener('click', handleSend);
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }
});
