import teaserDecorate from '../teaser/teaser.js';

export default function decorate(block) {
  block.classList.add('teaser', 'text-links');
  teaserDecorate(block);
}
