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
});
