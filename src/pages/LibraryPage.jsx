import { useState, useCallback, useMemo } from 'react';
import { getBooks, saveBook, getBookById, deleteBook } from '../utils/storage';
import BookForm from '../features/bookList/BookForm';
import BookList from '../features/bookList/BookList';
import BookDetail from '../features/bookList/BookDetail';
import './LibraryPage.css';

const STATUS_FILTER_ALL = 'all';
const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'すべて', icon: 'fa-books' },
  { value: 'want', label: '読みたい', icon: 'fa-bookmark' },
  { value: 'reading', label: '読んでいる', icon: 'fa-book-open-reader' },
  { value: 'read', label: '読了', icon: 'fa-circle-check' },
];

function LibraryPage() {
  const [books, setBooks] = useState(getBooks());
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState(STATUS_FILTER_ALL);

  const refreshBooks = useCallback(() => {
    setBooks(getBooks());
  }, []);

  const filteredBooks = useMemo(() => {
    if (statusFilter === STATUS_FILTER_ALL) return books;
    return books.filter((book) => {
      const s = book.status === 'reading' || book.status === 'read' ? book.status : 'want';
      return s === statusFilter;
    });
  }, [books, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = { all: books.length, want: 0, reading: 0, read: 0 };
    books.forEach((book) => {
      const s = book.status === 'reading' || book.status === 'read' ? book.status : 'want';
      counts[s]++;
    });
    return counts;
  }, [books]);

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
      <h2 className="library-page-heading">My Library</h2>

      {!showAddForm && !selectedBook && (
        <>
          <div className="library-page-filters" role="tablist" aria-label="本のステータスでフィルタ">
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="tab"
                aria-selected={statusFilter === opt.value}
                aria-label={`${opt.label}（${statusCounts[opt.value]}件）`}
                className={`library-page-filter-btn library-page-filter-btn--${opt.value} ${statusFilter === opt.value ? 'active' : ''}`}
                onClick={() => setStatusFilter(opt.value)}
              >
                <span className="library-page-filter-icon" aria-hidden>
                  <i className={`fa-solid ${opt.icon}`} />
                </span>
                <span className="library-page-filter-label">{opt.label}</span>
                <span className="library-page-filter-count">{statusCounts[opt.value]}</span>
              </button>
            ))}
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
          books={filteredBooks}
          onSelect={(book) => setSelectedBookId(book.id)}
          onDelete={(id) => {
            if (window.confirm('この本を削除しますか？')) handleDeleteBook(id);
          }}
          emptyMessage={
            statusFilter !== STATUS_FILTER_ALL
              ? 'このステータスに該当する本はありません。'
              : undefined
          }
        />
      )}
    </div>
  );
}

export default LibraryPage;
