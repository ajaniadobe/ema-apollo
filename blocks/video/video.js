function loadVideo(wrapper, url) {
  wrapper.textContent = '';
  const iframe = document.createElement('iframe');
  iframe.className = 'video-iframe';
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'autoplay; encrypted-media');
  iframe.setAttribute('frameborder', '0');

  if (url.includes('youtube') || url.includes('youtu.be')) {
    const videoId = url.match(/(?:youtu\.be\/|v=)([^&?]+)/)?.[1];
    if (videoId) iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
  } else {
    iframe.src = url;
  }

  wrapper.append(iframe);
}

export default function decorate(block) {
  const rows = [...block.children];
  const firstRow = rows[0];
  if (!firstRow) return;

  const cells = [...firstRow.children];
  const linkCell = cells[0];
  const link = linkCell?.querySelector('a');
  const videoUrl = link?.href || linkCell?.textContent.trim();

  const posterCell = cells[1];
  const poster = posterCell?.querySelector('picture');

  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'video-wrapper';

  if (poster) {
    const posterDiv = document.createElement('div');
    posterDiv.className = 'video-poster';
    posterDiv.append(poster);

    const playBtn = document.createElement('button');
    playBtn.className = 'video-play-btn';
    playBtn.setAttribute('aria-label', 'Play video');
    playBtn.innerHTML = '<span class="icon icon-play"></span>';
    posterDiv.append(playBtn);

    playBtn.addEventListener('click', () => {
      loadVideo(wrapper, videoUrl);
    });

    wrapper.append(posterDiv);
  } else {
    loadVideo(wrapper, videoUrl);
  }

  block.append(wrapper);
}
