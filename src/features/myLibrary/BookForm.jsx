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
  const [finishedAt, setFinishedAt] = useState('');
  const [memo, setMemo] = useState('');
  const [memoAttachments, setMemoAttachments] = useState([]);
  const [pageCount, setPageCount] = useState('');
  const [publisher, setPublisher] = useState('');

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
      setFinishedAt(book.finishedAt ? String(book.finishedAt).slice(0, 10) : '');
      setMemo(book.memo || '');
      setMemoAttachments(Array.isArray(book.memoAttachments) ? [...book.memoAttachments] : []);
      setPageCount(book.pageCount != null ? String(book.pageCount) : '');
      setPublisher(book.publisher || '');
    } else {
      setTitle('');
      setAuthor('');
      setSummary('');
      setStatus('want');
      setImageUrl('');
      setRating(0);
      setTagsText('');
      setFinishedAt('');
      setMemo('');
      setMemoAttachments([]);
      setPageCount('');
      setPublisher('');
    }
  }, [book]);

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleMemoAttachmentAdd = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    const process = (index, acc) => {
      if (index >= files.length || acc.length >= 10) {
        if (acc.length > 0) setMemoAttachments((prev) => [...prev, ...acc].slice(0, 10));
        return;
      }
      const file = files[index];
      if (!file.type.startsWith('image/')) {
        process(index + 1, acc);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const next = [...acc, reader.result].slice(0, 10);
        process(index + 1, next);
      };
      reader.readAsDataURL(file);
    };
    process(0, []);
  };

  const handleMemoAttachmentRemove = (index) => {
    setMemoAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tags = tagsText.split(/[,、]/).map((t) => t.trim()).filter(Boolean);
    const pageNum = pageCount.trim() ? parseInt(pageCount, 10) : undefined;
    onSave({
      ...(book && { id: book.id, createdAt: book.createdAt }),
      title: title.trim(),
      author: author.trim(),
      summary: summary.trim(),
      status,
      ...(imageUrl.trim() && { imageUrl: imageUrl.trim() }),
      ...(status === 'read' && rating >= 1 && rating <= 5 && { rating }),
      ...(tags.length > 0 && { tags }),
      ...(status === 'read' && finishedAt.trim() && { finishedAt: finishedAt.trim().slice(0, 10) }),
      ...(memo.trim() && { memo: memo.trim() }),
      ...(memoAttachments.length > 0 && { memoAttachments }),
      ...(Number.isInteger(pageNum) && pageNum > 0 && { pageCount: pageNum }),
      ...(publisher.trim() && { publisher: publisher.trim() }),
    });
  };

  return (
    <form className="book-form card" onSubmit={handleSubmit} autoComplete="off">
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
          autoComplete="off"
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
          autoComplete="off"
        />
      </div>
      <div className="book-form-field">
        <label htmlFor="book-publisher">出版社</label>
        <input
          id="book-publisher"
          type="text"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          placeholder="出版社名"
          autoComplete="off"
        />
      </div>
      <div className="book-form-field">
        <label htmlFor="book-pageCount">ページ数</label>
        <input
          id="book-pageCount"
          type="number"
          min="1"
          value={pageCount}
          onChange={(e) => setPageCount(e.target.value)}
          placeholder="例: 320"
          autoComplete="off"
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
            autoComplete="off"
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
      {status === 'read' && (
        <div className="book-form-field">
          <label htmlFor="book-finishedAt">読了日</label>
          <input
            id="book-finishedAt"
            type="date"
            value={finishedAt}
            onChange={(e) => setFinishedAt(e.target.value)}
            className="book-form-input"
          />
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
          placeholder="本の概要（内容紹介など）"
          rows={4}
        />
      </div>
      <div className="book-form-field">
        <label htmlFor="book-memo">読書メモ・感想</label>
        <textarea
          id="book-memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="自分のメモや感想を自由に"
          rows={4}
        />
        <div className="book-form-memo-attachments">
          <label className="book-form-file-label">
            <span className="book-form-file-btn">画像を添付</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMemoAttachmentAdd}
              className="book-form-file-input"
              aria-label="読書メモに画像を添付"
            />
          </label>
          {memoAttachments.length > 0 && (
            <p className="book-form-memo-attachments-note">
              {memoAttachments.length}件の画像（最大10件）
            </p>
          )}
          {memoAttachments.length > 0 && (
            <ul className="book-form-memo-attachments-list">
              {memoAttachments.map((dataUrl, index) => (
                <li key={`${index}-${dataUrl.slice(0, 50)}`} className="book-form-memo-attachment-item">
                  <img src={dataUrl} alt="" className="book-form-memo-attachment-thumb" />
                  <button
                    type="button"
                    className="book-form-memo-attachment-remove"
                    onClick={() => handleMemoAttachmentRemove(index)}
                    aria-label="この画像を削除"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
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
