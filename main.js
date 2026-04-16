// main.js
// Improved mobile menu handling - FIXED for all pages
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger');
    const mobileNavLinks = document.getElementById('navLinks');
    const body = document.body;

    if (hamburgerBtn && mobileNavLinks) {
        // Function to close menu
        const closeMenu = () => {
            hamburgerBtn.classList.remove('open');
            mobileNavLinks.classList.remove('open');
            body.classList.remove('menu-open');
        };

        // Function to open menu
        const openMenu = () => {
            hamburgerBtn.classList.add('open');
            mobileNavLinks.classList.add('open');
            body.classList.add('menu-open');
        };

        // Toggle menu on hamburger click
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mobileNavLinks.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when clicking a link
        mobileNavLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileNavLinks.classList.contains('open')) {
                if (!mobileNavLinks.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                    closeMenu();
                }
            }
        });
        
        // Close menu on window resize if screen becomes larger than mobile breakpoint (768px)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && mobileNavLinks.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        });
    }

    // ===== PRODUCT FILTER (Products Page) =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const catalogCards = document.querySelectorAll('.catalog-card');
    
    if (filterBtns.length > 0 && catalogCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                catalogCards.forEach(card => {
                    if (filter === 'all' || card.dataset.cat === filter) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ===== CONTACT FORM HANDLER (Contact Page) =====
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: contactForm.name.value,
                company: contactForm.company?.value || '',
                email: contactForm.email.value,
                phone: contactForm.phone.value,
                city: contactForm.city?.value || '',
                product: contactForm.product?.value || '',
                message: contactForm.message.value,
            };
            
            // Show loading
            if (btnText && btnLoader) {
                btnText.style.display = 'none';
                btnLoader.style.display = 'inline';
            }
            if (submitBtn) submitBtn.disabled = true;
            if (formSuccess) formSuccess.style.display = 'none';
            if (formError) formError.style.display = 'none';
            
            try {
                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    if (formSuccess) {
                        formSuccess.style.display = 'block';
                        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    contactForm.reset();
                } else {
                    if (formError) {
                        formError.style.display = 'block';
                        formError.textContent = '❌ ' + (data.error || 'Something went wrong. Please try again or call us directly.');
                    }
                }
            } catch (err) {
                if (formError) {
                    formError.style.display = 'block';
                    formError.textContent = '❌ Unable to send message. Please call +92-324-5555-277 directly.';
                }
            } finally {
                if (btnText && btnLoader) {
                    btnText.style.display = 'inline';
                    btnLoader.style.display = 'none';
                }
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    // ===== SCROLL REVEAL ANIMATIONS =====
    const revealEls = document.querySelectorAll(
        '.feature-card, .prod-card, .client-logo, .location-card, .board-card, .tl-item, .catalog-card, .client-detail-card, .testi-card, .info-card'
    );
    
    if (revealEls.length > 0 && window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 80 * (entry.target.dataset.index || 0));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        revealEls.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.dataset.index = i % 6;
            observer.observe(el);
        });
    } else if (revealEls.length > 0) {
        // Fallback for older browsers
        revealEls.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }

    // ===== WHATSAPP FLOATING BUTTON =====
    // Check if button already exists to avoid duplicates
    if (!document.querySelector('.whatsapp-float')) {
        const whatsappBtn = document.createElement('a');
        whatsappBtn.className = 'whatsapp-float';
        whatsappBtn.href = 'https://wa.me/923245555277';
        whatsappBtn.target = '_blank';
        whatsappBtn.rel = 'noopener noreferrer';
        whatsappBtn.setAttribute('aria-label', 'Chat on WhatsApp');
        whatsappBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.47 3.45 1.35 4.95L2 22l5.45-1.48c1.45.81 3.1 1.24 4.77 1.24 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12 18.89c-1.5 0-2.98-.41-4.24-1.17L6.5 18.15l.81-1.24c-.89-1.31-1.36-2.85-1.36-4.44 0-4.53 3.69-8.22 8.22-8.22 4.53 0 8.22 3.69 8.22 8.22 0 4.53-3.68 8.22-8.22 8.22z"/><path d="M16.44 13.72c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.09 3.62.57.25 1.02.4 1.37.51.57.18 1.09.15 1.5.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/></svg>';
        document.body.appendChild(whatsappBtn);
    }

    // ===== MAP LOADING INDICATOR (Contact Page) =====
    const mapIframe = document.querySelector('.location-map iframe, .map-placeholder iframe');
    const mapWrapper = document.querySelector('.map-wrapper, .map-placeholder');
    
    if (mapIframe && mapWrapper && !mapWrapper.querySelector('.map-loading-overlay')) {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'map-loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="map-loader">
                <div class="loader-spinner"></div>
                <p>Loading map...</p>
            </div>
        `;
        
        mapWrapper.style.position = 'relative';
        mapWrapper.style.overflow = 'hidden';
        mapWrapper.appendChild(loadingOverlay);
        
        mapIframe.style.opacity = '0';
        mapIframe.style.transition = 'opacity 0.3s ease';
        
        mapIframe.addEventListener('load', function() {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                mapIframe.style.opacity = '1';
            }, 300);
        });
        
        setTimeout(() => {
            if (loadingOverlay.style.display !== 'none') {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                    mapIframe.style.opacity = '1';
                }, 300);
            }
        }, 5000);
    }
});