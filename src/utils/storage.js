const SESSIONS_KEY = 'reading_sessions';
const BOOKS_KEY = 'reading_books';
const SETTINGS_KEY = 'reading_settings';

/** 目標のデフォルト値 */
const DEFAULT_GOALS = {
  dailyGoalMinutes: 30,
  weeklyGoalMinutes: 30 * 7,
  monthlyGoalMinutes: 30 * 30,
  yearlyGoalMinutes: 30 * 365,
  bookGoalCount: 50,
};

/**
 * @typedef {Object} ReadingSession
 * @property {string} id
 * @property {string} date - YYYY-MM-DD
 * @property {number} minutes
 * @property {string} [bookId] - 紐付けた本のID（任意）
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
 * @property {string[]} [memoAttachments] - 読書メモに添付した画像の Data URL 配列
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
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      throw new Error(
        '保存容量を超えました。読書メモの添付画像を減らすか、小さな画像をご利用ください。'
      );
    }
    throw e;
  }
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
    ...(session.bookId != null && String(session.bookId).trim() && { bookId: String(session.bookId).trim() }),
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
  const memoAttachmentsRaw = Array.isArray(book.memoAttachments) ? book.memoAttachments : [];
  const memoAttachments = memoAttachmentsRaw
    .filter((url) => typeof url === 'string' && url.startsWith('data:image/'))
    .slice(0, 10);
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
    memoAttachments,
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

/**
 * 設定（目標など）を取得する。未設定の項目は DEFAULT_GOALS で補う。
 * @returns {{ dailyGoalMinutes: number, weeklyGoalMinutes: number, monthlyGoalMinutes: number, yearlyGoalMinutes: number, bookGoalCount: number }}
 */
export function getSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_GOALS };
    const parsed = JSON.parse(raw);
    return {
      dailyGoalMinutes: Number(parsed.dailyGoalMinutes) || DEFAULT_GOALS.dailyGoalMinutes,
      weeklyGoalMinutes: Number(parsed.weeklyGoalMinutes) || DEFAULT_GOALS.weeklyGoalMinutes,
      monthlyGoalMinutes: Number(parsed.monthlyGoalMinutes) || DEFAULT_GOALS.monthlyGoalMinutes,
      yearlyGoalMinutes: Number(parsed.yearlyGoalMinutes) || DEFAULT_GOALS.yearlyGoalMinutes,
      bookGoalCount: Number(parsed.bookGoalCount) || DEFAULT_GOALS.bookGoalCount,
    };
  } catch {
    return { ...DEFAULT_GOALS };
  }
}

/**
 * 設定を保存する。
 * @param {Partial<{ dailyGoalMinutes: number, weeklyGoalMinutes: number, monthlyGoalMinutes: number, yearlyGoalMinutes: number, bookGoalCount: number }>} settings
 */
export function setSettings(settings) {
  const current = getSettings();
  const next = { ...current, ...settings };
  setJson(SETTINGS_KEY, next);
}

/**
 * 全データをエクスポート用のオブジェクトで返す。
 * @returns {{ version: string, exportedAt: string, sessions: ReadingSession[], books: Book[], settings: object }}
 */
export function exportData() {
  return {
    version: '1',
    exportedAt: new Date().toISOString(),
    sessions: getReadingSessions(),
    books: getBooks(),
    settings: getSettings(),
  };
}

/**
 * インポート用データを適用する。
 * @param {object} data - exportData() の形式
 * @param {'replace'|'merge'} mode - replace: 上書き / merge: 既存にマージ
 */
export function importData(data, mode = 'replace') {
  if (!data || typeof data !== 'object') throw new Error('無効なデータです。');
  const sessions = Array.isArray(data.sessions) ? data.sessions : [];
  const books = Array.isArray(data.books) ? data.books : [];
  const settings = data.settings && typeof data.settings === 'object' ? data.settings : null;

  if (mode === 'replace') {
    setJson(SESSIONS_KEY, sessions);
    setJson(BOOKS_KEY, books);
  } else {
    const existingSessions = getReadingSessions();
    const existingBooks = getBooks();
    const mergedSessions = [...existingSessions];
    const existingIds = new Set(existingSessions.map((s) => s.id));
    sessions.forEach((s) => {
      if (!existingIds.has(s.id)) {
        mergedSessions.push(s);
        existingIds.add(s.id);
      }
    });
    const bookIds = new Set(existingBooks.map((b) => b.id));
    const mergedBooks = [...existingBooks];
    books.forEach((b) => {
      if (!bookIds.has(b.id)) {
        mergedBooks.push(b);
        bookIds.add(b.id);
      }
    });
    setJson(SESSIONS_KEY, mergedSessions);
    setJson(BOOKS_KEY, mergedBooks);
  }

  if (settings && typeof settings === 'object') {
    setSettings(settings);
  }
}
