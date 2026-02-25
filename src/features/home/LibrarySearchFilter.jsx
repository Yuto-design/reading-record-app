import { useState, useMemo } from 'react';
import './styles/LibrarySearchFilter.css';

export const SORT_OPTIONS = [
  { value: 'title', label: 'タイトル順' },
  { value: 'author', label: '著者順' },
  { value: 'createdAtDesc', label: '登録日（新しい順）' },
  { value: 'createdAtAsc', label: '登録日（古い順）' },
  { value: 'finishedAtDesc', label: '読了日（新しい順）' },
  { value: 'finishedAtAsc', label: '読了日（古い順）' },
];

/**
 * 検索・並び替えの状態とロジックを扱うフック
 * @param {Array} filteredBooks - ステータスで絞り込んだ後の本の配列
 * @returns {{ searchQuery, setSearchQuery, sortBy, setSortBy, searchFilteredBooks, sortedBooks }}
 */
export function useLibrarySearchFilter(filteredBooks) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');

  const searchFilteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return filteredBooks;
    return filteredBooks.filter((book) => {
      const title = (book.title || '').toLowerCase();
      const author = (book.author || '').toLowerCase();
      const summary = (book.summary || '').toLowerCase();
      const memo = (book.memo || '').toLowerCase();
      const publisher = (book.publisher || '').toLowerCase();
      return (
        title.includes(q) ||
        author.includes(q) ||
        summary.includes(q) ||
        memo.includes(q) ||
        publisher.includes(q)
      );
    });
  }, [filteredBooks, searchQuery]);

  const sortedBooks = useMemo(() => {
    const list = [...searchFilteredBooks];
    switch (sortBy) {
      case 'title':
        list.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'ja'));
        break;
      case 'author':
        list.sort((a, b) => (a.author || '').localeCompare(b.author || '', 'ja'));
        break;
      case 'createdAtDesc':
        list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        break;
      case 'createdAtAsc':
        list.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
        break;
      case 'finishedAtDesc':
        list.sort((a, b) => (b.finishedAt || '').localeCompare(a.finishedAt || ''));
        break;
      case 'finishedAtAsc':
        list.sort((a, b) => (a.finishedAt || '').localeCompare(b.finishedAt || ''));
        break;
      default:
        break;
    }
    return list;
  }, [searchFilteredBooks, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    searchFilteredBooks,
    sortedBooks,
  };
}

/**
 * タグで絞り込むためのピル一覧（クリックで選択/解除）
 */
export function LibraryTagFilter({ allTags, selectedTags, onToggleTag }) {
  if (!allTags || allTags.length === 0) return null;

  return (
    <div className="library-tag-filter" role="group" aria-label="タグで絞り込み">
      <span className="library-tag-filter-label">タグ：</span>
      <div className="library-tag-filter-pills">
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              className={`library-tag-filter-pill ${isSelected ? 'selected' : ''}`}
              onClick={() => onToggleTag(tag)}
              aria-pressed={isSelected}
              aria-label={`${tag}で絞り込む`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LibrarySearchToolbar({ searchQuery, onSearchChange, sortBy, onSortChange }) {
  return (
    <div className="library-page-toolbar">
      <div className="library-page-search-wrap">
        <span className="library-page-search-icon" aria-hidden>
          <i className="fa-solid fa-magnifying-glass" />
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="タイトル・著者・概要・メモ・出版社で検索"
          className="library-page-search-input"
          aria-label="本を検索"
        />
      </div>
      <div className="library-page-sort-wrap">
        <label htmlFor="library-sort" className="library-page-sort-label">
          並び替え
        </label>
        <select
          id="library-sort"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="library-page-sort-select"
          aria-label="並び替え"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
