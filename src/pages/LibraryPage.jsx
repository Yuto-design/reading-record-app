import { useState, useCallback } from 'react';
import { getBooks, saveBook, getBookById, deleteBook } from '../utils/storage';
import BookForm from '../features/bookList/BookForm';
import BookList from '../features/bookList/BookList';
import BookDetail from '../features/bookList/BookDetail';
import './LibraryPage.css';

function LibraryPage() {
  const [books, setBooks] = useState(getBooks());
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

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
          books={books}
          onSelect={(book) => setSelectedBookId(book.id)}
          onDelete={(id) => {
            if (window.confirm('この本を削除しますか？')) handleDeleteBook(id);
          }}
        />
      )}
    </div>
  );
}

export default LibraryPage;
