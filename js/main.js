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
            greetings: [
                "Hello! I'm the Luxurious Towing Concierge. How can I assist you with your vehicle today?",
                "Hi there! I'm here to ensure your recovery experience is seamless. What can I do for you?",
                "Greetings. I'm at your service. Are you looking for a quote, or do you have a question about our fleet?"
            ],
            status: [
                "I'm fully operational and ready to assist! The team is currently on standby for dispatch.",
                "I'm doing excellent, thank thank you. My priority right now is helping you. How can I be of service?"
            ],
            identity: [
                "I am the Signature Concierge for Luxurious Towing—an AI specialist trained to assist with efficient, high-end vehicle recovery.",
                "I'm your virtual assistant here at Luxurious Towing. I can help with quotes, service details, and dispatch information."
            ],
            capabilities: [
                "I can provide instant quotes, explain our 'White Glove' recovery process for exotics, or check our coverage in your area.",
                "I'm here to help you schedule a tow, understand our pricing, or learn more about how we handle luxury vehicles like Ferraris and McLarens."
            ],
            exotics: [
                "We specialize in high-value assets. Our fleet uses zero-degree flatbeds and soft-strap tie-downs to ensure your McLaren, Ferrari, or Corvette is transported without a scratch.",
                "Exotic recovery is our craft. We understand the precision required for low-clearance vehicles and use only the most advanced equipment."
            ],
            location: [
                "We proudly serve the entire state of Michigan, with rapid response units stationed throughout Metro Detroit and Southeast Michigan.",
                "Our headquarters is in Detroit, but our premium network covers every corner of Michigan for long-distance and local transport."
            ],
            pricing: [
                "For a standard local tow, pricing typically starts around $95–$150. For exotics or long-distance, we provide custom quotes to ensure fairness.",
                "Pricing varies based on vehicle type and distance. A standard hook-up is generally $125 + mileage. I can give you a precise quote if you use the 'Request Now' form!"
            ],
            services: [
                "We offer a full suite of services: Emergency Recovery, Exotic Transport, Lockouts, Jumpstarts, and Heavy-Duty Hauling.",
                "From a simple tire change to a complex accident recovery for a luxury SUV, our team handles it all with white-glove care."
            ],
            contact: [
                "The fastest way to get a truck to you is by filling out the 'Request Now' form above, or calling our dispatch line directly.",
                "I recommend clicking 'Request Now' for immediate dispatch. It sends your location directly to our drivers."
            ],
            fallback: [
                "That's a great question. While I'm an expert on our towing services, I might need a bit more detail. Are you asking about pricing, location, or a specific vehicle?",
                "I want to make sure I give you the right answer. Could you rephrase that? You can ask me about 'Cost', 'Coverage', or 'Exotic Cars'."
            ]
        };

        const pickRandom = (pool) => pool[Math.floor(Math.random() * pool.length)];

        const generateResponse = (input) => {
            const query = input.toLowerCase().trim();

            // Greetings & Status
            if (query.match(/^(hi|hello|hey|greetings)/)) return pickRandom(responsePools.greetings);
            if (query.includes('how are you') || query.includes('how is it going')) return pickRandom(responsePools.status);

            // Identity & Capabilities
            if (query.includes('who are you') || query.includes('your name') || query.includes('bot')) return pickRandom(responsePools.identity);
            if (query.includes('what can you do') || query.includes('help me') || query.includes('capabilities')) return pickRandom(responsePools.capabilities);

            // Core Business Topics
            if (query.includes('price') || query.includes('cost') || query.includes('much') || query.includes('quote') || query.includes('rate')) return pickRandom(responsePools.pricing);
            if (query.includes('location') || query.includes('where') || query.includes('area') || query.includes('cover') || query.includes('michigan') || query.includes('detroit')) return pickRandom(responsePools.location);
            if (query.includes('service') || query.includes('tow') || query.includes('haul') || query.includes('truck') || query.includes('lockout') || query.includes('tire') || query.includes('jump')) return pickRandom(responsePools.services);
            if (query.includes('exotic') || query.includes('luxury') || query.includes('sport') || query.includes('mclaren') || query.includes('ferrari') || query.includes('lambo') || query.includes('porsche') || query.includes('corvette')) return pickRandom(responsePools.exotics);

            // Contact / Action
            if (query.includes('number') || query.includes('phone') || query.includes('call') || query.includes('contact')) return pickRandom(responsePools.contact);

            // Fallback
            return pickRandom(responsePools.fallback);
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
