import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, LogIn, LayoutDashboard, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-container" style={{
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.875rem 0'
    }}>
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-sm">
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={20} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
            ResuMatch <span style={{ color: 'var(--color-primary)' }}>AI</span>
          </span>
        </Link>

        <nav className="flex items-center gap-md" role="navigation">
          <Link 
            to="/" 
            style={{
              color: isActive('/') ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: isActive('/') ? '600' : '400',
              fontSize: '0.9375rem',
              transition: 'color 0.15s'
            }}
          >
            Home
          </Link>
          
          {isAuthenticated || location.pathname === '/dashboard' ? (
            <Link 
              to="/dashboard" 
              className="flex items-center gap-xs"
              style={{
                color: isActive('/dashboard') ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: isActive('/dashboard') ? '600' : '400',
                fontSize: '0.9375rem'
              }}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          ) : null}

          {!isAuthenticated && location.pathname !== '/dashboard' ? (
            <div className="flex items-center gap-sm">
              <Link to="/login" className="btn btn-outline btn-sm">
                <LogIn size={16} />
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-sm">
              <Link to="/profile" className="btn btn-secondary btn-sm flex items-center gap-xs">
                <User size={16} />
                {user?.name || 'Alex Morgan'}
              </Link>
              <button 
                onClick={logout} 
                className="btn btn-ghost btn-sm"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
