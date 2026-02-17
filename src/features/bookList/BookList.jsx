import './BookList.css';

function BookList({ books, onSelect, onDelete }) {
  if (books.length === 0) {
    return (
      <p className="book-list-empty">まだ本が登録されていません。上のフォームから追加してください。</p>
    );
  }

  return (
    <ul className="book-list">
      {books.map((book) => (
        <li key={book.id} className="book-list-item">
          <button
            type="button"
            className="book-list-item-content"
            onClick={() => onSelect(book)}
          >
            <div className="book-list-item-header">
              <span className="book-list-item-title">{book.title || '（タイトルなし）'}</span>
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
      ))}
    </ul>
  );
}

export default BookList;
