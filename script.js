// Lightweight behavior tracking to help separate likely humans from passive/bot traffic in GA4
const trackEvent = (name, params = {}) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
};

let likelyHumanTracked = false;
const markLikelyHuman = (signal) => {
  if (likelyHumanTracked) return;
  likelyHumanTracked = true;
  trackEvent('likely_human_visit', { signal });
};

// NAV scroll behavior
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    trackEvent('nav_toggle', { state: navLinks.classList.contains('open') ? 'open' : 'closed' });
    markLikelyHuman('nav_toggle');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Smooth-reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .testimonial-card, .about-grid, .bach-perks .perk, .growth-card, .referral-card').forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// Scroll depth signals
const scrollMarks = [25, 50, 75];
const firedScrollMarks = new Set();
window.addEventListener('scroll', () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return;
  const pct = Math.round((window.scrollY / scrollable) * 100);
  scrollMarks.forEach(mark => {
    if (pct >= mark && !firedScrollMarks.has(mark)) {
      firedScrollMarks.add(mark);
      trackEvent('scroll_depth', { percent: mark });
      if (mark >= 25) markLikelyHuman(`scroll_${mark}`);
    }
  });
}, { passive: true });

// CTA / button tracking
const classifyButton = (el) => {
  const text = (el.textContent || '').trim().toLowerCase();
  const href = el.getAttribute('href') || '';
  if (href.includes('oncloudnine')) return 'shop';
  if (href.includes('#contact') || text.includes('book') || text.includes('order') || text.includes('claim')) return 'conversion';
  if (href.includes('instagram')) return 'instagram';
  if (href.includes('eventbrite') || href.includes('ssboxoffice')) return 'tickets';
  return 'general';
};

document.querySelectorAll('a.btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    trackEvent('cta_click', {
      text: (btn.textContent || '').trim(),
      href: btn.getAttribute('href') || '',
      category: classifyButton(btn)
    });
    markLikelyHuman('cta_click');
  });
});

// Outbound link tracking
const isExternal = (href) => {
  try {
    const url = new URL(href, window.location.href);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
};

document.querySelectorAll('a[href]').forEach((link) => {
  const href = link.getAttribute('href') || '';
  if (!isExternal(href)) return;
  link.addEventListener('click', () => {
    trackEvent('outbound_click', {
      href,
      text: (link.textContent || '').trim()
    });
    markLikelyHuman('outbound_click');
  });
});

// Video engagement
const video = document.querySelector('.sneak-peek-video');
if (video) {
  video.addEventListener('play', () => {
    trackEvent('video_play', { video: 'lux_cabaret_preview' });
    markLikelyHuman('video_play');
  }, { once: true });
}

// Contact form submission feedback + form engagement
const form = document.querySelector('.contact-form');
if (form) {
  let formStarted = false;
  form.querySelectorAll('input, textarea, select').forEach((field) => {
    field.addEventListener('focus', () => {
      if (formStarted) return;
      formStarted = true;
      trackEvent('contact_form_start');
      markLikelyHuman('form_start');
    }, { once: true });
  });

  form.addEventListener('submit', async (e) => {
    const btn = form.querySelector('button[type="submit"]');
    const action = form.getAttribute('action') || '';
    if (action.includes('YOUR_FORM_ID') || !action.includes('@')) {
      e.preventDefault();
      btn.textContent = '⚠️ Form not configured yet';
      btn.style.background = '#c4607a';
      return;
    }
    trackEvent('contact_form_submit');
    markLikelyHuman('form_submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;
  });
}

// Time-on-page signal
window.setTimeout(() => {
  if (document.hidden) return;
  trackEvent('engaged_15_seconds');
  markLikelyHuman('engaged_15_seconds');
}, 15000);
