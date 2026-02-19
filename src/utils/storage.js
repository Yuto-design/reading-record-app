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
 * @typedef {Object} Book
 * @property {string} id
 * @property {string} title
 * @property {string} author
 * @property {string} summary
 * @property {string} [createdAt] - ISO string
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

export function updateReadingSession(session) {
  const sessions = getReadingSessions();
  const index = sessions.findIndex((s) => s.id === session.id);
  if (index === -1) return null;
  sessions[index] = { ...sessions[index], ...session };
  setJson(SESSIONS_KEY, sessions);
  return sessions[index];
}

export function deleteReadingSession(id) {
  const sessions = getReadingSessions().filter((s) => s.id !== id);
  setJson(SESSIONS_KEY, sessions);
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
  const newBook = {
    id: book.id || generateId(),
    title: book.title || '',
    author: book.author || '',
    summary: book.summary || '',
    createdAt: book.createdAt || new Date().toISOString(),
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
