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

  useEffect(() => {
    if (book) {
      setTitle(book.title || '');
      setAuthor(book.author || '');
      setSummary(book.summary || '');
      setStatus(book.status === 'reading' || book.status === 'read' ? book.status : 'want');
      setImageUrl(book.imageUrl || '');
    } else {
      setTitle('');
      setAuthor('');
      setSummary('');
      setStatus('want');
      setImageUrl('');
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
    onSave({
      ...(book && { id: book.id, createdAt: book.createdAt }),
      title: title.trim(),
      author: author.trim(),
      summary: summary.trim(),
      status,
      ...(imageUrl.trim() && { imageUrl: imageUrl.trim() }),
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
