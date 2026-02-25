import { useState, useCallback, useMemo } from 'react';
import { getBooks, saveBook, deleteBook } from '../utils/storage';
import BookForm from '../features/myLibrary/BookForm';
import BookList from '../features/myLibrary/BookList';
import BookDetailPage from '../features/myLibrary/BookDetailPage';
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
  const [openInEditMode, setOpenInEditMode] = useState(false);
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

  const handleSaveNewBook = (bookData) => {
    try {
      saveBook(bookData);
      refreshBooks();
      setShowAddForm(false);
      setSelectedBookId(null);
    } catch (err) {
      alert(err.message || '保存に失敗しました。');
    }
  };

  const handleUpdateBook = (bookData) => {
    try {
      saveBook(bookData);
      refreshBooks();
    } catch (err) {
      alert(err.message || '保存に失敗しました。');
    }
  };

  const handleDeleteBook = (id) => {
    deleteBook(id);
    refreshBooks();
    setSelectedBookId(null);
  };

  const showingDetail = !!selectedBookId;

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

        {!showAddForm && !showingDetail && (
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

        {showAddForm && !showingDetail && (
          <BookForm
            onSave={handleSaveNewBook}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {showingDetail && (
          <BookDetailPage
            bookId={selectedBookId}
            onSave={handleUpdateBook}
            onClose={() => {
              setSelectedBookId(null);
              setOpenInEditMode(false);
            }}
            onDelete={handleDeleteBook}
            initialEditMode={openInEditMode}
          />
        )}

        {!showingDetail && (
          <BookList
            books={sortedBooks}
            onSelect={(book) => {
              setSelectedBookId(book.id);
              setOpenInEditMode(false);
            }}
            onEdit={(book) => {
              setSelectedBookId(book.id);
              setOpenInEditMode(true);
            }}
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
