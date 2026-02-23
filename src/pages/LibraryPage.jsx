import { useState, useCallback, useMemo } from 'react';
import { getBooks, saveBook, getBookById, deleteBook } from '../utils/storage';
import BookForm from '../features/myLibrary/BookForm';
import BookList from '../features/myLibrary/BookList';
import BookDetail from '../features/myLibrary/BookDetail';
import BookStatusSidebar, {
  useBookStatusFilter,
  STATUS_FILTER_ALL,
} from '../features/myLibrary/BookStatusSidebar';
import './LibraryPage.css';

const SORT_OPTIONS = [
  { value: 'title', label: 'タイトル順' },
  { value: 'author', label: '著者順' },
  { value: 'createdAtDesc', label: '登録日（新しい順）' },
  { value: 'createdAtAsc', label: '登録日（古い順）' },
];

function LibraryPage() {
  const [books, setBooks] = useState(getBooks());
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');

  const { statusFilter, setStatusFilter, filteredBooks } = useBookStatusFilter(books);

  const searchFilteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return filteredBooks;
    return filteredBooks.filter((book) => {
      const title = (book.title || '').toLowerCase();
      const author = (book.author || '').toLowerCase();
      const summary = (book.summary || '').toLowerCase();
      return title.includes(q) || author.includes(q) || summary.includes(q);
    });
  }, [filteredBooks, searchQuery]);

  const sortedBooks = useMemo(() => {
    const list = [...searchFilteredBooks];
    switch (sortBy) {
      case 'title':
        list.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'ja'));
        break;
      case 'author':
        list.sort((a, b) => (a.author || '').localeCompare(b.author || '', 'ja'));
        break;
      case 'createdAtDesc':
        list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        break;
      case 'createdAtAsc':
        list.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
        break;
      default:
        break;
    }
    return list;
  }, [searchFilteredBooks, sortBy]);

  const refreshBooks = useCallback(() => {
    setBooks(getBooks());
  }, []);

  const handleSaveBook = (bookData) => {
    saveBook(bookData);
    refreshBooks();
    setShowAddForm(false);
    setSelectedBookId(null);
  };

  const handleDeleteBook = (id) => {
    deleteBook(id);
    refreshBooks();
    setSelectedBookId(null);
  };

  const selectedBook = selectedBookId ? getBookById(selectedBookId) : null;

  return (
    <div className="library-page">
      <BookStatusSidebar
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        books={books}
      />

      <main className="library-page-main">
        <h2 className="library-page-heading">My Library</h2>

        {!showAddForm && !selectedBook && (
          <>
            <div className="library-page-toolbar">
              <div className="library-page-search-wrap">
                <span className="library-page-search-icon" aria-hidden>
                  <i className="fa-solid fa-magnifying-glass" />
                </span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="タイトル・著者・概要で検索"
                  className="library-page-search-input"
                  aria-label="本を検索"
                />
              </div>
              <div className="library-page-sort-wrap">
                <label htmlFor="library-sort" className="library-page-sort-label">
                  並び替え
                </label>
                <select
                  id="library-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="library-page-sort-select"
                  aria-label="並び替え"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              className="library-page-add-btn"
              onClick={() => setShowAddForm(true)}
            >
              本を追加
            </button>
          </>
        )}

        {showAddForm && !selectedBook && (
          <BookForm
            onSave={handleSaveBook}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {selectedBook && (
          <BookDetail
            book={selectedBook}
            onSave={handleSaveBook}
            onClose={() => setSelectedBookId(null)}
            onDelete={handleDeleteBook}
          />
        )}

        {!selectedBook && (
          <BookList
            books={sortedBooks}
            onSelect={(book) => setSelectedBookId(book.id)}
            onDelete={(id) => {
              if (window.confirm('この本を削除しますか？')) handleDeleteBook(id);
            }}
            emptyMessage={
              searchFilteredBooks.length === 0 && filteredBooks.length > 0
                ? '検索条件に該当する本はありません。'
                : statusFilter !== STATUS_FILTER_ALL
                  ? 'このステータスに該当する本はありません。'
                  : undefined
            }
          />
        )}
      </main>
    </div>
  );
}

export default LibraryPage;
