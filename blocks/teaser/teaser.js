export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  // Handle CAPI two-row layout (image row + content row) alongside
  // document-based one-row two-cell layout
  let cells;
  if (rows.length >= 2 && rows[0].children.length === 1 && rows[1].children.length === 1) {
    cells = [...rows].map((row) => row.firstElementChild);
    rows[0].prepend(cells[1]);
    rows.slice(1).forEach((row) => row.remove());
  } else {
    cells = [...rows[0].children];
  }

  cells.forEach((cell) => {
    if (cell.querySelector('picture')) {
      cell.classList.add('teaser-image');
    } else {
      cell.classList.add('teaser-content');
      const paras = [...cell.querySelectorAll('p')];
      const eyebrow = paras.find((p) => !p.querySelector('a') && p.textContent.length < 50);
      if (eyebrow) eyebrow.classList.add('teaser-eyebrow');

      // Wrap all CTA link paragraphs into a single .teaser-ctas div
      const ctaParas = paras.filter((p) => p.querySelector('a') && p.closest('.teaser-content'));
      if (ctaParas.length > 0) {
        const ctaWrapper = document.createElement('div');
        ctaWrapper.className = 'teaser-ctas';
        ctaParas.forEach((p) => {
          const a = p.querySelector('a');
          if (a) ctaWrapper.append(a);
          p.remove();
        });
        cell.append(ctaWrapper);
      }
    }
  });
}
