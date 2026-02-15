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

        // 2. Form & Elements
        const form = document.querySelector('#tow-form');
        const addressInput = document.querySelector('#address');
        const locationHint = document.querySelector('#location-hint');
        const quickPin = document.getElementById('quick-pin');
        const pinStatus = document.getElementById('pin-status');
        const mapPreview = document.getElementById('map-preview');
        // Notice elements are removed as per request

        if (form && addressInput) {
            // Auto-select text on click
            addressInput.addEventListener('click', () => {
                if (addressInput.value.includes(',')) {
                    addressInput.select();
                }
            });

            // Simple Input Handler (No Geofencing)
            addressInput.addEventListener('input', (e) => {
                const value = e.target.value;
                if (value.length > 3) {
                    // Optional: Just show a generic "Locating..." or clear hint
                    if (locationHint) locationHint.textContent = "✓ Address detected";
                    if (locationHint) locationHint.style.color = "#4CAF50";
                } else {
                    if (locationHint) locationHint.textContent = "";
                }
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = form.querySelector('button');
                const originalText = btn.textContent;

                // key check
                const keyInput = form.querySelector('input[name="access_key"]');
                if (!keyInput || keyInput.value === 'YOUR_ACCESS_KEY_HERE') {
                    alert('System Error: Email Access Key not configured. Please contact the administrator.');
                    return;
                }

                btn.textContent = "Dispatching...";
                btn.disabled = true;

                const formData = new FormData(form);
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);

                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                })
                    .then(async (response) => {
                        let json = await response.json();
                        if (response.status == 200) {
                            // Success
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
                        } else {
                            // Web3Forms Error
                            console.log(response);
                            alert(json.message);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        alert('Something went wrong. Please try again or call us directly.');
                    })
                    .finally(() => {
                        setTimeout(() => {
                            btn.textContent = originalText;
                            btn.disabled = false;
                            btn.style.background = "";
                        }, 3000);
                    });
            });

            // Quick Pin - Just gets coordinates, no validation
            if (quickPin) {
                quickPin.addEventListener('click', () => {
                    if (navigator.geolocation) {
                        if (pinStatus) {
                            pinStatus.textContent = "⌛ Locating...";
                        }

                        navigator.geolocation.getCurrentPosition(
                            (pos) => {
                                const lat = parseFloat(pos.coords.latitude.toFixed(6));
                                const lon = parseFloat(pos.coords.longitude.toFixed(6));
                                const gMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;

                                addressInput.value = gMapsUrl;

                                if (pinStatus) {
                                    pinStatus.textContent = "✅ Location Secured";
                                    pinStatus.style.background = "rgba(76, 175, 80, 0.1)";
                                    pinStatus.style.color = "#4CAF50";
                                }

                                if (locationHint) {
                                    locationHint.textContent = "✓ GPS Coordinates Secured";
                                    locationHint.style.color = "#4CAF50";
                                }

                                if (mapPreview) {
                                    mapPreview.classList.remove('hidden');
                                    mapPreview.classList.add('active');

                                    mapPreview.innerHTML = `
                                        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; flex-direction:column; background: rgba(0, 0, 0, 0.8); border: 1px solid var(--primary-color); border-radius: 8px; cursor: pointer;">
                                            <span style="font-size: 1.2rem; margin-bottom: 8px;">📍</span>
                                            <a href="${gMapsUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none; font-size: 0.8rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">
                                                OPEN IN MAPS ↗
                                            </a>
                                        </div>`;

                                    mapPreview.onclick = (e) => {
                                        window.open(gMapsUrl, '_blank');
                                    };
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
                if (q.includes('location') || q.includes('area')) return "We offer nationwide covered transport for all vehicle types.";
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
