// Luxurious Towing - Final Robust Main Script
(function () {
    function init() {
        // 1. Splash Screen Control
        const splash = document.getElementById('splash-screen');
        if (splash) {
            setTimeout(() => {
                splash.style.opacity = '0';
                setTimeout(() => splash.style.display = 'none', 500);
            }, 2000);
        }

        // 2. Elements Check
        const form = document.querySelector('#tow-form');
        const addressInput = document.querySelector('#address');
        const locationHint = document.querySelector('#location-hint');
        const priceNotice = document.querySelector('#price-notice');
        const quickPin = document.getElementById('quick-pin');
        const pinStatus = document.getElementById('pin-status');
        const mapPreview = document.getElementById('map-preview');

        if (form && addressInput) {
            addressInput.addEventListener('input', (e) => {
                const value = e.target.value.toLowerCase();
                if (value.length > 5) {
                    locationHint.textContent = "Checking area...";
                    locationHint.style.color = "#d4af37";
                    setTimeout(() => {
                        const isLocal = value.includes('detroit') || value.includes('michigan') || value.includes('mi');
                        locationHint.textContent = isLocal ? "✓ In standard coverage area" : "Outside standard zone";
                        locationHint.style.color = isLocal ? "#4CAF50" : "#ff4444";
                        if (priceNotice) priceNotice.classList.toggle('hidden', isLocal);
                    }, 500);
                }
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = form.querySelector('button');
                const originalText = btn.textContent;
                btn.textContent = "Dispatching...";
                btn.disabled = true;
                setTimeout(() => {
                    alert(`Request received! A dispatch team has been notified.`);
                    btn.textContent = "Request Sent";
                    btn.style.background = "#4CAF50";
                    form.reset();
                    if (mapPreview) {
                        mapPreview.classList.add('hidden');
                        mapPreview.innerHTML = '';
                    }
                    if (pinStatus) {
                        pinStatus.textContent = "Ready to Pin";
                        pinStatus.style.background = "";
                        pinStatus.style.color = "";
                    }
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        btn.style.background = "";
                    }, 3000);
                }, 1500);
            });

            if (quickPin) {
                quickPin.addEventListener('click', () => {
                    if (navigator.geolocation) {
                        if (pinStatus) {
                            pinStatus.textContent = "⌛ Securing...";
                        }

                        navigator.geolocation.getCurrentPosition(
                            (pos) => {
                                const lat = pos.coords.latitude.toFixed(6);
                                const lon = pos.coords.longitude.toFixed(6);
                                const gMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;

                                // Set input to coordinates (Best for Google Search copy-paste)
                                addressInput.value = `${lat}, ${lon}`;

                                if (pinStatus) {
                                    pinStatus.textContent = "✅ Secured";
                                    pinStatus.style.background = "rgba(76, 175, 80, 0.1)";
                                    pinStatus.style.color = "#4CAF50";
                                }

                                if (mapPreview) {
                                    mapPreview.classList.remove('hidden');
                                    mapPreview.classList.add('active');
                                    mapPreview.innerHTML = `
                                        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; flex-direction:column; background: rgba(51, 63, 72, 0.6); border-radius: 8px; border: 1px solid var(--primary-color);">
                                            <span style="font-size: 1.2rem; margin-bottom: 5px;">📍</span>
                                            <a href="${gMapsUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none; font-size: 0.75rem; font-weight: bold; letter-spacing: 1px; display: flex; align-items: center; gap: 5px;">
                                                OPEN IN GOOGLE MAPS ↗
                                            </a>
                                            <span style="font-size: 0.6rem; opacity: 0.6; margin-top: 5px;">Coordinations: ${lat}, ${lon}</span>
                                        </div>`;

                                    // Also make the whole preview box a link for convenience
                                    mapPreview.style.cursor = 'pointer';
                                    mapPreview.onclick = () => window.open(gMapsUrl, '_blank');
                                }
                            },
                            () => {
                                if (pinStatus) pinStatus.textContent = "❌ Failed";
                                alert('Please allow location access to use Quick Pin.');
                            },
                            { enableHighAccuracy: true, timeout: 5000 }
                        );
                    }
                });
            }
        }

        // 3. AI Concierge
        const trigger = document.getElementById('chatbot-trigger');
        const windowEl = document.getElementById('chatbot-window');
        const closeBtn = document.getElementById('chatbot-close');
        const input = document.getElementById('chatbot-input-field');
        const sendBtn = document.getElementById('chatbot-send');
        const messages = document.getElementById('chatbot-messages');

        if (trigger && windowEl) {
            trigger.addEventListener('click', () => windowEl.classList.toggle('active'));
            if (closeBtn) closeBtn.addEventListener('click', () => windowEl.classList.remove('active'));

            const addMessage = (text, sender) => {
                const div = document.createElement('div');
                div.className = `message ${sender}`;
                div.textContent = text;
                messages.appendChild(div);
                messages.scrollTop = messages.scrollHeight;
            };

            const generateResponse = (q) => {
                q = q.toLowerCase();
                if (q.includes('price') || q.includes('cost')) return "Standard tows start at $95. For exotics, use our form for a custom quote.";
                if (q.includes('location') || q.includes('area')) return "We serve all of Michigan, with 24/7 service in Metro Detroit.";
                return "I'm the Luxurious Towing Concierge. How can I assist you today?";
            };

            const send = () => {
                const text = input.value.trim();
                if (text) {
                    addMessage(text, 'user');
                    input.value = '';
                    setTimeout(() => addMessage(generateResponse(text), 'bot'), 600);
                }
            };

            if (sendBtn) sendBtn.addEventListener('click', send);
            if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') send(); });
        }

        // 4. General UX
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const t = document.querySelector(a.getAttribute('href'));
                if (t) t.scrollIntoView({ behavior: 'smooth' });
            });
        });

        const v0 = document.getElementById('v0');
        if (v0) v0.play().catch(() => { });

        // Mobile Menu
        const menuBtn = document.querySelector('.mobile-menu-toggle');
        const menuOverlay = document.querySelector('.mobile-menu-overlay');
        if (menuBtn && menuOverlay) {
            menuBtn.addEventListener('click', () => {
                menuBtn.classList.toggle('active');
                menuOverlay.classList.toggle('active');
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
