export default function decorate(block) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);

  const shareLinks = [
    { name: 'LinkedIn', icon: 'linkedin', href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
    { name: 'X', icon: 'x-twitter', href: `https://x.com/intent/post?url=${url}` },
  ];

  const wrapper = document.createElement('div');
  wrapper.className = 'share-wrapper';

  const label = document.createElement('span');
  label.className = 'share-label';
  label.textContent = 'Share';
  wrapper.append(label);

  const links = document.createElement('div');
  links.className = 'share-links';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'share-copy';
  copyBtn.setAttribute('aria-label', 'Copy link');
  copyBtn.innerHTML = '<span class="icon icon-share-link"></span>';
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href);
    copyBtn.classList.add('copied');
    setTimeout(() => copyBtn.classList.remove('copied'), 2000);
  });
  links.append(copyBtn);

  const emailLink = document.createElement('a');
  emailLink.href = `mailto:?subject=${title}&body=${url}`;
  emailLink.setAttribute('aria-label', 'Share via email');
  emailLink.innerHTML = '<span class="icon icon-share-email"></span>';
  links.append(emailLink);

  shareLinks.forEach(({ name, icon, href }) => {
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', `Share on ${name}`);
    a.innerHTML = `<span class="icon icon-${icon}"></span>`;
    links.append(a);
  });

  wrapper.append(links);
  block.textContent = '';
  block.append(wrapper);
}
