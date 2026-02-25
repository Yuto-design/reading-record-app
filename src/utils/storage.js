const SESSIONS_KEY = 'reading_sessions';
const BOOKS_KEY = 'reading_books';

/**
 * @typedef {Object} ReadingSession
 * @property {string} id
 * @property {string} date - YYYY-MM-DD
 * @property {number} minutes
 * @property {number} [startedAt] - timestamp
 * @property {number} [endedAt] - timestamp
 */

/**
 * @typedef {'want'|'reading'|'read'} BookStatus
 *  - want: 読みたい
 *  - reading: 読んでいる
 *  - read: 読了
 */

/**
 * @typedef {Object} Book
 * @property {string} id
 * @property {string} title
 * @property {string} author
 * @property {string} summary
 * @property {BookStatus} [status]
 * @property {string} [imageUrl] - 画像URL または Data URL
 * @property {number} [rating] - 評価 1〜5（0 は未設定）
 * @property {string[]} [tags] - タグ（ジャンル・テーマ）
 * @property {string} [createdAt] - ISO string
 * @property {string} [finishedAt] - 読了日 YYYY-MM-DD（読了時のみ）
 * @property {string} [memo] - 読書メモ・感想
 * @property {number} [pageCount] - ページ数
 * @property {string} [publisher] - 出版社
 */

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getJson(key, defaultValue = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getReadingSessions() {
  return getJson(SESSIONS_KEY);
}

export function setReadingSessions(sessions) {
  setJson(SESSIONS_KEY, sessions);
}

export function saveReadingSession(session) {
  const sessions = getReadingSessions();
  const isEdit = session.id && sessions.some((s) => s.id === session.id);
  const newSession = {
    id: session.id || generateId(),
    date: session.date,
    minutes: session.minutes,
    ...(session.startedAt != null && { startedAt: session.startedAt }),
    ...(session.endedAt != null && { endedAt: session.endedAt }),
  };
  if (isEdit) {
    const index = sessions.findIndex((s) => s.id === session.id);
    sessions[index] = { ...sessions[index], ...newSession };
  } else {
    sessions.push(newSession);
  }
  setJson(SESSIONS_KEY, sessions);
  return newSession;
}

export function getBooks() {
  return getJson(BOOKS_KEY);
}

export function getBookById(id) {
  return getBooks().find((b) => b.id === id) ?? null;
}

export function saveBook(book) {
  const books = getBooks();
  const isEdit = book.id && books.some((b) => b.id === book.id);
  const status = book.status === 'reading' || book.status === 'read' ? book.status : 'want';
  const ratingNum = Number(book.rating);
  const rating = (status === 'read' && ratingNum >= 1 && ratingNum <= 5) ? Math.round(ratingNum) : undefined;
  const tagsRaw = Array.isArray(book.tags) ? book.tags : [];
  const tags = tagsRaw.map((t) => String(t).trim()).filter(Boolean);

  const finishedAtRaw = book.finishedAt != null ? String(book.finishedAt).trim() : '';
  const finishedAt = (status === 'read' && finishedAtRaw) ? finishedAtRaw.slice(0, 10) : undefined;
  const memo = (book.memo != null && String(book.memo).trim()) ? String(book.memo).trim() : undefined;
  const pageNum = Number(book.pageCount);
  const pageCount = (Number.isInteger(pageNum) && pageNum > 0) ? pageNum : undefined;
  const publisher = (book.publisher != null && String(book.publisher).trim()) ? String(book.publisher).trim() : undefined;

  const newBook = {
    id: book.id || generateId(),
    title: book.title || '',
    author: book.author || '',
    summary: book.summary || '',
    status,
    imageUrl: (book.imageUrl != null && String(book.imageUrl).trim()) ? String(book.imageUrl).trim() : undefined,
    rating,
    ...(tags.length > 0 && { tags }),
    createdAt: book.createdAt || new Date().toISOString(),
    ...(finishedAt && { finishedAt }),
    ...(memo && { memo }),
    ...(pageCount != null && { pageCount }),
    ...(publisher && { publisher }),
  };
  if (isEdit) {
    const index = books.findIndex((b) => b.id === book.id);
    books[index] = { ...books[index], ...newBook };
  } else {
    books.push(newBook);
  }
  setJson(BOOKS_KEY, books);
  return newBook;
}

export function deleteBook(id) {
  const books = getBooks().filter((b) => b.id !== id);
  setJson(BOOKS_KEY, books);
}
