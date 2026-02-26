import { useState, useCallback } from 'react';
import './styles/HomeSidebar.css';

const HOME_SECTIONS = [
  { id: 'home-today', label: '今日の読書' },
  { id: 'home-stats', label: '統計' },
  { id: 'home-weekly-chart', label: '今週の読書' },
  { id: 'home-recent-books', label: '最近追加した本' },
];

function HomeSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="home-sidebar">
      <button
        type="button"
        className="home-sidebar-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="home-sidebar-menu"
        aria-label={isOpen ? 'メニューを閉じる' : 'セクションへ移動するメニューを開く'}
      >
        <i className="fa-solid fa-bars" aria-hidden />
      </button>
      <nav
        id="home-sidebar-menu"
        className={`home-sidebar-nav ${isOpen ? 'home-sidebar-nav--open' : ''}`}
        aria-label="Home セクションへ移動"
      >
        {HOME_SECTIONS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className="home-sidebar-link"
            onClick={closeMenu}
          >
            {label}
          </a>
        ))}
      </nav>
      {isOpen && (
        <button
          type="button"
          className="home-sidebar-backdrop"
          onClick={closeMenu}
          aria-label="メニューを閉じる"
        />
      )}
    </div>
  );
}

export default HomeSidebar;
