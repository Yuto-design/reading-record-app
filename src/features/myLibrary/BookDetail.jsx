import { useState, useEffect } from 'react';
import BookForm from './BookForm';
import { getBookStatus } from './BookStatusSidebar';
import './styles/BookDetail.css';

const STATUS_LABELS = {
  want: '読みたい',
  reading: '読んでいる',
  read: '読了',
};

function formatDateYMD(isoOrYMD) {
  const s = String(isoOrYMD).slice(0, 10);
  const [y, m, d] = s.split('-').map((n) => parseInt(n, 10));
  if (y == null || m == null || d == null) return s;
  return `${y}年${m}月${d}日`;
}

function BookDetail({ book, onSave, onClose, onDelete, initialEditMode = false }) {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [enlargedAttachment, setEnlargedAttachment] = useState(null);

  useEffect(() => {
    if (!enlargedAttachment) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setEnlargedAttachment(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enlargedAttachment]);

  if (!book) return null;

  const status = getBookStatus(book);
  const rating = (() => {
    const r = Number(book.rating);
    return (book.status === 'read' && r >= 1 && r <= 5) ? Math.round(r) : 0;
  })();

  const handleSave = (bookData) => {
    onSave(bookData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="book-detail card">
        <div className="book-detail-header">
          <h2 className="book-detail-title">本を編集</h2>
          <button
            type="button"
            className="book-detail-close"
            onClick={() => setIsEditing(false)}
            title="閉じる"
          >
            ×
          </button>
        </div>
        <BookForm book={book} onSave={handleSave} onCancel={() => setIsEditing(false)} />
        <div className="book-detail-footer">
          <button
            type="button"
            className="book-detail-edit book-detail-edit-secondary"
            onClick={() => setIsEditing(false)}
          >
            詳細に戻る
          </button>
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

      <div className="book-detail-body">
        {book.imageUrl && (
          <div className="book-detail-cover">
            <img src={book.imageUrl} alt="" className="book-detail-cover-img" />
          </div>
        )}
        <div className="book-detail-view-title-row">
          <h3 className="book-detail-view-title">{book.title || '（タイトルなし）'}</h3>
          <span className={`book-detail-view-status book-detail-view-status--${status}`}>
            {STATUS_LABELS[status]}
          </span>
          {Array.isArray(book.tags) && book.tags.length > 0 && (
            <div className="book-detail-view-tags">
              {book.tags.map((tag) => (
                <span key={tag} className="book-detail-view-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
        {book.author && (
          <p className="book-detail-view-author">{book.author}</p>
        )}
        {(book.publisher || book.pageCount != null) && (
          <p className="book-detail-view-publisher-isbn">
            {[book.publisher, book.pageCount != null ? `${book.pageCount}ページ` : null].filter(Boolean).join('　')}
          </p>
        )}
        {(book.status === 'read' && book.finishedAt) || (book.status === 'read' && rating > 0) ? (
          <p className="book-detail-view-meta">
            {book.status === 'read' && book.finishedAt && (
              <span className="book-detail-view-finished-at">
                読了日: {formatDateYMD(book.finishedAt)}
              </span>
            )}
            {book.status === 'read' && rating > 0 && (
              <span className="book-detail-view-rating" aria-label={`評価 ${rating}つ星`}>
                {[1, 2, 3, 4, 5].map((v) => (
                  <span key={v} className={rating >= v ? 'book-detail-star filled' : 'book-detail-star'}>
                    ★
                  </span>
                ))}
              </span>
            )}
          </p>
        ) : null}
        {book.summary && (
          <div className="book-detail-view-summary-wrap">
            <h4 className="book-detail-view-summary-label">概要</h4>
            <p className="book-detail-view-summary">{book.summary}</p>
          </div>
        )}
        {(book.memo || (Array.isArray(book.memoAttachments) && book.memoAttachments.length > 0)) && (
          <div className="book-detail-view-memo-wrap">
            <h4 className="book-detail-view-memo-label">読書メモ・感想</h4>
            {book.memo && <p className="book-detail-view-memo">{book.memo}</p>}
            {Array.isArray(book.memoAttachments) && book.memoAttachments.length > 0 && (
              <ul className="book-detail-view-memo-attachments">
                {book.memoAttachments.map((dataUrl, index) => (
                  <li key={index} className="book-detail-view-memo-attachment-item">
                    <button
                      type="button"
                      className="book-detail-view-memo-attachment-btn"
                      onClick={() => setEnlargedAttachment(dataUrl)}
                      aria-label="画像を大きく表示"
                    >
                      <img src={dataUrl} alt="" className="book-detail-view-memo-attachment-img" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {enlargedAttachment && (
        <div
          className="book-detail-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="画像を拡大表示"
          onClick={() => setEnlargedAttachment(null)}
        >
          <div className="book-detail-lightbox-backdrop" />
          <button
            type="button"
            className="book-detail-lightbox-close"
            onClick={() => setEnlargedAttachment(null)}
            aria-label="閉じる"
          >
            ×
          </button>
          <div
            className="book-detail-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={enlargedAttachment} alt="" className="book-detail-lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
}

export default BookDetail;
