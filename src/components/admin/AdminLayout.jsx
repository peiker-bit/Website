import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Mail, Settings, LayoutDashboard, User, Menu, X } from 'lucide-react';
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
        { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/admin/messages', icon: <Mail size={20} />, label: 'Nachrichten' },
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
          background: #f8fafc;
        }

        .admin-sidebar {
          width: 280px;
          background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%);
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          z-index: 100;
          transition: transform 0.3s ease;
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
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
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
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
          font-weight: 500;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .nav-item.active {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border-left-color: white;
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user-details {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .user-email {
          font-size: 0.8rem;
          opacity: 0.8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.875rem 1rem;
          background: rgba(220, 38, 38, 0.2);
          color: white;
          border: 1px solid rgba(220, 38, 38, 0.3);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .logout-btn:hover {
          background: rgba(220, 38, 38, 0.3);
          border-color: rgba(220, 38, 38, 0.5);
        }

        .admin-main {
          flex: 1;
          margin-left: 280px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .admin-header {
          background: white;
          padding: 1.5rem 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: #1e293b;
          cursor: pointer;
          padding: 0.5rem;
        }

        .header-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
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
          padding: 2rem;
        }

        .mobile-overlay {
          display: none;
        }

        @media (max-width: 968px) {
          .admin-sidebar {
            transform: translateX(-100%);
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
            font-size: 1.25rem;
          }

          .logout-btn-mobile {
            display: block;
          }

          .mobile-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 90;
          }

          .admin-content {
            padding: 1.5rem 1rem;
          }
        }
      `}</style>
        </div>
    );
};

export default AdminLayout;
