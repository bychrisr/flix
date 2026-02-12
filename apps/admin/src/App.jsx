import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { DashboardHomePage } from './pages/DashboardHomePage.jsx';
import { EventsPage } from './pages/EventsPage.jsx';
import { NewEventPage } from './pages/NewEventPage.jsx';
import { EditEventPage } from './pages/EditEventPage.jsx';
import { LessonsPage } from './pages/LessonsPage.jsx';
import { QuizzesPage } from './pages/QuizzesPage.jsx';

export const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />

    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<DashboardHomePage />} />
      <Route path="/eventos" element={<EventsPage />} />
      <Route path="/eventos/novo" element={<NewEventPage />} />
      <Route path="/eventos/:id/editar" element={<EditEventPage />} />
      <Route path="/aulas" element={<LessonsPage />} />
      <Route path="/quizzes" element={<QuizzesPage />} />
    </Route>

    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);
