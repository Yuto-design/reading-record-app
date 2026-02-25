import { useState, useMemo } from 'react';

export function getBookStatus(book) {
  return book.status === 'reading' || book.status === 'read' ? book.status : 'want';
}

export const STATUS_FILTER_ALL = 'all';

export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'すべて', icon: 'fa-books' },
  { value: 'want', label: '読みたい', icon: 'fa-bookmark' },
  { value: 'reading', label: '読んでいる', icon: 'fa-book-open-reader' },
  { value: 'read', label: '読了', icon: 'fa-circle-check' },
];

/**
 * 本一覧のステータスフィルタ用フック
 * @param {Array} books - 本の配列
 * @returns {{ statusFilter, setStatusFilter, filteredBooks, statusCounts }}
 */
export function useBookStatusFilter(books) {
  const [statusFilter, setStatusFilter] = useState(STATUS_FILTER_ALL);

  const filteredBooks = useMemo(() => {
    if (statusFilter === STATUS_FILTER_ALL) return books;
    return books.filter((book) => getBookStatus(book) === statusFilter);
  }, [books, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = { all: books.length, want: 0, reading: 0, read: 0 };
    books.forEach((book) => {
      counts[getBookStatus(book)]++;
    });
    return counts;
  }, [books]);

  return { statusFilter, setStatusFilter, filteredBooks, statusCounts };
}

function BookStatusSidebar({ statusFilter, onStatusChange, books, allTags = [], selectedTags = [], onToggleTag }) {
  const statusCounts = useMemo(() => {
    const counts = { all: books.length, want: 0, reading: 0, read: 0 };
    books.forEach((book) => {
      counts[getBookStatus(book)]++;
    });
    return counts;
  }, [books]);

  return (
    <aside className="library-page-sidebar" aria-label="本のフィルタ">
      <nav
        className="library-page-filters"
        role="tablist"
        aria-label="本のステータスでフィルタ"
      >
        {STATUS_FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={statusFilter === opt.value}
            aria-label={`${opt.label}（${statusCounts[opt.value]}件）`}
            className={`library-page-filter-btn library-page-filter-btn--${opt.value} ${statusFilter === opt.value ? 'active' : ''}`}
            onClick={() => onStatusChange(opt.value)}
          >
            <span className="library-page-filter-icon" aria-hidden>
              <i className={`fa-solid ${opt.icon}`} />
            </span>
            <span className="library-page-filter-label">{opt.label}</span>
            <span className="library-page-filter-count">{statusCounts[opt.value]}</span>
          </button>
        ))}
      </nav>

      {allTags.length > 0 && (
        <div className="library-page-sidebar-tags" role="group" aria-label="タグで絞り込み">
          <span className="library-page-sidebar-tags-label">タグ</span>
          <div className="library-page-sidebar-tags-pills">
            {allTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  className={`library-page-sidebar-tag-pill ${isSelected ? 'selected' : ''}`}
                  onClick={() => onToggleTag?.(tag)}
                  aria-pressed={isSelected}
                  aria-label={`${tag}で絞り込む`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}

export default BookStatusSidebar;
