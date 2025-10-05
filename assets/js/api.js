const GOOGLE_BOOKS_ENDPOINT = 'https://www.googleapis.com/books/v1/volumes';

export async function searchBooks({ query, startIndex = 0, maxResults = 20 }) {
  const params = new URLSearchParams();
  params.set('q', query && query.trim() ? query.trim() : 'subject:fiction');
  params.set('startIndex', String(startIndex));
  params.set('maxResults', String(maxResults));
  // Order can be relevance by default; you could add more params
  const url = `${GOOGLE_BOOKS_ENDPOINT}?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  const data = await res.json();
  const totalItems = typeof data.totalItems === 'number' ? data.totalItems : 0;
  const items = Array.isArray(data.items) ? data.items : [];

  const books = items.map(item => normalizeBook(item));
  return { books, totalItems };
}

export function normalizeBook(item) {
  const id = item.id;
  const info = item.volumeInfo || {};
  const title = info.title || 'Untitled';
  const authors = Array.isArray(info.authors) ? info.authors.join(', ') : 'Unknown author';
  const thumbnail = (info.imageLinks && (info.imageLinks.thumbnail || info.imageLinks.smallThumbnail)) || '';
  const description = info.description || '';
  const publishedDate = info.publishedDate || '';
  const infoLink = info.infoLink || '';
  return { id, title, authors, thumbnail, description, publishedDate, infoLink };
}
