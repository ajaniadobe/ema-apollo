import heroDecorate from '../hero/hero.js';

export default async function decorate(block) {
  block.classList.add('hero', 'carousel');
  return heroDecorate(block);
}
