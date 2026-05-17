/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const mobileOverlay = document.getElementById('mobileOverlay');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', open);
  mobileOverlay.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileOverlay.addEventListener('click', closeMobileMenu);

function closeMobileMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('active');
  mobileOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Close mobile menu on nav link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
});

/* ===== SCROLL TO TOP ===== */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===== AOS (Animate On Scroll) — lightweight custom impl ===== */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.aosDelay || 0);
        setTimeout(() => el.classList.add('aos-animate'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el, target) {
  const duration = 2000;
  const start = performance.now();
  const update = (time) => {
    const elapsed = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (elapsed < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

/* ===== LIGHTBOX ===== */
const galleryImages = [
  { src: 'assets/images/device_1.jpeg', label: 'Advanced Therapy Equipment' },
  { src: 'assets/images/device_2.jpeg', label: 'Rehabilitation Session' },
  { src: 'assets/images/device_3.jpeg', label: 'Ultrasound Therapy Unit' },
  { src: 'assets/images/device_4.jpeg', label: 'Sports Rehab Station' },
  { src: 'assets/images/device_5.jpeg', label: 'Post-Surgery Recovery' },
  { src: 'assets/images/device_6.jpeg', label: 'Pain Management Device' },
  { src: 'assets/images/device_7.jpeg', label: 'Muscle Stimulation Unit' },
  { src: 'assets/images/device_8.jpeg', label: 'Manual Therapy Tools' },
  { src: 'assets/images/device_9.jpeg', label: 'Dry Needling Setup' },
];
let currentLightboxIndex = 0;

function openLightbox(index) {
  currentLightboxIndex = index;
  document.getElementById('lightboxImg').src = galleryImages[index].src;
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function changeLightbox(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + galleryImages.length) % galleryImages.length;
  const img = document.getElementById('lightboxImg');
  img.style.opacity = '0';
  setTimeout(() => {
    img.src = galleryImages[currentLightboxIndex].src;
    img.style.opacity = '1';
  }, 150);
}

document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') changeLightbox(1);
  if (e.key === 'ArrowLeft') changeLightbox(-1);
});

document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
});

/* ===== TESTIMONIALS SLIDER ===== */
function initTestimonials() {
  const track = document.getElementById('testimonialsTrack');
  const cards = track.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('tDots');
  const total = cards.length;
  let perView = getPerView();
  let current = 0;
  let autoInterval;

  function getPerView() {
    return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
  }

  function maxIndex() {
    return Math.max(0, total - getPerView());
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 't-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(index) {
    perView = getPerView();
    current = Math.min(Math.max(0, index), maxIndex());
    const cardWidth = cards[0].offsetWidth + 28;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    document.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current >= maxIndex() ? 0 : current + 1); }
  function prev() { goTo(current <= 0 ? maxIndex() : current - 1); }

  document.getElementById('tNext').addEventListener('click', () => { next(); resetAuto(); });
  document.getElementById('tPrev').addEventListener('click', () => { prev(); resetAuto(); });

  function startAuto() { autoInterval = setInterval(next, 5000); }
  function resetAuto() { clearInterval(autoInterval); startAuto(); }

  window.addEventListener('resize', () => {
    perView = getPerView();
    buildDots();
    goTo(0);
  });

  buildDots();
  goTo(0);
  startAuto();
}

/* ===== CONTACT FORM ===== */
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Request Sent!';
    btn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
    success.classList.add('show');
    form.reset();

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Appointment Request';
      btn.style.background = '';
      btn.disabled = false;
      success.classList.remove('show');
    }, 5000);
  }, 1500);
}

/* ===== SMOOTH SCROLL for anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initCounters();
  initTestimonials();
});
