// NAV scroll behavior
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));

// Grouped nav menus
document.querySelectorAll('.nav-menu-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.nav-item');
    const isOpen = item.classList.contains('menu-open');

    document.querySelectorAll('.nav-item.menu-open').forEach(openItem => {
      openItem.classList.remove('menu-open');
      const openTrigger = openItem.querySelector('.nav-menu-trigger');
      if (openTrigger) openTrigger.setAttribute('aria-expanded', 'false');
    });

    item.classList.toggle('menu-open', !isOpen);
    trigger.setAttribute('aria-expanded', String(!isOpen));
  });
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.querySelectorAll('.nav-item.menu-open').forEach(item => item.classList.remove('menu-open'));
    document.querySelectorAll('.nav-menu-trigger').forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));
  });
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

// First-class checklist popup
const checklistPopup = document.getElementById('checklistPopup');
if (checklistPopup) {
  const popupPanel = checklistPopup.querySelector('.checklist-popup-panel');
  const requestButton = checklistPopup.querySelector('[data-checklist-request]');
  const serviceSelect = document.getElementById('service');
  const messageField = document.getElementById('message');
  const storageKey = 'poleprofChecklistPopupDismissed';
  let popupTimer = null;

  const openChecklistPopup = () => {
    if (window.localStorage.getItem(storageKey) === 'true') return;
    checklistPopup.classList.add('is-open');
    checklistPopup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('body-modal-open');
    popupPanel.focus();
  };

  const closeChecklistPopup = () => {
    checklistPopup.classList.remove('is-open');
    checklistPopup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('body-modal-open');
    window.localStorage.setItem(storageKey, 'true');
    if (popupTimer) window.clearTimeout(popupTimer);
  };

  popupTimer = window.setTimeout(openChecklistPopup, 1400);

  checklistPopup.querySelectorAll('[data-checklist-close]').forEach((button) => {
    button.addEventListener('click', closeChecklistPopup);
  });

  const requestChecklist = () => {
    if (serviceSelect) serviceSelect.value = 'first-class-checklist';
    if (messageField) {
      messageField.value = 'Please send me the free First Pole Class Confidence Checklist.';
    }
  };

  if (requestButton) {
    requestButton.addEventListener('click', (event) => {
      event.preventDefault();
      requestChecklist();
      closeChecklistPopup();
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => {
        serviceSelect?.focus();
      }, 450);
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && checklistPopup.classList.contains('is-open')) {
      closeChecklistPopup();
    }
  });
}

// Mobile party package detail modal
const tierModal = document.getElementById('mobileTierModal');
if (tierModal) {
  const tierModalPanel = tierModal.querySelector('.mobile-tier-modal-panel');
  const tierModalTitle = tierModal.querySelector('#mobileTierModalTitle');
  const tierModalIntro = tierModal.querySelector('.mobile-tier-modal-intro');
  const tierModalList = tierModal.querySelector('.mobile-tier-modal-list');
  const tierModalPrice = tierModal.querySelector('.mobile-tier-modal-price');
  let lastTierTrigger = null;

  const closeTierModal = () => {
    tierModal.classList.remove('is-open');
    tierModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('body-modal-open');
    if (lastTierTrigger) {
      lastTierTrigger.focus();
    }
  };

  document.querySelectorAll('.mobile-tier-art-button').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.mobile-tier-card');
      if (!card) return;

      tierModalTitle.textContent = card.dataset.tierTitle || '';
      tierModalIntro.textContent = card.dataset.tierIntro || '';
      tierModalPrice.textContent = card.dataset.tierPrice || '';
      tierModalList.innerHTML = '';

      (card.dataset.tierItems || '').split('|').filter(Boolean).forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        tierModalList.appendChild(li);
      });

      lastTierTrigger = button;
      tierModal.classList.add('is-open');
      tierModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('body-modal-open');
      tierModalPanel.focus();
    });
  });

  tierModal.querySelectorAll('[data-tier-close]').forEach((closeButton) => {
    closeButton.addEventListener('click', closeTierModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && tierModal.classList.contains('is-open')) {
      closeTierModal();
    }
  });
}
