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
        const nationalNotice = document.getElementById('national-notice'); // NEW
        const quickPin = document.getElementById('quick-pin');
        const pinStatus = document.getElementById('pin-status');
        const mapPreview = document.getElementById('map-preview');

        // Helper: Michigan Geofence Check
        // Approx Box: Lat 41.6 to 48.3, Lon -90.5 to -82.3
        const isMichigan = (lat, lon) => {
            return (lat >= 41.6 && lat <= 48.3) && (lon >= -90.5 && lon <= -82.3);
        };

        if (form && addressInput) {
            // Auto-select text on click
            addressInput.addEventListener('click', () => {
                if (addressInput.value.includes(',')) {
                    addressInput.select();
                }
            });

            const setLocationState = (isGreen, message) => {
                locationHint.textContent = message;
                locationHint.style.color = isGreen ? "#4CAF50" : "#ff4444";

                addressInput.style.borderColor = isGreen ? "#4CAF50" : "#ff4444";
                addressInput.style.backgroundColor = isGreen ? "rgba(76, 175, 80, 0.1)" : "rgba(255, 68, 68, 0.1)";

                if (isGreen) {
                    if (nationalNotice) nationalNotice.classList.add('hidden');
                    if (priceNotice) priceNotice.classList.add('hidden'); // Ensure yellow is gone
                } else {
                    if (nationalNotice) nationalNotice.classList.remove('hidden');
                    if (priceNotice) priceNotice.classList.add('hidden'); // Prioritize Red over Yellow
                }
            };

            addressInput.addEventListener('input', (e) => {
                const value = e.target.value.toLowerCase();

                // Reset styling if empty
                if (value.length < 3) {
                    addressInput.style.borderColor = "";
                    addressInput.style.backgroundColor = "";
                    locationHint.textContent = "";
                    if (nationalNotice) nationalNotice.classList.add('hidden');
                    return;
                }

                locationHint.textContent = "Checking coverage...";
                locationHint.style.color = "#d4af37";

                setTimeout(() => {
                    // 1. Check if input is Coordinates (Math Check)
                    const coords = value.split(',').map(n => parseFloat(n.trim()));
                    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                        const [lat, lon] = coords;
                        if (isMichigan(lat, lon)) {
                            setLocationState(true, "✓ In standard coverage area");
                        } else {
                            setLocationState(false, "⚠️ National Transport Zone");
                        }
                        return;
                    }

                    // 2. Keyword Checks (Text Address)
                    // Strict "Green" Keywords (Michigan Cities/generic)
                    const isLocal = value.includes('detroit') || value.includes('michigan') || value.includes('mi') || value.includes('48') || value.includes('grand rapids') || value.includes('lansing') || value.includes('ann arbor');

                    // Strict "Red" Keywords (Other States)
                    const outOfStateKeywords = ['ohio', 'indiana', 'illinois', 'chicago', 'toledo', 'florida', 'texas', 'california', 'ny', 'york', 'usa', 'united states'];
                    const isOutOfState = outOfStateKeywords.some(keyword => value.includes(keyword));

                    if (isOutOfState) {
                        setLocationState(false, "⚠️ National Transport Zone");
                    } else if (isLocal) {
                        setLocationState(true, "✓ In standard coverage area");
                    } else {
                        // Default to Green for ambiguous "nearby" text, unless explicit Out of State
                        setLocationState(true, "✓ Coverage confirmed");
                    }
                }, 500);
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
                    // Reset Styles
                    addressInput.style.borderColor = "";
                    addressInput.style.backgroundColor = "";
                    if (mapPreview) {
                        mapPreview.classList.add('hidden');
                        mapPreview.innerHTML = '';
                    }
                    if (pinStatus) {
                        pinStatus.textContent = "Ready to Pin";
                        pinStatus.style.background = "";
                        pinStatus.style.color = "";
                    }
                    if (nationalNotice) nationalNotice.classList.add('hidden');
                    if (priceNotice) priceNotice.classList.add('hidden');

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
                                const lat = parseFloat(pos.coords.latitude.toFixed(6));
                                const lon = parseFloat(pos.coords.longitude.toFixed(6));
                                const gMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;

                                addressInput.value = `${lat}, ${lon}`;

                                // GEOFENCE CHECK
                                const inState = isMichigan(lat, lon);

                                if (inState) {
                                    setLocationState(true, "✓ In standard coverage area");
                                } else {
                                    setLocationState(false, "⚠️ National Transport Zone");
                                }

                                if (pinStatus) {
                                    pinStatus.textContent = inState ? "✅ Simply Secured" : "⚠️ Out of Area";
                                    pinStatus.style.background = inState ? "rgba(76, 175, 80, 0.1)" : "rgba(255, 68, 68, 0.1)";
                                    pinStatus.style.color = inState ? "#4CAF50" : "#ff4444";
                                }

                                if (mapPreview) {
                                    mapPreview.classList.remove('hidden');
                                    mapPreview.classList.add('active');
                                    const stateText = inState ? "MICHIGAN DETECTED" : "OUT OF STATE";
                                    const stateColor = inState ? "var(--primary-color)" : "#ff4444";

                                    mapPreview.innerHTML = `
                                        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; flex-direction:column; background: rgba(0, 0, 0, 0.8); border: 1px solid ${stateColor}; border-radius: 8px; cursor: pointer;">
                                            <span style="font-size: 1.2rem; margin-bottom: 8px;">📍</span>
                                            <a href="${gMapsUrl}" target="_blank" style="color: ${stateColor}; text-decoration: none; font-size: 0.8rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">
                                                OPEN IN MAPS ↗
                                            </a>
                                            <span style="font-size: 0.6rem; color: ${stateColor}; margin-top: 5px; font-weight:bold;">${stateText}</span>
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
                if (q.includes('location') || q.includes('area')) return "We are based in Michigan but offer nationwide transport for all vehicle types.";
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
