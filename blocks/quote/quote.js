export default function decorate(block) {
  const cells = [...block.children];
  const quoteRow = cells[0];
  const attrRow = cells[1];

  const blockquote = document.createElement('blockquote');

  if (quoteRow) {
    const quoteText = quoteRow.children[0];
    if (quoteText) {
      quoteText.className = 'quote-text';
      blockquote.append(quoteText);
    }
  }

  if (attrRow) {
    const cite = document.createElement('cite');
    cite.className = 'quote-attribution';
    const nameCell = attrRow.children[0];
    const imgCell = attrRow.children[1];

    if (imgCell?.querySelector('picture')) {
      const img = imgCell.querySelector('picture');
      img.className = 'quote-image';
      cite.prepend(img);
    }

    if (nameCell) {
      const nameDiv = document.createElement('div');
      nameDiv.className = 'quote-author';
      nameDiv.innerHTML = nameCell.innerHTML;
      cite.append(nameDiv);
    }

    blockquote.append(cite);
  }

  block.textContent = '';
  block.append(blockquote);
}
