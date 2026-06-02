import { moveInstrumentation } from '../../scripts/scripts.js';

function buildCarousel(block) {
  const slides = [...block.children];
  if (slides.length <= 1) return;

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

  const dots = document.createElement('div');
  dots.className = 'hero-carousel-dots';
  dots.setAttribute('role', 'tablist');

  let currentSlide = 0;
  let autoplayInterval;

  function goToSlide(index) {
    slides[currentSlide].setAttribute('aria-hidden', 'true');
    dots.children[currentSlide].setAttribute('aria-selected', 'false');
    currentSlide = index;
    slides[currentSlide].setAttribute('aria-hidden', 'false');
    dots.children[currentSlide].setAttribute('aria-selected', 'true');
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

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dots.append(dot);
  });
  controls.append(dots);

  const nav = document.createElement('div');
  nav.className = 'hero-carousel-nav';

  const prev = document.createElement('button');
  prev.className = 'hero-carousel-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  prev.innerHTML = '<span class="icon icon-arrow-left"></span>';
  prev.addEventListener('click', () => goToSlide((currentSlide - 1 + slides.length) % slides.length));

  const next = document.createElement('button');
  next.className = 'hero-carousel-next';
  next.setAttribute('aria-label', 'Next slide');
  next.innerHTML = '<span class="icon icon-arrow-right"></span>';
  next.addEventListener('click', () => goToSlide((currentSlide + 1) % slides.length));

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
    moveInstrumentation(row, row);
  });

  if (isCarousel) {
    buildCarousel(block);
  }
}
