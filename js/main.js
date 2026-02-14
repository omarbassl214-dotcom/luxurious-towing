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

        const generateResponse = (input) => {
            const query = input.toLowerCase();

            if (query.includes('mclaren') || query.includes('corvette') || query.includes('exotic') || query.includes('luxury')) {
                return "We specialize in white-glove recovery for exotics. We use soft-strap tie-downs and low-clearance ramps to ensure your vehicle is treated with absolute care.";
            }
            if (query.includes('location') || query.includes('detroit') || query.includes('michigan') || query.includes('area')) {
                return "We provide 24/7 premium recovery across the entire state of Michigan, with rapid dispatch in the Metro Detroit area.";
            }
            if (query.includes('price') || query.includes('cost') || query.includes('quote')) {
                return "Our pricing is transparent and based on vehicle type and distance. You can use the 'Request Now' form in the contact section for a precise estimate.";
            }
            if (query.includes('services') || query.includes('towing') || query.includes('lockout')) {
                return "We offer everything from emergency lockouts and jumpstarts to long-distance transport and heavy-duty recovery.";
            }
            if (query.includes('hello') || query.includes('hi')) {
                return "Hello! How can the Luxurious Towing team assist you today?";
            }

            return "That's an excellent question. To give you the most accurate assistance, I recommend submitting a quick request through our form, or I can tell you more about our exotic vehicle specialization.";
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
