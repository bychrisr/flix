import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from './ProtectedRoute.jsx';

vi.mock('../auth/AuthContext.jsx', () => ({
  useAuth: vi.fn(),
}));

const { useAuth } = await import('../auth/AuthContext.jsx');

describe('ProtectedRoute', () => {
  it('redirects unauthenticated user to login', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, logout: vi.fn() });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>Login Screen</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login Screen')).toBeInTheDocument();
  });

  it('renders child route when authenticated', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, logout: vi.fn() });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
