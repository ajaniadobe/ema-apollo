export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  // Handle CAPI two-row layout (image row + content row) alongside
  // document-based one-row two-cell layout
  let cells;
  if (rows.length >= 2 && rows[0].children.length === 1 && rows[1].children.length === 1) {
    cells = [...rows].map((row) => row.firstElementChild);
    rows[0].append(cells[1]);
    rows.slice(1).forEach((row) => row.remove());
  } else {
    cells = [...rows[0].children];
  }

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
