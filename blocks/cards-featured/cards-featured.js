import cardsDecorate from '../cards/cards.js';

export default function decorate(block) {
  block.classList.add('cards', 'featured');
  cardsDecorate(block);
}
