import { useState, useCallback, useMemo } from 'react';
import { getBooks, saveBook, getBookById, deleteBook } from '../utils/storage';
import BookForm from '../features/myLibrary/BookForm';
import BookList from '../features/myLibrary/BookList';
import BookDetail from '../features/myLibrary/BookDetail';
import BookStatusSidebar, {
  useBookStatusFilter,
  STATUS_FILTER_ALL,
} from '../features/myLibrary/BookStatusSidebar';
import {
  useLibrarySearchFilter,
  LibrarySearchToolbar,
} from '../features/home/LibrarySearchFilter';
import './LibraryPage.css';

function LibraryPage() {
  const [books, setBooks] = useState(getBooks());
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const { statusFilter, setStatusFilter, filteredBooks } = useBookStatusFilter(books);

  const allTags = useMemo(() => {
    const set = new Set();
    books.forEach((book) => {
      (book.tags || []).forEach((tag) => set.add(tag));
    });
    return [...set].sort((a, b) => a.localeCompare(b, 'ja'));
  }, [books]);

  const filteredByTags = useMemo(() => {
    if (selectedTags.length === 0) return filteredBooks;
    return filteredBooks.filter((book) =>
      (book.tags || []).some((tag) => selectedTags.includes(tag))
    );
  }, [filteredBooks, selectedTags]);

  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    searchFilteredBooks,
    sortedBooks,
  } = useLibrarySearchFilter(filteredByTags);

  const handleToggleTag = useCallback((tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

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
        allTags={allTags}
        selectedTags={selectedTags}
        onToggleTag={handleToggleTag}
      />

      <main className="library-page-main">
        <h2 className="library-page-heading">My Library</h2>

        {!showAddForm && !selectedBook && (
          <>
            <LibrarySearchToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
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
              selectedTags.length > 0 && filteredByTags.length === 0
                ? '選択したタグに該当する本はありません。'
                : searchFilteredBooks.length === 0 && filteredByTags.length > 0
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
