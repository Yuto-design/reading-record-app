import { useState, useCallback } from 'react';
import { getBooks, saveBook, getBookById, deleteBook } from '../utils/storage';
import BookForm from '../features/myLibrary/BookForm';
import BookList from '../features/myLibrary/BookList';
import BookDetail from '../features/myLibrary/BookDetail';
import BookStatusSidebar, {
  useBookStatusFilter,
  STATUS_FILTER_ALL,
} from '../features/myLibrary/BookStatusSidebar';
import './LibraryPage.css';

function LibraryPage() {
  const [books, setBooks] = useState(getBooks());
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { statusFilter, setStatusFilter, filteredBooks } = useBookStatusFilter(books);

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
          <button
            type="button"
            className="library-page-add-btn"
            onClick={() => setShowAddForm(true)}
          >
            本を追加
          </button>
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
      </main>
    </div>
  );
}

export default LibraryPage;
