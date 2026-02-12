import { Navigate, Route, Routes } from 'react-router-dom';
import { CatalogPage } from './pages/CatalogPage.jsx';
import { DesignSystemShowcasePage } from './pages/DesignSystemShowcasePage.jsx';
import { PlaybackPage } from './pages/PlaybackPage.jsx';

export const App = () => (
  <Routes>
    <Route path="/design-system" element={<DesignSystemShowcasePage />} />
    <Route path="/events/:eventSlug" element={<CatalogPage />} />
    <Route path="/events/:eventSlug/lessons/:lessonSlug" element={<PlaybackPage />} />
    <Route path="*" element={<Navigate to="/events/flix-mvp-launch-event" replace />} />
  </Routes>
);
