import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const items = [...block.children];
  const list = document.createElement('ul');
  list.className = 'news-list-items';

  items.forEach((item) => {
    const cells = [...item.children];
    const li = document.createElement('li');
    li.className = 'news-list-item';
    moveInstrumentation(item, li);

    const category = cells[0];
    const title = cells[1];
    const link = cells[2];

    if (category) {
      category.className = 'news-list-category';
      li.append(category);
    }
    if (title) {
      title.className = 'news-list-title';
      li.append(title);
    }
    if (link) {
      link.className = 'news-list-link';
      li.append(link);
    }

    list.append(li);
  });

  block.textContent = '';
  block.append(list);
}
