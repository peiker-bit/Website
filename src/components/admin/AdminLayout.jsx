import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Mail, Settings, LayoutDashboard, User, Menu, X, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigationItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/messages', icon: <Mail size={20} />, label: 'Nachrichten' },
    { path: '/admin/bookings', icon: <Calendar size={20} />, label: 'Buchungen' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Einstellungen' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <User size={24} />
            </div>
            <span className="logo-text">Admin</span>
          </div>
          <button className="close-mobile-menu" onClick={() => setMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-details">
              <div className="user-name">Admin</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Abmelden</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-header">
          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="header-title">
            {navigationItems.find(item => item.path === location.pathname)?.label || 'Admin'}
          </div>
          <div className="header-actions">
            <button className="logout-btn-mobile" onClick={handleLogout}>
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: var(--color-bg-body);
        }

        .admin-sidebar {
          width: 280px;
          background: var(--color-primary);
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          z-index: 100;
          transition: transform var(--transition-normal);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar-header {
          padding: 2rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: var(--gradient-accent);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-glow);
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          font-family: var(--font-heading);
          letter-spacing: -0.02em;
        }

        .close-mobile-menu {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.5rem;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1.5rem 0;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all var(--transition-fast);
          border-left: 3px solid transparent;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .nav-item.active {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-left-color: var(--color-accent);
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.2);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: var(--color-secondary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .user-details {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: white;
        }

        .user-email {
          font-size: 0.75rem;
          opacity: 0.7;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem 1rem;
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .logout-btn:hover {
          background: rgba(220, 38, 38, 0.2);
          color: #fca5a5;
          border-color: rgba(220, 38, 38, 0.4);
        }

        .admin-main {
          flex: 1;
          margin-left: 280px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .admin-header {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          padding: 1rem 2rem;
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid var(--color-border);
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--color-primary);
          cursor: pointer;
          padding: 0.5rem;
        }

        .header-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-primary);
          font-family: var(--font-heading);
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .logout-btn-mobile {
          display: none;
          background: none;
          border: none;
          color: #dc2626;
          cursor: pointer;
          padding: 0.5rem;
        }

        .admin-content {
          flex: 1;
          padding: var(--space-6);
          max-width: 1600px;
          width: 100%;
          margin: 0 auto;
        }

        .mobile-overlay {
          display: none;
        }

        @media (max-width: 968px) {
          .admin-sidebar {
            transform: translateX(-100%);
            box-shadow: var(--shadow-xl);
          }

          .admin-sidebar.mobile-open {
            transform: translateX(0);
          }

          .close-mobile-menu {
            display: block;
          }

          .admin-main {
            margin-left: 0;
          }

          .mobile-menu-toggle {
            display: block;
          }

          .header-title {
            font-size: 1.1rem;
          }

          .logout-btn-mobile {
            display: block;
          }

          .mobile-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(4px);
            z-index: 90;
          }

          .admin-content {
            padding: var(--space-4);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
