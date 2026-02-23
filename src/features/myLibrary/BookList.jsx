import './styles/BookList.css';

const STATUS_LABELS = {
  want: '読みたい',
  reading: '読んでいる',
  read: '読了',
};

function BookList({ books, onSelect, onDelete, emptyMessage }) {
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
        const status = book.status === 'reading' || book.status === 'read' ? book.status : 'want';
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
              <div className="book-list-item-header">
                <span className="book-list-item-title">{book.title || '（タイトルなし）'}</span>
                <span className={`book-list-item-status book-list-item-status--${status}`}>
                  {STATUS_LABELS[status]}
                </span>
                {book.author && (
                  <span className="book-list-item-author">{book.author}</span>
                )}
              </div>
            {book.summary && (
              <p className="book-list-item-summary">
                {book.summary.length > 120
                  ? `${book.summary.slice(0, 120)}...`
                  : book.summary}
              </p>
            )}
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
        </li>
        );
      })}
    </ul>
  );
}

export default BookList;
