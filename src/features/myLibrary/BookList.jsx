import { getBookStatus } from './BookStatusSidebar';
import { STATUS_LABELS } from './constants';
import './styles/BookList.css';

function BookList({ books, onSelect, onEdit, onDelete, emptyMessage }) {
  if (books.length === 0) {
    return (
      <p className="book-list-empty">
        {emptyMessage ?? 'まだ本が登録されていません。上のフォームから追加してください。'}
      </p>
    );
  }

  return (
    <ul className="book-list">
      {books.map((book) => {
        const status = getBookStatus(book);
        return (
          <li key={book.id} className="book-list-item">
            {book.imageUrl && (
              <div className="book-list-item-thumb">
                <img src={book.imageUrl} alt="" className="book-list-item-thumb-img" />
              </div>
            )}
            <button
              type="button"
              className="book-list-item-content"
              onClick={() => onSelect(book)}
            >
              <div className="book-list-item-body">
                <div className="book-list-item-header-row">
                  <div className="book-list-item-title-tags">
                    <h3 className="book-list-item-title">{book.title || '（タイトルなし）'}</h3>
                    {Array.isArray(book.tags) && book.tags.length > 0 && (
                      <div className="book-list-item-tags">
                        {book.tags.slice(0, 5).map((tag) => (
                          <span key={tag} className="book-list-item-tag">
                            {tag}
                          </span>
                        ))}
                        {book.tags.length > 5 && (
                          <span className="book-list-item-tag book-list-item-tag-more">
                            +{book.tags.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <span className={`book-list-item-status book-list-item-status--${status}`}>
                    {STATUS_LABELS[status]}
                  </span>
                </div>
                {book.author && (
                  <p className="book-list-item-author">{book.author}</p>
                )}
                {status === 'read' && (() => {
                  const r = Number(book.rating);
                  const rating = (r >= 1 && r <= 5) ? Math.round(r) : 0;
                  return rating > 0 ? (
                    <p className="book-list-item-rating" aria-label={`評価 ${rating}つ星`}>
                      {[1, 2, 3, 4, 5].map((v) => (
                        <span key={v} className={rating >= v ? 'book-list-item-star filled' : 'book-list-item-star'}>
                          ★
                        </span>
                      ))}
                    </p>
                  ) : null;
                })()}
              </div>
            </button>
          <div className="book-list-item-actions">
            <button
              type="button"
              className="book-list-item-edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(book);
              }}
              title="編集"
            >
              編集
            </button>
            <button
              type="button"
              className="book-list-item-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(book.id);
              }}
              title="削除"
            >
              削除
            </button>
          </div>
        </li>
        );
      })}
    </ul>
  );
}

export default BookList;
