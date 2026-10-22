// Shows are crossed out when the site is built; this keeps that correct between builds.
const today = new Date().toLocaleDateString('sv'); // YYYY-MM-DD in local time
const shows = document.querySelectorAll('.tour-list li[data-date]');
shows.forEach((show) => {
  if (show.dataset.date < today) {
    show.classList.add('past');
  }
});

// Same for the "Next show" line in the hero: point it at the first show that hasn't happened yet.
const nextShow = document.querySelector('.next-show');
if (nextShow) {
  const upcoming = [...shows].find((show) => !show.classList.contains('past'));
  if (upcoming) {
    const day = upcoming.querySelector('.tour-day').textContent;
    const month = upcoming.querySelector('.tour-month').textContent;
    const name = upcoming.querySelector('.tour-name').textContent;
    nextShow.querySelector('.next-show-text').textContent = `${month} ${day} · ${name}`;
  } else {
    nextShow.hidden = true;
  }
}

// Merch: tap / click a shirt to flip between front and back (hover does this on desktop).
document.querySelectorAll('button.merch-photo').forEach((photo) => {
  const name = photo.querySelector('.merch-front').alt.replace(/ shirt, front$/, '');
  photo.addEventListener('click', () => {
    const showBack = photo.getAttribute('aria-pressed') !== 'true';
    photo.setAttribute('aria-pressed', showBack);
    photo.setAttribute('aria-label', `${name}: show ${showBack ? 'front' : 'back'}`);
  });
});

// Solid navbar once the hero is scrolled past.
const navbar = document.querySelector('.navbar');
new IntersectionObserver(([hero]) => {
  navbar.classList.toggle('scrolled', !hero.isIntersecting);
}, { rootMargin: '-80px 0px 0px 0px' }).observe(document.querySelector('.hero'));

// Underline the menu entry of the section currently on screen.
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.hash === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id], footer[id]').forEach((section) => sectionObserver.observe(section));
