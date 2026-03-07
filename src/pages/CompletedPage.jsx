import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { getBooks } from '../utils/storage';
import './styles/PageCommon.css';
import './styles/CompletedPage.css';

function formatDateYMD(isoOrYMD) {
  const s = String(isoOrYMD || '').slice(0, 10);
  if (!s) return '';
  const [y, m, d] = s.split('-').map((n) => parseInt(n, 10));
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return s;
  return format(new Date(y, m - 1, d), 'yyyy年M月d日');
}

function CompletedPage() {
  const navigate = useNavigate();
  const readBooks = useMemo(() => {
    const list = getBooks().filter((b) => b.status === 'read');
    return list.sort((a, b) => {
      const da = a.finishedAt || a.createdAt || '';
      const db = b.finishedAt || b.createdAt || '';
      return db.localeCompare(da);
    });
  }, []);

  const byYear = useMemo(() => {
    const map = {};
    readBooks.forEach((b) => {
      const y = (b.finishedAt || b.createdAt || '').slice(0, 4);
      if (y) map[y] = (map[y] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, count]) => ({ year, count }));
  }, [readBooks]);

  const handleSelect = (bookId) => {
    navigate(`/library?book=${bookId}`);
  };

  return (
    <div className="page-wrapper completed-page">
      <div className="completed-page-card">
        <div className="completed-page-card-content">
          <h2 className="page-heading completed-page-heading">Completed</h2>
          <p className="completed-page-sub">読み終えた本の一覧と振り返り</p>

          {byYear.length > 0 && (
            <section className="completed-year-summary" aria-labelledby="completed-year-heading">
              <h3 id="completed-year-heading" className="completed-section-title">
                年間サマリー
              </h3>
              <div className="completed-year-chips">
                {byYear.map(({ year, count }) => (
                  <span key={year} className="completed-year-chip">
                    {year}年: {count}冊
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="completed-list-section" aria-labelledby="completed-list-heading">
            <h3 id="completed-list-heading" className="completed-section-title">
              読了した本（{readBooks.length}冊）
            </h3>
            {readBooks.length === 0 ? (
              <p className="completed-empty">
                まだ読了した本はありません。
                <Link to="/library">My Library</Link>
                で本を追加し、ステータスを「読了」にするとここに表示されます。
              </p>
            ) : (
              <ul className="completed-list">
                {readBooks.map((book) => {
                  const rating = (book.rating >= 1 && book.rating <= 5)
                    ? Math.round(book.rating)
                    : 0;
                  const finishedStr = book.finishedAt
                    ? formatDateYMD(book.finishedAt)
                    : '';
                  return (
                    <li key={book.id} className="completed-item">
                      {book.imageUrl && (
                        <div className="completed-item-thumb">
                          <img
                            src={book.imageUrl}
                            alt=""
                            className="completed-item-thumb-img"
                          />
                        </div>
                      )}
                      <div className="completed-item-body">
                        <button
                          type="button"
                          className="completed-item-title-btn"
                          onClick={() => handleSelect(book.id)}
                        >
                          {book.title || '（タイトルなし）'}
                        </button>
                        {book.author && (
                          <p className="completed-item-author">{book.author}</p>
                        )}
                        <div className="completed-item-meta">
                          {finishedStr && (
                            <span className="completed-item-date">{finishedStr}</span>
                          )}
                          {rating > 0 && (
                            <span
                              className="completed-item-rating"
                              aria-label={`評価 ${rating}つ星`}
                            >
                              {[1, 2, 3, 4, 5].map((v) => (
                                <span
                                  key={v}
                                  className={
                                    rating >= v
                                      ? 'completed-item-star filled'
                                      : 'completed-item-star'
                                  }
                                >
                                  ★
                                </span>
                              ))}
                            </span>
                          )}
                        </div>
                        {book.memo && (
                          <p className="completed-item-memo">
                            {book.memo.length > 120
                              ? `${book.memo.slice(0, 120)}...`
                              : book.memo}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default CompletedPage;
