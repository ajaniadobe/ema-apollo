import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function buildSectionHeader(row) {
  const cells = [...row.children];
  const header = document.createElement('div');
  header.className = 'cards-section-header';
  moveInstrumentation(row, header);

  const titleCell = cells[0];
  const linkCell = cells[1];

  if (titleCell) {
    const titleDiv = document.createElement('div');
    titleDiv.className = 'cards-section-title';
    while (titleCell.firstChild) titleDiv.append(titleCell.firstChild);
    header.append(titleDiv);
  }

  const linkEl = linkCell && linkCell.querySelector('a');
  if (linkEl) {
    linkEl.classList.add('cards-section-link');
    header.append(linkEl);
  }

  return header;
}

export default function decorate(block) {
  const rows = [...block.children];
  const fragment = document.createDocumentFragment();

  /* row with data-aue-model="cards-header" is the section header */
  const headerIdx = rows.findIndex((r) => r.getAttribute('data-aue-model') === 'cards-header');
  let cardRows = rows;
  if (headerIdx !== -1) {
    fragment.append(buildSectionHeader(rows[headerIdx]));
    cardRows = rows.filter((_, i) => i !== headerIdx);
  }

  const ul = document.createElement('ul');
  cardRows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  fragment.append(ul);
  block.replaceChildren(fragment);
}
