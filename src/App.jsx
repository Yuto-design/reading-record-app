import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ReadingTimePage from './pages/ReadingTimePage';
import LibraryPage from './pages/LibraryPage';
import SettingsPage from './pages/SettingsPage';
import StatsPage from './pages/StatsPage';
import CompletedPage from './pages/CompletedPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="reading" element={<ReadingTimePage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="completed" element={<CompletedPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
