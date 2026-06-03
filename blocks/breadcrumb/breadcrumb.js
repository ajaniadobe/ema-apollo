export default function decorate(block) {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');
  ol.className = 'breadcrumb-list';

  const homeLi = document.createElement('li');
  homeLi.className = 'breadcrumb-item';
  const homeLink = document.createElement('a');
  homeLink.href = '/';
  homeLink.textContent = 'Home';
  homeLi.append(homeLink);
  ol.append(homeLi);

  let currentPath = '';
  segments.forEach((segment, i) => {
    currentPath += `/${segment}`;
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';

    const label = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    if (i === segments.length - 1) {
      const span = document.createElement('span');
      span.setAttribute('aria-current', 'page');
      span.textContent = document.title.split('|')[0].trim() || label;
      li.append(span);
    } else {
      const a = document.createElement('a');
      a.href = currentPath;
      a.textContent = label;
      li.append(a);
    }

    ol.append(li);
  });

  nav.append(ol);
  block.textContent = '';
  block.append(nav);
}
