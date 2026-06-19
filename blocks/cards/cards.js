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

  /* header row is the last row whose first cell has an h2/h3 and no picture */
  const isHeaderRow = (r) => {
    const model = r.getAttribute('data-aue-model');
    if (model) return model === 'cards' || model === 'cards-header';
    const c1 = r.children[0];
    return c1 && c1.querySelector('h2,h3') && !c1.querySelector('picture');
  };
  let headerIdx = -1;
  for (let i = rows.length - 1; i >= 0; i -= 1) {
    if (isHeaderRow(rows[i])) { headerIdx = i; break; }
  }
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
