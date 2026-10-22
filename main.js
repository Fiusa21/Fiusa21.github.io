// Shows are crossed out when the site is built; this keeps that correct between builds.
const today = new Date().toLocaleDateString('sv'); // YYYY-MM-DD in local time
document.querySelectorAll('.tour-list li[data-date]').forEach((show) => {
  if (show.dataset.date < today) {
    show.classList.add('past');
  }
});
