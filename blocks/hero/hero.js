function buildCarousel(block) {
  const slides = [...block.children];
  if (slides.length <= 1) return;

  // Lazy-load images in non-first slides to protect LCP
  slides.forEach((slide, i) => {
    if (i > 0) {
      slide.querySelectorAll('img').forEach((img) => {
        img.setAttribute('loading', 'lazy');
      });
    }
  });

  const carousel = document.createElement('div');
  carousel.className = 'hero-carousel';

  const track = document.createElement('div');
  track.className = 'hero-carousel-track';

  slides.forEach((slide, i) => {
    slide.classList.add('hero-slide');
    slide.setAttribute('aria-hidden', i > 0 ? 'true' : 'false');
    if (i > 0) slide.setAttribute('inert', '');
    track.append(slide);
  });

  carousel.append(track);

  const controls = document.createElement('div');
  controls.className = 'hero-carousel-controls';

  const tabs = document.createElement('div');
  tabs.className = 'hero-carousel-tabs';
  tabs.setAttribute('role', 'tablist');

  let currentSlide = 0;
  let autoplayInterval;
  let progressRaf = null;
  let progressStart = null;
  let progressValueEl = null; // set after pause button is built
  let slideInfoEl = null; // set after info bar is built

  const SLIDE_INTERVAL = 6000;
  const CIRCUMFERENCE = 2 * Math.PI * 18;

  function startProgress() {
    if (!progressValueEl) return;
    cancelAnimationFrame(progressRaf);
    progressStart = null;
    progressRaf = requestAnimationFrame(function tick(timestamp) {
      if (!progressStart) progressStart = timestamp;
      const elapsed = timestamp - progressStart;
      const progress = Math.min(elapsed / SLIDE_INTERVAL, 1);
      progressValueEl.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
      if (progress < 1) progressRaf = requestAnimationFrame(tick);
    });
  }

  function stopProgress() {
    if (!progressValueEl) return;
    cancelAnimationFrame(progressRaf);
    progressValueEl.style.strokeDashoffset = CIRCUMFERENCE;
  }

  function goToSlide(index) {
    slides[currentSlide].setAttribute('aria-hidden', 'true');
    slides[currentSlide].setAttribute('inert', '');
    tabs.children[currentSlide].setAttribute('aria-selected', 'false');
    currentSlide = index;
    slides[currentSlide].setAttribute('aria-hidden', 'false');
    slides[currentSlide].removeAttribute('inert');
    tabs.children[currentSlide].setAttribute('aria-selected', 'true');
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    startProgress();
    if (slideInfoEl) {
      const cta = slideInfoEl.querySelector('.hero-carousel-info-cta');
      const ctaLink = slides[currentSlide].querySelector('.hero-content a');
      if (cta && ctaLink) {
        cta.href = ctaLink.href;
        cta.textContent = ctaLink.textContent;
      }
    }
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      goToSlide((currentSlide + 1) % slides.length);
    }, SLIDE_INTERVAL);
    startProgress();
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
    stopProgress();
  }

  // Extract label from first heading in each slide's content area
  slides.forEach((slide, i) => {
    const heading = slide.querySelector('h1, h2, h3');
    const topicSpan = heading && heading.querySelector('.hero-heading-topic');
    let label;
    if (topicSpan) {
      [label] = topicSpan.textContent.trim().split(/\s+/);
    } else if (heading) {
      [label] = heading.textContent.replace(/think\s*/i, '').trim().split(/\s+/);
    } else {
      label = `${i + 1}`;
    }

    const tab = document.createElement('button');
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    tab.setAttribute('aria-label', `Go to ${label} slide`);
    tab.textContent = label;
    tab.addEventListener('click', () => {
      stopAutoplay();
      goToSlide(i);
      startAutoplay();
    });
    tabs.append(tab);
  });
  controls.append(tabs);

  // Slide info bar: current slide CTA
  const info = document.createElement('div');
  info.className = 'hero-carousel-info';
  const firstCtaLink = slides[0].querySelector('.hero-content a');
  if (firstCtaLink) {
    const ctaLink = document.createElement('a');
    ctaLink.className = 'hero-carousel-info-cta';
    ctaLink.href = firstCtaLink.href;
    ctaLink.textContent = firstCtaLink.textContent;
    info.append(ctaLink);
  }
  slideInfoEl = info;
  controls.append(info);

  const nav = document.createElement('div');
  nav.className = 'hero-carousel-nav';

  const prev = document.createElement('button');
  prev.className = 'hero-carousel-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  prev.innerHTML = '&#8592;';
  prev.addEventListener('click', () => {
    stopAutoplay();
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
    startAutoplay();
  });

  const next = document.createElement('button');
  next.className = 'hero-carousel-next';
  next.setAttribute('aria-label', 'Next slide');
  next.innerHTML = '&#8594;';
  next.addEventListener('click', () => {
    stopAutoplay();
    goToSlide((currentSlide + 1) % slides.length);
    startAutoplay();
  });

  // Pause/play toggle with circular progress ring
  const pauseBtn = document.createElement('button');
  pauseBtn.className = 'hero-carousel-pause';
  pauseBtn.setAttribute('aria-label', 'Pause autoplay');
  pauseBtn.setAttribute('aria-pressed', 'true');
  pauseBtn.innerHTML = `
    <svg class="hero-carousel-progress-ring" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <circle class="hero-carousel-progress-track" cx="20" cy="20" r="18"/>
      <circle class="hero-carousel-progress-value" cx="20" cy="20" r="18"
        stroke-dasharray="${CIRCUMFERENCE}"
        stroke-dashoffset="${CIRCUMFERENCE}"/>
    </svg>
    <span class="hero-carousel-pause-icon" aria-hidden="true">
      <svg class="icon-pause" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
        <rect x="1" y="0" width="3" height="10" fill="white"/>
        <rect x="6" y="0" width="3" height="10" fill="white"/>
      </svg>
      <svg class="icon-play" xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12">
        <path d="M0 12V0L10 6L0 12Z" fill="white"/>
      </svg>
    </span>`;

  progressValueEl = pauseBtn.querySelector('.hero-carousel-progress-value');

  let isPlaying = true;

  pauseBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopAutoplay();
      isPlaying = false;
      pauseBtn.setAttribute('aria-label', 'Resume autoplay');
      pauseBtn.setAttribute('aria-pressed', 'false');
      pauseBtn.classList.add('is-paused');
    } else {
      startAutoplay();
      isPlaying = true;
      pauseBtn.setAttribute('aria-label', 'Pause autoplay');
      pauseBtn.setAttribute('aria-pressed', 'true');
      pauseBtn.classList.remove('is-paused');
    }
  });

  nav.append(prev, pauseBtn, next);
  controls.append(nav);
  carousel.append(controls);

  carousel.addEventListener('mouseenter', () => { if (isPlaying) stopAutoplay(); });
  carousel.addEventListener('mouseleave', () => { if (isPlaying) startAutoplay(); });
  startAutoplay();

  block.textContent = '';
  block.append(carousel);
}

