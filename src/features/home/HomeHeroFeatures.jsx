import { Link } from 'react-router-dom';
import './styles/HomeHeroFeatures.css';

const FEATURES_DATA = [
  {
    key: 'timer',
    title: '読書タイマーで記録',
    desc: 'タイマーをスタート・ストップするだけで、その日の読書時間が自動でまとまります。',
    tag: '時間記録',
    to: '/reading',
    icon: 'fa-regular fa-clock',
    titleAttr: '読書タイマーを開く',
  },
  {
    key: 'shelf',
    title: '本棚で本を記録',
    desc: '読んだ本・読みたい本・積読本を、シンプルな本棚 UI で整理しておけます。',
    tag: '本棚管理',
    to: '/library',
    icon: 'fa-solid fa-book-open',
    titleAttr: '本棚を開く',
  },
  {
    key: 'memo',
    title: 'その日のメモも一緒に',
    desc: '印象に残った一文や、その日の気分を一言メモとして、本と一緒に残せます。',
    tag: 'メモ',
    to: '/reading',
    icon: 'fa-regular fa-pen-to-square',
    titleAttr: 'メモ付きで記録する',
  },
  {
    key: 'graph',
    title: 'グラフで習慣を可視化',
    desc: '月ごとの読書量や目標達成までのペースを、わかりやすいグラフで振り返れます。',
    tag: '可視化',
    to: '/',
    icon: 'fa-solid fa-chart-line',
    titleAttr: 'ホームのレポートを見る',
  },
];

function HomeHeroFeatures() {
  return (
    <div className="home-hero-features" aria-label="アプリの主な機能">
      <div className="home-hero-features-bg" aria-hidden="true" />
      <div className="home-hero-features-inner">
        <div className="home-hero-features-left">
          <h2 className="home-hero-features-heading">FEATURES.</h2>
          <p className="home-hero-features-sub">
            <span className="home-hero-features-dots" aria-hidden="true">●●</span>
            こんな機能があります
          </p>
          <h3 className="home-hero-features-tag-heading">TAG.</h3>
          <div className="home-hero-features-tags">
            <span className="home-hero-features-tag">時間記録</span>
            <span className="home-hero-features-tag">本棚管理</span>
            <span className="home-hero-features-tag">メモ</span>
            <span className="home-hero-features-tag">可視化</span>
          </div>
        </div>
        <div className="home-hero-features-right">
          <div className="home-hero-feature-cards">
            {FEATURES_DATA.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className="home-hero-feature-card"
                title={item.titleAttr}
                aria-label={`${item.title} - READ MORE`}
              >
                <div className={`home-hero-feature-card-visual home-hero-feature-card-visual--${item.key}`}>
                  <span className="home-hero-feature-card-tag">{item.tag}</span>
                  <span className="home-hero-feature-card-icon" aria-hidden="true">
                    <i className={item.icon} />
                  </span>
                </div>
                <div className="home-hero-feature-card-body">
                  <h3 className="home-hero-feature-card-title">{item.title}</h3>
                  <p className="home-hero-feature-card-desc">{item.desc}</p>
                  <span className="home-hero-feature-card-read-more">
                    <span className="home-hero-feature-card-read-more-dot" aria-hidden="true">●</span>
                    READ MORE
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <Link
            to="/"
            className="home-hero-features-top-btn"
            title="ホームへ戻る"
            aria-label="ホームへ戻る"
          >
            <span className="home-hero-features-top-btn-label">FEATURES</span>
            <span className="home-hero-features-top-btn-sublabel">TOP</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomeHeroFeatures;
