import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const items = [...block.children];
  if (items.length < 1) return;

  const track = document.createElement('div');
  track.className = 'carousel-track';

  items.forEach((item) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    moveInstrumentation(item, slide);
    while (item.firstElementChild) slide.append(item.firstElementChild);

    slide.querySelectorAll('picture > img').forEach((img) => {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
    });

    track.append(slide);
  });

  const nav = document.createElement('div');
  nav.className = 'carousel-nav';

  const prev = document.createElement('button');
  prev.className = 'carousel-prev';
  prev.setAttribute('aria-label', 'Previous');
  prev.innerHTML = '<span class="icon icon-arrow-left"></span>';

  const counter = document.createElement('span');
  counter.className = 'carousel-counter';

  const next = document.createElement('button');
  next.className = 'carousel-next';
  next.setAttribute('aria-label', 'Next');
  next.innerHTML = '<span class="icon icon-arrow-right"></span>';

  nav.append(prev, counter, next);

  block.textContent = '';
  block.append(track, nav);

  let currentPage = 0;

  function getItemsPerPage() {
    if (window.innerWidth >= 1200) return 4;
    if (window.innerWidth >= 900) return 3;
    if (window.innerWidth >= 600) return 2;
    return 1;
  }

  function getPageCount() {
    return Math.ceil(items.length / getItemsPerPage());
  }

  function update() {
    const perPage = getItemsPerPage();
    const offset = currentPage * perPage;
    const slideWidth = 100 / perPage;
    track.style.transform = `translateX(-${offset * slideWidth}%)`;
    counter.textContent = `${currentPage + 1} / ${getPageCount()}`;
    prev.disabled = currentPage === 0;
    next.disabled = currentPage >= getPageCount() - 1;
  }

  prev.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage -= 1;
      update();
    }
  });

  next.addEventListener('click', () => {
    if (currentPage < getPageCount() - 1) {
      currentPage += 1;
      update();
    }
  });

  window.addEventListener('resize', () => {
    currentPage = Math.min(currentPage, getPageCount() - 1);
    update();
  });

  update();
}
