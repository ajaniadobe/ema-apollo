export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  const row = rows[0];
  const cells = [...row.children];

  cells.forEach((cell) => {
    if (cell.querySelector('picture')) {
      cell.classList.add('teaser-image');
    } else {
      cell.classList.add('teaser-content');
      const eyebrow = cell.querySelector('p:first-child');
      if (eyebrow && !eyebrow.querySelector('a') && eyebrow.textContent.length < 50) {
        eyebrow.classList.add('teaser-eyebrow');
      }
    }
  });
}
