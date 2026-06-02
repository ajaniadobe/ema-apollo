import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const items = [...block.children];
  if (items.length < 1) return;

  const track = document.createElement('div');
  track.className = 'people-carousel-track';

  items.forEach((item) => {
    const cells = [...item.children];
    const card = document.createElement('div');
    card.className = 'people-card';
    moveInstrumentation(item, card);

    const imageCell = cells[0];
    const nameCell = cells[1];
    const titleCell = cells[2];

    if (imageCell) {
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'people-card-image';
      const pic = imageCell.querySelector('picture');
      if (pic) {
        const img = pic.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '300' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imgWrapper.append(optimizedPic);
        }
      }
      card.append(imgWrapper);
    }

    const info = document.createElement('div');
    info.className = 'people-card-info';

    if (nameCell) {
      const name = document.createElement('p');
      name.className = 'people-card-name';
      name.textContent = nameCell.textContent.trim();
      info.append(name);
    }

    if (titleCell) {
      const title = document.createElement('p');
      title.className = 'people-card-title';
      title.textContent = titleCell.textContent.trim();
      info.append(title);
    }

    card.append(info);
    track.append(card);
  });

  const nav = document.createElement('div');
  nav.className = 'people-carousel-nav';

  const prev = document.createElement('button');
  prev.className = 'people-carousel-prev';
  prev.setAttribute('aria-label', 'Previous');
  prev.innerHTML = '<span class="icon icon-arrow-left"></span>';

  const counter = document.createElement('span');
  counter.className = 'people-carousel-counter';

  const next = document.createElement('button');
  next.className = 'people-carousel-next';
  next.setAttribute('aria-label', 'Next');
  next.innerHTML = '<span class="icon icon-arrow-right"></span>';

  nav.append(prev, counter, next);

  block.textContent = '';
  block.append(track, nav);

  let currentPage = 0;

  function getPerPage() {
    if (window.innerWidth >= 1200) return 4;
    if (window.innerWidth >= 900) return 3;
    if (window.innerWidth >= 600) return 2;
    return 1;
  }

  function getPageCount() {
    return Math.ceil(items.length / getPerPage());
  }

  function update() {
    const perPage = getPerPage();
    const offset = currentPage * perPage;
    const slideWidth = 100 / perPage;
    track.style.transform = `translateX(-${offset * slideWidth}%)`;
    counter.textContent = `${currentPage + 1} / ${getPageCount()}`;
    prev.disabled = currentPage === 0;
    next.disabled = currentPage >= getPageCount() - 1;
  }

  prev.addEventListener('click', () => {
    if (currentPage > 0) { currentPage -= 1; update(); }
  });

  next.addEventListener('click', () => {
    if (currentPage < getPageCount() - 1) { currentPage += 1; update(); }
  });

  window.addEventListener('resize', () => {
    currentPage = Math.min(currentPage, getPageCount() - 1);
    update();
  });

  update();
}
