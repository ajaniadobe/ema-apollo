import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const items = [...block.children];
  block.textContent = '';

  const dl = document.createElement('dl');
  dl.className = 'accordion-list';

  items.forEach((item) => {
    const cells = [...item.children];
    const title = cells[0]?.textContent.trim() || '';
    const body = cells[1] || document.createElement('div');

    const dt = document.createElement('dt');
    dt.className = 'accordion-title';

    const dd = document.createElement('dd');
    dd.className = 'accordion-body';
    dd.hidden = true;
    while (body.firstChild) dd.append(body.firstChild);

    const button = document.createElement('button');
    button.setAttribute('aria-expanded', 'false');
    button.textContent = title;
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      dd.hidden = expanded;
    });
    dt.append(button);
    moveInstrumentation(item, dt);

    dl.append(dt, dd);
  });

  block.append(dl);
}
