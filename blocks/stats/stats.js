export default function decorate(block) {
  const items = [...block.children];

  const grid = document.createElement('div');
  grid.className = 'stats-grid';

  items.forEach((item) => {
    const cells = [...item.children];
    const stat = document.createElement('div');
    stat.className = 'stats-item';

    const valueEl = cells[0];
    const descEl = cells[1];

    if (valueEl) {
      valueEl.className = 'stats-value';
      stat.append(valueEl);
    }
    if (descEl) {
      descEl.className = 'stats-description';
      stat.append(descEl);
    }

    grid.append(stat);
  });

  block.textContent = '';
  block.append(grid);
}
