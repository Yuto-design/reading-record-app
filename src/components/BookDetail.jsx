import BookForm from './BookForm';
import './BookDetail.css';

function BookDetail({ book, onSave, onClose, onDelete }) {
  if (!book) return null;

  return (
    <div className="book-detail card">
      <div className="book-detail-header">
        <h2 className="book-detail-title">本の詳細</h2>
        <button
          type="button"
          className="book-detail-close"
          onClick={onClose}
          title="閉じる"
        >
          ×
        </button>
      </div>
      <BookForm book={book} onSave={onSave} onCancel={onClose} />
      <div className="book-detail-footer">
        <button
          type="button"
          className="book-detail-delete"
          onClick={() => {
            if (window.confirm('この本を削除しますか？')) {
              onDelete(book.id);
              onClose();
            }
          }}
        >
          削除する
        </button>
      </div>
    </div>
  );
}

export default BookDetail;
