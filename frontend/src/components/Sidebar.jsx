import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Target, 
  Video, 
  Kanban, 
  User,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: null },
    { label: 'Resumes & ATS', path: '/resumes', icon: FileText, badge: 'AI' },
    { label: 'Job Matching', path: '/jobs', icon: Briefcase, badge: 'New' },
    { label: 'Skill Gap & Roadmap', path: '/skills', icon: Target, badge: null },
    { label: 'AI Mock Interview', path: '/interview', icon: Video, badge: 'AI' },
    { label: 'Application Tracker', path: '/applications', icon: Kanban, badge: '3' },
    { label: 'Profile & Settings', path: '/profile', icon: User, badge: null },
    { label: 'Admin Dashboard', path: '/admin', icon: ShieldAlert, badge: 'Admin' }
  ];

  const renderNavList = () => (
    <nav role="navigation" aria-label="Sidebar Navigation" className="flex flex-col gap-xs">
      <div style={{ padding: 'var(--space-xs) var(--space-sm)', color: 'var(--color-text-subtle)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Main Menu
      </div>
      
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.path;
        
        return (
          <Link
            key={item.label}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: active ? '600' : '500',
              color: active ? '#ffffff' : 'var(--color-text-muted)',
              backgroundColor: active ? 'var(--color-primary)' : 'transparent',
              transition: 'background-color 0.15s, color 0.15s'
            }}
          >
            <div className="flex items-center gap-sm">
              <Icon size={18} />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className={`badge ${item.badge === 'Admin' ? 'badge-danger' : active ? 'badge-demo' : 'badge-info'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Drawer Trigger Bar (Visible only on < 1024px) */}
      <div className="mobile-sidebar-bar" style={{
        display: 'none',
        padding: '0.75rem 1rem',
        backgroundColor: 'var(--color-bg-card)',
        borderBottom: '1px solid var(--color-border)',
        alignItems: 'center',
        justify: 'space-between'
      }}>
        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Menu Navigation</span>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer' }}
          aria-label="Toggle Navigation Drawer"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="desktop-sidebar" style={{
        width: '260px',
        backgroundColor: 'var(--color-bg-card)',
        borderRight: '1px solid var(--color-border)',
        padding: 'var(--space-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-xs)',
        minHeight: 'calc(100vh - 65px)'
      }}>
        {renderNavList()}
      </aside>

      {/* Mobile Backdrop Drawer */}
      {mobileOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            zIndex: 80,
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setMobileOpen(false)}
        >
          <div 
            style={{
              width: '280px',
              height: '100%',
              backgroundColor: 'var(--color-bg-card)',
              padding: 'var(--space-md)',
              borderRight: '1px solid var(--color-border)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {renderNavList()}
          </div>
        </div>
      )}

      {/* Responsive Media Queries Injection for Sidebar */}
      <style>{`
        @media (max-width: 1024px) {
          .desktop-sidebar { display: none !important; }
          .mobile-sidebar-bar { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
