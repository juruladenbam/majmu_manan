import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from './app/PublicLayout';
import { HomePage } from './pages/HomePage';
import { ReaderMenuPage } from './pages/reader/ReaderMenuPage';
import { ReaderContentPage } from './pages/reader/ReaderContentPage';

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/bacaan/:slug" element={<ReaderMenuPage />} />
        <Route path="/bacaan/:slug/:sectionSlug" element={<ReaderContentPage />} />
      </Route>
    </Routes>
  );
}

export default App;