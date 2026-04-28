// NAV scroll behavior
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Smooth-reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .testimonial-card, .about-grid, .bach-perks .perk').forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// Contact form submission feedback
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    const btn = form.querySelector('button[type="submit"]');
    const action = form.getAttribute('action');
    if (action.includes('YOUR_FORM_ID') || !action.includes('@')) {
      e.preventDefault();
      btn.textContent = '⚠️ Form not configured yet';
      btn.style.background = '#c4607a';
      return;
    }
    btn.textContent = 'Sending...';
    btn.disabled = true;
  });
}
