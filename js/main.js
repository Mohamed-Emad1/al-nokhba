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
  { src: 'assets/images/shockwave-therapy.jpeg', label: 'العلاج بموجات الصدمة' },
  { src: 'assets/images/low-level-laser-therapy.jpeg', label: 'العلاج بالليزر منخفض الشدة' },
  { src: 'assets/images/ultrasound-therapy.jpeg', label: 'العلاج بالموجات فوق الصوتية' },
  { src: 'assets/images/heat-pads.jpeg', label: 'وسائد التدفئة' },
  { src: 'assets/images/traction-therapy.jpeg', label: 'علاج الشد' },
  { src: 'assets/images/massage-gun.jpeg', label: 'مسدس التدليك' },
  { src: 'assets/images/tens-therapy.jpeg', label: 'جهاز التنس' },
  { src: 'assets/images/cryotherapy.jpeg', label: 'العلاج بالتبريد' },
  { src: 'assets/images/cavitation.jpeg', label: 'الكافيتيشن' },
  { src: 'assets/images/sports-rehab-unit-1.jpeg', label: 'وحدة تأهيل رياضي متكاملة' },
  { src: 'assets/images/sports-rehab-unit-2.jpeg', label: 'وحدة تأهيل رياضي متكاملة' },
  { src: 'assets/images/cupping-therapy.jpeg', label: 'جلسات الحجامة والريكفري' },
  { src: 'assets/images/office_1.jpeg', label: 'عيادتنا' },
  { src: 'assets/images/office_2.jpeg', label: 'عيادتنا' },
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

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جارٍ الإرسال...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> تم الإرسال!';
    btn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
    success.classList.add('show');
    form.reset();

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال طلب الحجز';
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

/* ===== VIDEO PROMO ===== */
function playVideo() {
  const video = document.getElementById('promoVideo');
  const overlay = document.getElementById('videoOverlay');
  if (!video) return;
  overlay.classList.add('hidden');
  video.controls = true;
  video.muted = true;
  video.play();
}

// Restore overlay if video ends
document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('promoVideo');
  if (video) {
    video.addEventListener('ended', () => {
      const overlay = document.getElementById('videoOverlay');
      overlay.classList.remove('hidden');
      video.controls = false;
      video.currentTime = 0;
    });
  }
});

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initCounters();
  initTestimonials();
  initGalleryLoop();
});

/* ===== 3D GALLERY CAROUSEL ===== */
function initGalleryLoop() {
  const container = document.querySelector('.gallery-loop-container');
  const cards = Array.from(document.querySelectorAll('.cards .card'));
  const prevBtn = document.querySelector('.gallery-action-btn.prev');
  const nextBtn = document.querySelector('.gallery-action-btn.next');

  if (!container || cards.length === 0) return;

  const total = cards.length;
  let currentIndex = 0;
  let animState = { index: 0 };
  let isDragging = false;
  let startX = 0;
  let dragDistance = 0;

  function updateCards(val) {
    const isMobile = window.innerWidth <= 640;
    const isTablet = window.innerWidth <= 1024;
    const spacingX = isMobile ? 130 : isTablet ? 180 : 240;

    cards.forEach((card, i) => {
      let diff = (i - val) % total;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      const absDiff = Math.abs(diff);

      if (absDiff > 3.2) {
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
        card.style.transform = `translate3d(${diff > 0 ? 500 : -500}px, -50%, -300px) scale(0.5)`;
        card.style.zIndex = '0';
        return;
      }

      const x = diff * spacingX;
      const z = -absDiff * 80;
      const rotateY = diff * -10;
      const scale = Math.max(0.6, 1 - absDiff * 0.14);
      const opacity = Math.max(0, 1 - absDiff * 0.25);
      const zIndex = Math.round(100 - absDiff * 20);

      card.style.opacity = opacity;
      card.style.zIndex = zIndex;
      card.style.pointerEvents = 'auto';
      card.style.transform = `translate3d(calc(-50% + ${x}px), -50%, ${z}px) rotateY(${rotateY}deg) scale(${scale})`;

      if (absDiff < 0.4) {
        card.classList.add('is-active');
      } else {
        card.classList.remove('is-active');
      }
    });
  }

  function goTo(targetIndex, duration = 0.55) {
    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf(animState);
      gsap.to(animState, {
        index: targetIndex,
        duration: duration,
        ease: 'power2.out',
        onUpdate: () => updateCards(animState.index),
        onComplete: () => {
          currentIndex = ((Math.round(targetIndex) % total) + total) % total;
          animState.index = currentIndex;
          updateCards(currentIndex);
        }
      });
    } else {
      currentIndex = ((Math.round(targetIndex) % total) + total) % total;
      animState.index = currentIndex;
      updateCards(currentIndex);
    }
  }

  function goNext() {
    goTo(animState.index + 1);
  }

  function goPrev() {
    goTo(animState.index - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      goNext();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      goPrev();
    });
  }

  // Click on card: center opens lightbox, side card flies to center
  cards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      let diff = (i - currentIndex) % total;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      if (Math.abs(diff) < 0.4) {
        openLightbox(i);
      } else {
        e.preventDefault();
        e.stopPropagation();
        goTo(currentIndex + diff);
      }
    });
  });

  // Mouse wheel
  let wheelLock = false;
  container.addEventListener('wheel', (e) => {
    const delta = e.deltaY || e.deltaX;
    if (Math.abs(delta) > 15) {
      e.preventDefault();
      if (!wheelLock) {
        if (delta > 0) goNext();
        else goPrev();
        wheelLock = true;
        setTimeout(() => { wheelLock = false; }, 260);
      }
    }
  }, { passive: false });

  // Touch Swipe
  let touchStartX = 0;
  let touchStartTime = 0;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartTime = Date.now();
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    const time = Date.now() - touchStartTime;
    if (Math.abs(diff) > 30 && time < 600) {
      if (diff > 0) goNext();
      else goPrev();
    }
  }, { passive: true });

  // Mouse Drag
  container.addEventListener('mousedown', (e) => {
    if (e.target.closest('.gallery-action-btn')) return;
    isDragging = true;
    startX = e.clientX;
    dragDistance = 0;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    dragDistance = startX - e.clientX;
  });

  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    if (Math.abs(dragDistance) > 35) {
      if (dragDistance > 0) goNext();
      else goPrev();
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    const rect = container.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!isVisible) return;

    if (e.key === 'ArrowLeft' || e.key === 'PageDown') {
      e.preventDefault();
      goNext();
    } else if (e.key === 'ArrowRight' || e.key === 'PageUp') {
      e.preventDefault();
      goPrev();
    }
  });

  window.addEventListener('resize', () => {
    updateCards(animState.index);
  });

  // Initial draw
  updateCards(0);
}
