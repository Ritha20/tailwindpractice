import { isFavorite, addFavorite, removeFavorite } from './storage.js';

export function renderStatus(el, type, message) {
  if (!el) return;
  const base = 'rounded-md px-3 py-2 text-sm';
  const styles = type === 'error'
    ? 'bg-red-50 text-red-700 border border-red-200'
    : type === 'info'
      ? 'bg-blue-50 text-blue-700 border border-blue-200'
      : 'bg-gray-50 text-gray-700 border border-gray-200';
  el.className = `${base} ${styles}`;
  el.textContent = message;
  el.classList.remove('hidden');
}

export function clearStatus(el) {
  if (!el) return;
  el.textContent = '';
  el.classList.add('hidden');
}

export function renderBooks(gridEl, books) {
  if (!gridEl) return;
  gridEl.innerHTML = books.map(bookCardHtml).join('');
  attachFavoriteHandlers(gridEl);
}

function bookCardHtml(book) {
  const favorited = isFavorite(book.id);
  const heartClasses = favorited
    ? 'text-red-600 hover:text-red-700'
    : 'text-gray-400 hover:text-red-500';

  const cover = book.thumbnail
    ? `<img src="${book.thumbnail}" alt="${escapeHtml(book.title)} cover" class="book-cover w-full h-44 md:h-52 lg:h-56 rounded-md bg-gray-100" loading="lazy"/>`
    : `<div class="w-full h-44 md:h-52 lg:h-56 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">No cover</div>`;

  return `
  <article class="group rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition">
    <div class="relative">
      ${cover}
      <button aria-label="Toggle favorite" data-bookid="${book.id}" class="fav-btn absolute top-2 right-2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow hover:shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 ${heartClasses}">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.462 2.25 9A5.25 5.25 0 017.5 3.75c1.61 0 3.036.723 4.001 1.875A5.126 5.126 0 0115.75 3.75 5.25 5.25 0 0121 9c0 3.462-2.438 6.36-4.739 8.507a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.003-.003.001a.75.75 0 01-.666 0l-.003-.001z" />
        </svg>
      </button>
    </div>
    <div class="mt-3">
      <h3 class="text-sm font-semibold line-clamp-2">${escapeHtml(book.title)}</h3>
      <p class="text-xs text-gray-600 mt-1 line-clamp-1">${escapeHtml(book.authors)}</p>
      <div class="mt-2 flex items-center gap-2">
        ${book.infoLink ? `<a href="${book.infoLink}" target="_blank" rel="noopener noreferrer" class="text-xs text-blue-700 hover:underline">Details</a>` : ''}
      </div>
    </div>
  </article>`;
}

function attachFavoriteHandlers(scopeEl) {
  scopeEl.addEventListener('click', (e) => {
    const target = e.target;
    const button = target.closest && target.closest('button.fav-btn');
    if (!button) return;
    const bookId = button.getAttribute('data-bookid');
    if (!bookId) return;

    // the book data is not on element; we'll emit event and let the home page provide context
    const event = new CustomEvent('ui:fav-toggle', { detail: { id: bookId }, bubbles: true });
    button.dispatchEvent(event);
  });
}

export function toggleFavorite(book) {
  if (isFavorite(book.id)) {
    removeFavorite(book.id);
  } else {
    addFavorite(book);
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
