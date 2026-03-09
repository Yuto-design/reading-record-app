import { Link } from 'react-router-dom';
import './styles/HomeHeroFeatures.css';

const FEATURES_DATA = [
  {
    key: 'timer',
    title: '読書タイマーで記録',
    desc: 'タイマーをスタート・ストップするだけで、その日の読書時間が自動でまとまります。',
    tag: '時間記録',
    to: '/reading',
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=600&q=80',
    imageAlt: '時計',
    titleAttr: '読書タイマーを開く',
  },
  {
    key: 'shelf',
    title: '本棚で本を記録',
    desc: '読んだ本・読みたい本・積読本を、シンプルな本棚 UI で整理しておけます。',
    tag: '本棚管理',
    to: '/library',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80',
    imageAlt: '本棚の本',
    titleAttr: '本棚を開く',
  },
  {
    key: 'memo',
    title: 'その日のメモも一緒に',
    desc: '印象に残った一文や、その日の気分を一言メモとして、本と一緒に残せます。',
    tag: 'メモ',
    to: '/library',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'メモとノート',
    titleAttr: 'メモ付きで記録する',
  },
  {
    key: 'graph',
    title: 'グラフで習慣を可視化',
    desc: '月ごとの読書量や目標達成までのペースを、わかりやすいグラフで振り返れます。',
    tag: '可視化',
    to: '/reading',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'グラフとデータ',
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
            こんな機能があります。
          </p>
          <h3 className="home-hero-features-tag-heading">TAG.</h3>
          <div className="home-hero-features-tags">
            <span className="home-hero-features-tag">時間記録</span>
            <span className="home-hero-features-tag">本棚管理</span>
            <span className="home-hero-features-tag">メモ</span>
            <span className="home-hero-features-tag">可視化</span>
          </div>
        </div>
        <div className="home-hero-feature-cards">
          {FEATURES_DATA.map((item) => (
              <article
                key={item.key}
                className="home-hero-feature-card"
                aria-label={item.title}
              >
                <div className={`home-hero-feature-card-visual home-hero-feature-card-visual--${item.key}`}>
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="home-hero-feature-card-image"
                  />
                  <span className="home-hero-feature-card-tag">{item.tag}</span>
                </div>
                <div className="home-hero-feature-card-body">
                  <h3 className="home-hero-feature-card-title">{item.title}</h3>
                  <p className="home-hero-feature-card-desc">{item.desc}</p>
                  <Link
                    to={item.to}
                    className="home-hero-feature-card-read-more"
                    title={item.titleAttr}
                  >
                    <span className="home-hero-feature-card-read-more-dot" aria-hidden="true">●</span>
                    READ MORE
                  </Link>
                </div>
              </article>
            ))}
        </div>
      </div>
    </div>
  );
}

export default HomeHeroFeatures;
