export default function decorate(block) {
  const rows = [...block.children];

  const header = document.createElement('div');
  header.className = 'article-header-content';

  rows.forEach((row) => {
    const cells = [...row.children];
    const firstCell = cells[0];
    if (!firstCell) return;

    if (firstCell.querySelector('picture')) {
      firstCell.className = 'article-header-image';
      header.append(firstCell);
    } else {
      const text = firstCell.textContent.trim();
      if (text.length < 60 && !firstCell.querySelector('h1, h2, h3')) {
        firstCell.className = 'article-header-category';
        header.prepend(firstCell);
      } else if (firstCell.querySelector('h1, h2')) {
        firstCell.className = 'article-header-title';
        header.append(firstCell);
      } else {
        firstCell.className = 'article-header-meta';
        header.append(firstCell);
      }
    }
  });

  block.textContent = '';
  block.append(header);
}
