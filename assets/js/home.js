import { searchBooks } from './api.js';
import { renderStatus, clearStatus, renderBooks, toggleFavorite } from './ui.js';
import { isFavorite } from './storage.js';

const state = {
  query: '',
  page: 1, // 1-based
  pageSize: 20,
  totalItems: 0,
  lastBooks: [],
};

const dom = {
  form: document.getElementById('search-form'),
  input: document.getElementById('search-input'),
  status: document.getElementById('status'),
  grid: document.getElementById('books-grid'),
  pagination: document.getElementById('pagination'),
  prev: document.getElementById('prev-page'),
  next: document.getElementById('next-page'),
  pageIndicator: document.getElementById('page-indicator'),
};

function updatePager() {
  const totalPages = Math.max(1, Math.ceil(state.totalItems / state.pageSize));
  dom.pageIndicator.textContent = `Page ${state.page} of ${totalPages}`;
  dom.prev.disabled = state.page <= 1;
  dom.next.disabled = state.page >= totalPages;
}

async function fetchAndRender() {
  try {
    clearStatus(dom.status);
    renderStatus(dom.status, 'info', 'Loading books...');

    const startIndex = (state.page - 1) * state.pageSize;
    const { books, totalItems } = await searchBooks({
      query: state.query,
      startIndex,
      maxResults: state.pageSize,
    });
    state.totalItems = totalItems;
    state.lastBooks = books;

    renderBooks(dom.grid, books);
    updatePager();

    if (books.length === 0) {
      renderStatus(dom.status, 'neutral', 'No results. Try another search term.');
    } else {
      clearStatus(dom.status);
    }
  } catch (err) {
    renderStatus(dom.status, 'error', 'Failed to load books. Please try again.');
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

function handleFavToggle(e) {
  const id = e.detail && e.detail.id;
  if (!id) return;
  const book = state.lastBooks.find(b => b.id === id);
  if (!book) return;
  toggleFavorite(book);
  // re-render the grid quickly to reflect heart state
  renderBooks(dom.grid, state.lastBooks);
}

function handleFavoritesChanged() {
  // refresh icons based on updated favorites, preserving current books
  renderBooks(dom.grid, state.lastBooks);
}

function init() {
  // hydrate query from URL if present
  const params = new URLSearchParams(location.search);
  state.query = params.get('q') || '';
  if (state.query) dom.input.value = state.query;

  dom.form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.query = dom.input.value.trim();
    state.page = 1;
    const params = new URLSearchParams();
    if (state.query) params.set('q', state.query);
    history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
    fetchAndRender();
  });

  dom.prev.addEventListener('click', () => {
    if (state.page > 1) {
      state.page -= 1;
      fetchAndRender();
    }
  });

  dom.next.addEventListener('click', () => {
    state.page += 1;
    fetchAndRender();
  });

  dom.grid.addEventListener('ui:fav-toggle', handleFavToggle);
  window.addEventListener('favorites:changed', handleFavoritesChanged);

  fetchAndRender();
}

// initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
