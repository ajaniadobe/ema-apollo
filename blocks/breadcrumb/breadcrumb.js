export default function decorate(block) {
  const items = [...block.children];
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');
  ol.className = 'breadcrumb-list';

  items.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';

    const link = item.querySelector('a');
    if (link && i < items.length - 1) {
      li.append(link);
    } else {
      const span = document.createElement('span');
      span.setAttribute('aria-current', 'page');
      span.textContent = item.textContent.trim();
      li.append(span);
    }

    ol.append(li);
  });

  nav.append(ol);
  block.textContent = '';
  block.append(nav);
}
