import { HomeHero, HomeStats, HomeActions } from '../features/home';

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
