import { useState, useEffect } from 'react';
import './BookForm.css';

function BookForm({ book = null, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (book) {
      setTitle(book.title || '');
      setAuthor(book.author || '');
      setSummary(book.summary || '');
    } else {
      setTitle('');
      setAuthor('');
      setSummary('');
    }
  }, [book]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...(book && { id: book.id, createdAt: book.createdAt }),
      title: title.trim(),
      author: author.trim(),
      summary: summary.trim(),
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