export default function decorate(block) {
  const isCarousel = block.classList.contains('carousel');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 4) {
      // New model: image | heading (text) | description (richtext) | link (richtext)
      cells[0].classList.add('hero-image');
      const content = document.createElement('div');
      content.className = 'hero-content';
      const h2 = document.createElement('h2');
      h2.textContent = cells[1].textContent.trim();
      content.append(h2);
      while (cells[2].firstChild) content.append(cells[2].firstChild);
      while (cells[3].firstChild) content.append(cells[3].firstChild);
      cells[3].remove();
      cells[2].remove();
      cells[1].replaceWith(content);
    } else if (cells.length >= 2) {
      cells[0].classList.add('hero-image');
      cells[1].classList.add('hero-content');
    } else if (cells.length === 1) {
      const cell = cells[0];
      if (cell.querySelector('picture')) {
        cell.classList.add('hero-image');
      } else {
        cell.classList.add('hero-content');
      }
    }

    // Transform "Think Topic New" heading into inline spans with distinct treatments
    const contentCell = row.querySelector('.hero-content');
    if (contentCell) {
      const heading = contentCell.querySelector('h1, h2, h3');
      if (heading) {
        const words = heading.textContent.trim().split(/\s+/);
        if (words.length >= 3 && words[0].toLowerCase() === 'think') {
          const topic = words.slice(1, -1).join(' ');
          const last = words[words.length - 1].toUpperCase();
          heading.innerHTML = `<span class="hero-heading-think">THINK</span> <span class="hero-heading-topic">${topic}</span> <span class="hero-heading-new">${last}</span>`;
        }
      }
    }
  });

  if (isCarousel) {
    buildCarousel(block);
  }
}
