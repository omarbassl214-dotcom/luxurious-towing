document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. SPLASH SCREEN (Must run first)
    // ---------------------------------------------------------
    const splash = document.getElementById('splash-screen');
    if (splash) {
        setTimeout(() => {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
            }, 500);
        }, 2000);
    }

    // ---------------------------------------------------------
    // 2. FORM & GEOLOCATION
    // ---------------------------------------------------------
    const form = document.querySelector('#tow-form');
    const addressInput = document.querySelector('#address');
    const locationHint = document.querySelector('#location-hint');
    const priceNotice = document.querySelector('#price-notice');
    const locationBtn = document.getElementById('get-location');
    const mapPreview = document.getElementById('map-preview');

    if (form && addressInput) {
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

        // Geolocation Logic
        if (locationBtn) {
            locationBtn.addEventListener('click', () => {
                if (navigator.geolocation) {
                    locationBtn.innerHTML = '⌛';
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const lat = position.coords.latitude;
                            const lon = position.coords.longitude;
                            addressInput.value = `Pinned: [${lat.toFixed(6)}, ${lon.toFixed(6)}]`;

                            if (mapPreview) {
                                mapPreview.classList.remove('hidden');
                                mapPreview.classList.add('active');
                                mapPreview.innerHTML = `
                                    <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; flex-direction:column; background: rgba(51, 63, 72, 0.6); color: var(--primary-color);">
                                        <span style="font-size: 2rem; margin-bottom: 10px;">📍</span>
                                        <span style="font-size: 0.8rem; letter-spacing: 1px;">COORDINATES LOCKED</span>
                                        <span style="font-size: 0.7rem; opacity: 0.6; margin-top: 5px;">${lat.toFixed(4)}, ${lon.toFixed(4)}</span>
                                    </div>
                                `;
                            }
                            locationBtn.innerHTML = '✅';
                        },
                        (error) => {
                            console.error('Geolocation Error:', error);
                            locationBtn.innerHTML = '❌';
                            alert('Unable to retrieve location. Please type your address manually.');
                        },
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                    );
                } else {
                    alert('Geolocation is not supported by your browser.');
                }
            });
        }
    }

    // ---------------------------------------------------------
    // 3. UI & ANIMATIONS
    // ---------------------------------------------------------
    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.glass-nav');
        if (nav) {
            nav.style.background = window.scrollY > 50 ? 'rgba(5, 5, 5, 0.95)' : 'rgba(5, 5, 5, 0.8)';
        }
    });

    // Video Hero
    const vid = document.getElementById('v0');
    if (vid) {
        vid.play().catch(e => console.log("Auto-play blocked:", e));
    }

    // Mobile Menu
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

    // Service Cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                serviceCards.forEach(c => { if (c !== card) c.classList.remove('expanded'); });
                this.classList.toggle('expanded');
                if (this.classList.contains('expanded')) {
                    setTimeout(() => { this.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 300);
                }
            }
        });
    });

    // ---------------------------------------------------------
    // 4. AI CONCIERGE
    // ---------------------------------------------------------
    const chatbotTrigger = document.getElementById('chatbot-trigger');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input-field');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    if (chatbotTrigger && chatbotWindow) {
        chatbotTrigger.addEventListener('click', () => chatbotWindow.classList.toggle('active'));
        chatbotClose.addEventListener('click', () => chatbotWindow.classList.remove('active'));

        const addMessage = (text, sender) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${sender}`;
            msgDiv.textContent = text;
            chatbotMessages.appendChild(msgDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        };

        const responsePools = {
            greetings: ["Hello! I'm the Luxurious Towing Concierge.", "Hi! I'm here to help."],
            status: ["Operational and ready to assist!", "Doing excellent."],
            identity: ["I'm the Signature Concierge assistant."],
            capabilities: ["I can help with quotes and dispatch info."],
            exotics: ["We specialize in Ferraris, McLarens, and more."],
            location: ["We serve all of Michigan and Metro Detroit."],
            pricing: ["Standard tows start around $95-$150."],
            services: ["Recovery, Transport, Lockouts, and more."],
            contact: ["Fill out the form above for immediate dispatch."],
            fallback: ["Could you please rephrase that?"]
        };

        const pickRandom = (p) => p[Math.floor(Math.random() * p.length)];
        const generateResponse = (q) => {
            q = q.toLowerCase();
            if (q.match(/hi|hello/)) return pickRandom(responsePools.greetings);
            if (q.includes('price') || q.includes('cost')) return pickRandom(responsePools.pricing);
            if (q.includes('location') || q.includes('area')) return pickRandom(responsePools.location);
            if (q.includes('exotic') || q.includes('luxury')) return pickRandom(responsePools.exotics);
            return pickRandom(responsePools.fallback);
        };

        const handleSend = () => {
            const text = chatbotInput.value.trim();
            if (text) {
                addMessage(text, 'user');
                chatbotInput.value = '';
                setTimeout(() => addMessage(generateResponse(text), 'bot'), 600);
            }
        };

        chatbotSend.addEventListener('click', handleSend);
        chatbotInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
    }
});
