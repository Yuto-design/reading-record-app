import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getBooks } from '../../utils/storage';
import { getBookStatus } from '../myLibrary/BookStatusSidebar';
import { STATUS_LABELS } from '../myLibrary/constants';
import './styles/HomeRecentBooks.css';

const RECENT_COUNT = 3;

function HomeRecentBooks() {
  const recentBooks = useMemo(() => {
    const books = getBooks();
    return [...books]
      .sort((a, b) => {
        const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bt - at;
      })
      .slice(0, RECENT_COUNT);
  }, []);

  if (recentBooks.length === 0) return null;

  return (
    <section className="home-recent-books">
      <h2 className="home-recent-books-title">最近追加した本</h2>
      <ul className="home-recent-books-list">
        {recentBooks.map((book) => {
          const status = getBookStatus(book);
          return (
            <li key={book.id} className="home-recent-books-item">
              <Link to={`/library?book=${book.id}`} className="home-recent-books-card">
                {book.imageUrl && (
                  <div className="home-recent-books-thumb">
                    <img src={book.imageUrl} alt="" className="home-recent-books-thumb-img" />
                  </div>
                )}
                <div className="home-recent-books-body">
                  <h3 className="home-recent-books-book-title">
                    {book.title || '（タイトルなし）'}
                  </h3>
                  {book.author && (
                    <p className="home-recent-books-author">{book.author}</p>
                  )}
                  <span className={`home-recent-books-status home-recent-books-status--${status}`}>
                    {STATUS_LABELS[status]}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link to="/library" className="home-recent-books-more">
        もっと見る
      </Link>
    </section>
  );
}

export default HomeRecentBooks;
