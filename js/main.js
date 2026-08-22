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
  if (!lb || !lb.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') changeLightbox(1);
  if (e.key === 'ArrowLeft') changeLightbox(-1);
});

const lightboxEl = document.getElementById('lightbox');
if (lightboxEl) {
  lightboxEl.addEventListener('click', (e) => {
    if (e.target === lightboxEl) closeLightbox();
  });
}

/* ===== TESTIMONIALS SLIDER ===== */
function initTestimonials() {
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('tDots');
  const nextBtn = document.getElementById('tNext');
  const prevBtn = document.getElementById('tPrev');
  if (!track || !dotsContainer) return;
  const cards = track.querySelectorAll('.testimonial-card');
  if (cards.length === 0) return;
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

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

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
  [initAOS, initCounters, initTestimonials, initGalleryLoop].forEach(init => {
    try { init(); } catch (err) { console.error(init.name + ' failed:', err); }
  });
});

/* ===== GALLERY — SEAMLESS GSAP LOOP ===== */
function initGalleryLoop() {
  const container = document.querySelector('.gallery-loop-container');
  const list = document.querySelector('.cards');
  const cards = Array.from(document.querySelectorAll('.cards .card'));
  const prevBtn = document.querySelector('.gallery-action-btn.prev');
  const nextBtn = document.querySelector('.gallery-action-btn.next');

  if (!container || !list || cards.length === 0) return;

  // Open the lightbox when a card is clicked (unless the user was dragging)
  let suppressClick = false;
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (suppressClick) return;
      openLightbox(i);
    });
  });

  // --- Fallback when GSAP failed to load: plain horizontal scroller ---
  if (typeof gsap === 'undefined') {
    container.classList.add('no-gsap');
    const step = () => (cards[0].offsetWidth + 20);
    if (nextBtn) nextBtn.addEventListener('click', () => list.scrollBy({ left: -step(), behavior: 'smooth' }));
    if (prevBtn) prevBtn.addEventListener('click', () => list.scrollBy({ left: step(), behavior: 'smooth' }));
    return;
  }

  const spacing = 0.1;                          // time between two consecutive cards
  const snap = gsap.utils.snap(spacing);
  const seamlessLoop = buildSeamlessLoop(cards, spacing);

  // Start far from 0 so scrubbing backwards never runs out of timeline.
  const offset = seamlessLoop.duration() * 100;
  let playhead = snap(offset);
  seamlessLoop.totalTime(playhead);

  const scrub = gsap.to(seamlessLoop, {
    totalTime: playhead,
    duration: 0.55,
    ease: 'power3',
    paused: true,
    onUpdate: refreshCardStates,
    onComplete: refreshCardStates
  });

  function scrubTo(totalTime) {
    playhead = Math.max(spacing, totalTime);
    scrub.vars.totalTime = playhead;
    scrub.invalidate().restart();
  }

  function goNext() { scrubTo(playhead + spacing); }
  function goPrev() { scrubTo(playhead - spacing); }

  // Highlight the card closest to the centre, and only let visible cards be clicked
  function refreshCardStates() {
    let front = null;
    let frontScale = 0;
    cards.forEach(card => {
      const scale = Number(gsap.getProperty(card, 'scale')) || 0;
      const opacity = Number(gsap.getProperty(card, 'opacity')) || 0;
      card.style.pointerEvents = opacity > 0.35 ? 'auto' : 'none';
      if (scale > frontScale) { frontScale = scale; front = card; }
    });
    cards.forEach(card => card.classList.toggle('is-active', card === front && frontScale > 0.8));
  }

  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); goNext(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); goPrev(); });

  // Horizontal trackpad / shift+wheel only — vertical wheel keeps scrolling the page
  let wheelLock = false;
  container.addEventListener('wheel', (e) => {
    const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.2;
    if (!horizontal && !e.shiftKey) return;
    const delta = horizontal ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 12) return;
    e.preventDefault();
    if (wheelLock) return;
    wheelLock = true;
    delta > 0 ? goNext() : goPrev();
    setTimeout(() => { wheelLock = false; }, 240);
  }, { passive: false });

  // Touch swipe — drag the loop with the finger
  let touchStartX = 0;
  let touchStartPlayhead = 0;
  const dragRatio = () => spacing / Math.max(120, cards[0].offsetWidth * 0.55);

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartPlayhead = playhead;
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    const dx = touchStartX - e.touches[0].clientX;
    scrubTo(touchStartPlayhead + dx * dragRatio());
  }, { passive: true });

  container.addEventListener('touchend', () => scrubTo(snap(playhead)));

  // Mouse drag
  let isDragging = false;
  let dragStartX = 0;
  let dragStartPlayhead = 0;

  container.addEventListener('mousedown', (e) => {
    if (e.target.closest('.gallery-action-btn')) return;
    isDragging = true;
    suppressClick = false;
    dragStartX = e.clientX;
    dragStartPlayhead = playhead;
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = dragStartX - e.clientX;
    if (Math.abs(dx) > 6) suppressClick = true;
    scrubTo(dragStartPlayhead + dx * dragRatio());
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    scrubTo(snap(playhead));
    setTimeout(() => { suppressClick = false; }, 0);
  });

  // Keyboard, only while the gallery is on screen and the lightbox is closed
  window.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (lb && lb.classList.contains('active')) return;
    const rect = container.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    if (e.key === 'ArrowLeft') { e.preventDefault(); goNext(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); goPrev(); }
  });

  refreshCardStates();

  /* Builds an infinitely repeating timeline in which every card flies across the
     screen, growing as it reaches the centre and shrinking as it leaves.
     Adapted from the GSAP seamless-loop technique. */
  function buildSeamlessLoop(items, spacing) {
    const overlap = Math.ceil(1 / spacing);                 // extra copies on both ends
    const startTime = items.length * spacing + 0.5;         // where the seamless loop starts
    const loopTime = (items.length + overlap) * spacing + 1; // where it wraps back
    const rawSequence = gsap.timeline({ paused: true });
    const loop = gsap.timeline({
      paused: true,
      repeat: -1,
      onRepeat() { this._time === this._dur && (this._tTime += this._dur - 0.01); }
    });
    const l = items.length + overlap * 2;

    gsap.set(items, { xPercent: 300, opacity: 0, scale: 0 });

    for (let i = 0; i < l; i++) {
      const item = items[i % items.length];
      const time = i * spacing;
      rawSequence
        .fromTo(item,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1, zIndex: 100,
            duration: 0.5, yoyo: true, repeat: 1,
            ease: 'power1.in', immediateRender: false
          }, time)
        .fromTo(item,
          { xPercent: 300 },
          { xPercent: -300, duration: 1, ease: 'none', immediateRender: false },
          time);
    }

    rawSequence.time(startTime);
    loop
      .to(rawSequence, { time: loopTime, duration: loopTime - startTime, ease: 'none' })
      .fromTo(rawSequence,
        { time: overlap * spacing + 1 },
        {
          time: startTime,
          duration: startTime - (overlap * spacing + 1),
          immediateRender: false,
          ease: 'none'
        });
    return loop;
  }
}
