// Click-to-load for third-party embeds: no request goes to YouTube/Spotify until the visitor clicks.
document.querySelectorAll('.embed').forEach((embed) => {
  embed.querySelector('.embed-button').addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = embed.dataset.src;
    iframe.title = embed.dataset.title;
    iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    embed.replaceChildren(iframe);
    embed.classList.add('embed-loaded');
  });
});
