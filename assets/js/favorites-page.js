import { getFavorites, removeFavorite } from './storage.js';

const grid = document.getElementById('favorites-grid');
const statusEl = document.getElementById('status');

function render() {
  const favorites = getFavorites();
  if (!favorites.length) {
    statusEl.className = 'rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-700 border border-gray-200';
    statusEl.textContent = 'No favorites yet. Browse and add some from Home.';
    grid.innerHTML = '';
    return;
  }
  statusEl.textContent = '';
  statusEl.className = '';
  grid.innerHTML = favorites.map(book => `
    <article class="group rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition">
      <div class="relative">
        ${book.thumbnail ? `<img src="${book.thumbnail}" alt="${escapeHtml(book.title)} cover" class="book-cover w-full h-44 md:h-52 lg:h-56 rounded-md bg-gray-100" loading="lazy"/>`
          : `<div class='w-full h-44 md:h-52 lg:h-56 rounded-md bg-gray-100 flex items-center justify-center text-gray-400'>No cover</div>`}
        <button data-id="${book.id}" class="remove-btn absolute top-2 right-2 inline-flex items-center justify-center px-2.5 py-1.5 text-xs rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100">
          Remove
        </button>
      </div>
      <div class="mt-3">
        <h3 class="text-sm font-semibold line-clamp-2">${escapeHtml(book.title)}</h3>
        <p class="text-xs text-gray-600 mt-1 line-clamp-1">${escapeHtml(book.authors)}</p>
        ${book.infoLink ? `<a class="text-xs text-blue-700 hover:underline mt-2 inline-block" href="${book.infoLink}" target="_blank" rel="noopener noreferrer">Details</a>` : ''}
      </div>
    </article>
  `).join('');
}

function escapeHtml(str) {
  return String(str || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function onRemoveClick(e) {
  const btn = e.target.closest && e.target.closest('button.remove-btn');
  if (!btn) return;
  const id = btn.getAttribute('data-id');
  removeFavorite(id);
  render();
}

function init() {
  render();
  grid.addEventListener('click', onRemoveClick);
  window.addEventListener('favorites:changed', render);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
