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

  function goToSlide(index) {
    slides[currentSlide].setAttribute('aria-hidden', 'true');
    tabs.children[currentSlide].setAttribute('aria-selected', 'false');
    currentSlide = index;
    slides[currentSlide].setAttribute('aria-hidden', 'false');
    tabs.children[currentSlide].setAttribute('aria-selected', 'true');
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      goToSlide((currentSlide + 1) % slides.length);
    }, 6000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // Extract label from first heading in each slide's content area
  slides.forEach((slide, i) => {
    const heading = slide.querySelector('h1, h2, h3');
    const label = heading
      ? heading.textContent.replace(/think\s*/i, '').trim().split(/\s+/)[0]
      : `${i + 1}`;

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

  nav.append(prev, next);
  controls.append(nav);
  carousel.append(controls);

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  startAutoplay();

  block.textContent = '';
  block.append(carousel);
}

export default function decorate(block) {
  const isCarousel = block.classList.contains('carousel');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
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
  });

  if (isCarousel) {
    buildCarousel(block);
  }
}
