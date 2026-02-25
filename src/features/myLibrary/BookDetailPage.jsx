import { getBookById } from '../../utils/storage';
import BookDetail from './BookDetail';

function BookDetailPage({
  bookId,
  onSave,
  onClose,
  onDelete,
  initialEditMode = false,
}) {
  const book = bookId ? getBookById(bookId) : null;

  if (!book) return null;

  return (
    <BookDetail
      book={book}
      onSave={onSave}
      onClose={onClose}
      onDelete={onDelete}
      initialEditMode={initialEditMode}
    />
  );
}

export default BookDetailPage;
