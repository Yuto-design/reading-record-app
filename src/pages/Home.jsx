import { HomeHero, HomeStats, HomeActions } from '../features/home';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <HomeHero />
      <HomeStats />
      <HomeActions />
    </div>
  );
}

export default Home;
