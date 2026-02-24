import { useState, useEffect } from 'react';
import './styles/BookForm.css';

const STATUS_OPTIONS = [
  { value: 'want', label: '読みたい' },
  { value: 'reading', label: '読んでいる' },
  { value: 'read', label: '読了' },
];

function BookForm({ book = null, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [summary, setSummary] = useState('');
  const [status, setStatus] = useState('want');
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState(0);
  const [tagsText, setTagsText] = useState('');

  useEffect(() => {
    if (book) {
      setTitle(book.title || '');
      setAuthor(book.author || '');
      setSummary(book.summary || '');
      setStatus(book.status === 'reading' || book.status === 'read' ? book.status : 'want');
      setImageUrl(book.imageUrl || '');
      const r = Number(book.rating);
      setRating((r >= 1 && r <= 5) ? Math.round(r) : 0);
      setTagsText(Array.isArray(book.tags) ? book.tags.join(', ') : '');
    } else {
      setTitle('');
      setAuthor('');
      setSummary('');
      setStatus('want');
      setImageUrl('');
      setRating(0);
      setTagsText('');
    }
  }, [book]);

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tags = tagsText.split(/[,、]/).map((t) => t.trim()).filter(Boolean);
    onSave({
      ...(book && { id: book.id, createdAt: book.createdAt }),
      title: title.trim(),
      author: author.trim(),
      summary: summary.trim(),
      status,
      ...(imageUrl.trim() && { imageUrl: imageUrl.trim() }),
      ...(status === 'read' && rating >= 1 && rating <= 5 && { rating }),
      ...(tags.length > 0 && { tags }),
    });
  };

  return (
    <form className="book-form card" onSubmit={handleSubmit}>
      <h2 className="book-form-title">{book ? '本を編集' : '本を追加'}</h2>
      <div className="book-form-field">
        <label htmlFor="book-title">タイトル</label>
        <input
          id="book-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="本のタイトル"
          required
        />
      </div>
      <div className="book-form-field">
        <label htmlFor="book-author">著者</label>
        <input
          id="book-author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="著者名"
        />
      </div>
      <div className="book-form-field">
        <label htmlFor="book-image">表紙画像</label>
        <div className="book-form-image-row">
          <input
            id="book-image"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="画像URL または下でファイルを選択"
            className="book-form-input"
          />
          <label className="book-form-file-label">
            <span className="book-form-file-btn">ファイルを選択</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFile}
              className="book-form-file-input"
            />
          </label>
        </div>
        {imageUrl && (
          <div className="book-form-image-preview">
            <img src={imageUrl} alt="" className="book-form-image-preview-img" />
          </div>
        )}
      </div>
      <div className="book-form-field">
        <label htmlFor="book-status">ステータス</label>
        <select
          id="book-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="book-form-select"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {status === 'read' && (
        <div className="book-form-field">
          <span className="book-form-field-label">評価（読了した本のみ）</span>
          <div className="book-form-rating" role="group" aria-label="5段階評価">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`book-form-rating-star ${rating >= value ? 'filled' : ''}`}
                onClick={() => setRating(value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
                }}
                aria-label={`${value}つ星`}
                aria-pressed={rating >= value}
                tabIndex={0}
              >
                ★
              </button>
            ))}
            {rating > 0 && (
              <button
                type="button"
                className="book-form-rating-clear"
                onClick={() => setRating(0)}
                aria-label="評価を解除"
              >
                解除
              </button>
            )}
          </div>
        </div>
      )}
      <div className="book-form-field">
        <label htmlFor="book-tags">タグ</label>
        <input
          id="book-tags"
          type="text"
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
          placeholder="カンマまたは読点で区切って入力（例: 小説, 自己啓発）"
          className="book-form-input"
        />
      </div>
      <div className="book-form-field">
        <label htmlFor="book-summary">概要</label>
        <textarea
          id="book-summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="本の概要やメモ"
          rows={4}
        />
      </div>
      <div className="book-form-actions">
        <button type="submit" className="book-form-btn primary">
          {book ? '更新' : '追加'}
        </button>
        {onCancel && (
          <button type="button" className="book-form-btn" onClick={onCancel}>
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}

export default BookForm;
