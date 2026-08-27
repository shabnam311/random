import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RequireAuth } from '../components/layout/RequireAuth';
import * as AuthContext from '../contexts/AuthContext';

describe('RequireAuth', () => {
  it('redirects to /login if unauthenticated', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      isLoading: false
    } as any);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route 
            path="/protected" 
            element={
              <RequireAuth>
                <div>Protected Content</div>
              </RequireAuth>
            } 
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeTruthy();
    expect(screen.queryByText('Protected Content')).toBeNull();
  });

  it('renders children if authenticated', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: 'test-user' },
      isLoading: false
    } as any);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route 
            path="/protected" 
            element={
              <RequireAuth>
                <div>Protected Content</div>
              </RequireAuth>
            } 
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeTruthy();
  });
});
