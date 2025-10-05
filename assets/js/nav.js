document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const links = Array.from(document.querySelectorAll('.nav-link'));
  if (links.length === 0) return;

  const path = window.location.pathname;
  const isHome = path.endsWith('/') || path.endsWith('/index.html') || path === '';
  const isFavorites = path.endsWith('/favorites.html');
  const isAbout = path.endsWith('/about.html');

  for (const link of links) {
    const href = link.getAttribute('href') || '';
    let active = false;
    if (isHome && (href === 'index.html' || href === './' || href === './index.html')) active = true;
    if (isFavorites && href === 'favorites.html') active = true;
    if (isAbout && href === 'about.html') active = true;

    if (active) {
      link.setAttribute('aria-current', 'page');
    }
  }
});
