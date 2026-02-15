// Hard-Reset Main.js for Maximum Reliability
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
        const locationBtn = document.getElementById('get-location');
        const mapPreview = document.getElementById('map-preview');

        // 3. Form Logic (Optional Check)
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
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        btn.style.background = "";
                    }, 3000);
                }, 1500);
            });

            if (locationBtn) {
                locationBtn.addEventListener('click', () => {
                    if (navigator.geolocation) {
                        locationBtn.innerHTML = '⌛';
                        navigator.geolocation.getCurrentPosition(
                            (pos) => {
                                addressInput.value = `Pinned: [${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}]`;
                                if (mapPreview) {
                                    mapPreview.classList.remove('hidden');
                                    mapPreview.classList.add('active');
                                    mapPreview.innerHTML = `
                                        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; flex-direction:column; background: rgba(51, 63, 72, 0.6); color: var(--primary-color);">
                                            <span style="font-size: 2rem; margin-bottom: 10px;">📍</span>
                                            <span style="font-size: 0.8rem; letter-spacing: 1px;">COORDINATES LOCKED</span>
                                        </div>`;
                                }
                                locationBtn.innerHTML = '✅';
                            },
                            () => { locationBtn.innerHTML = '❌'; alert('Direct location access failed. Please type address.'); },
                            { enableHighAccuracy: true, timeout: 5000 }
                        );
                    }
                });
            }
        }

        // 4. UI General
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const t = document.querySelector(a.getAttribute('href'));
                if (t) t.scrollIntoView({ behavior: 'smooth' });
            });
        });

        const vid = document.getElementById('v0');
        if (vid) vid.play().catch(() => { });

        // Mobile Menu
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const menuOverlay = document.querySelector('.mobile-menu-overlay');
        if (menuToggle && menuOverlay) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
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
