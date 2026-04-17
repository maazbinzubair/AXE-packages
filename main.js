// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close nav on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
  });
});

// ===== PRODUCT FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const catalogCards = document.querySelectorAll('.catalog-card');

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

// ===== CONTACT FORM (FormSubmit.co Version - No Backend Required) =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form values
  const name = contactForm.name?.value || '';
  const company = contactForm.company?.value || 'N/A';
  const email = contactForm.email?.value || '';
  const phone = contactForm.phone?.value || '';
  const city = contactForm.city?.value || 'Not specified';
  const product = contactForm.product?.value || 'Not specified';
  const message = contactForm.message?.value || '';

  // Basic validation
  if (!name || !email || !phone || !message) {
    formError.style.display = 'block';
    formError.innerHTML = '❌ Please fill in all required fields (*).';
    setTimeout(() => { formError.style.display = 'none'; }, 5000);
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formError.style.display = 'block';
    formError.innerHTML = '❌ Please enter a valid email address.';
    setTimeout(() => { formError.style.display = 'none'; }, 5000);
    return;
  }

  // Show loading
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline';
  submitBtn.disabled = true;
  formSuccess.style.display = 'none';
  formError.style.display = 'none';

  try {
    // Send to FormSubmit.co (free service, no registration needed)
    const response = await fetch('https://formsubmit.co/ajax/sheikh.maaz1308@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        company: company,
        email: email,
        phone: phone,
        city: city,
        product: product,
        message: message,
        _subject: `New Enquiry from ${name} - AXE Packages`,
        _template: 'table',
        _captcha: 'false'
      })
    });

    const data = await response.json();
    
    if (response.ok && data.success !== false) {
      formSuccess.style.display = 'block';
      contactForm.reset();
      setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
    } else {
      throw new Error('Form submission failed');
    }
  } catch (err) {
    console.error('Form Error:', err);
    formError.style.display = 'block';
    formError.innerHTML = '❌ Unable to send message. Please email us directly at info@axepackages.pk or call +92-42-3591-7800';
    setTimeout(() => { formError.style.display = 'none'; }, 8000);
  } finally {
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
    submitBtn.disabled = false;
  }
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(
  '.feature-card, .prod-card, .client-logo, .location-card, .board-card, .tl-item, .catalog-card, .client-detail-card, .testi-card, .info-card'
);

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