const STORAGE_KEY = 'bookExplorer.favorites.v1';

export function getFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // dedupe by id
    const seen = new Set();
    const result = [];
    for (const item of parsed) {
      if (!item || typeof item !== 'object') continue;
      const id = item.id;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      result.push(item);
    }
    return result;
  } catch {
    return [];
  }
}

export function isFavorite(id) {
  return getFavorites().some(b => b.id === id);
}

export function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  window.dispatchEvent(new CustomEvent('favorites:changed', { detail: favorites }));
}

export function addFavorite(book) {
  const favorites = getFavorites();
  if (!book || !book.id) return favorites;
  if (favorites.some(b => b.id === book.id)) return favorites;
  const updated = [book, ...favorites];
  saveFavorites(updated);
  return updated;
}

export function removeFavorite(id) {
  const favorites = getFavorites();
  const updated = favorites.filter(b => b.id !== id);
  saveFavorites(updated);
  return updated;
}
