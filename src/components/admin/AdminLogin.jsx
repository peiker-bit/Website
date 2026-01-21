import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, AlertCircle, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

import adminLogo from '../../assets/admin-logo.png';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Client-side validation
    if (!formData.email || !formData.password) {
      setErrorMessage('Bitte füllen Sie alle Felder aus.');
      setStatus('idle');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      setStatus('idle');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Ungültige Anmeldedaten. Bitte überprüfen Sie Ihre E-Mail und Passwort.');
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMessage('Bitte bestätigen Sie Ihre E-Mail-Adresse.');
        } else {
          setErrorMessage('Anmeldung fehlgeschlagen. Bitte versuchen Sie es später erneut.');
        }
        setStatus('error');
        console.error('Login error:', error);
        return;
      }

      if (data.session) {
        // Successfully logged in
        navigate('/admin');
      }
    } catch (error) {
      console.error('Login exception:', error);
      setErrorMessage('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      setStatus('error');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-background">
        {/* Animated background elements */}
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="login-card glass"
      >
        {/* Header */}
        <div className="login-header">
          <img src={adminLogo} alt="Peiker Steuerberater" className="admin-logo" />
          <h1>Admin Login</h1>
          <p>Sicherer Zugang zum Verwaltungsbereich</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="error-message"
            >
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">
              <Mail size={18} />
              E-Mail-Adresse
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="admin@beispiel.de"
              value={formData.email}
              onChange={handleChange}
              disabled={status === 'loading'}
              autoComplete="email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">
              <Lock size={18} />
              Passwort
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={status === 'loading'}
              autoComplete="current-password"
              required
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="btn btn-primary w-full"
            whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
            whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={20} className="spin-icon" />
                Wird angemeldet...
              </>
            ) : (
              <>
                <Lock size={20} />
                Anmelden
              </>
            )}
          </motion.button>
        </form>

        {/* Security Notice */}
        <div className="security-notice">
          <Shield size={14} />
          <span>Ihre Verbindung ist sicher verschlüsselt</span>
        </div>
      </motion.div>

      <style>{`
        .admin-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-primary);
          position: relative;
          overflow: hidden;
          padding: var(--space-4);
        }

        .login-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .bg-shape {
          position: absolute;
          filter: blur(80px);
          opacity: 0.4;
          border-radius: 50%;
        }

        .bg-shape-1 {
          width: 500px;
          height: 500px;
          background: var(--color-accent);
          top: -100px;
          left: -100px;
          animation: float 20s infinite ease-in-out;
        }

        .bg-shape-2 {
          width: 400px;
          height: 400px;
          background: var(--color-secondary);
          bottom: -100px;
          right: -100px;
          animation: float 15s infinite ease-in-out reverse;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: var(--space-8);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-2xl);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          z-index: 10;
        }

        .login-header {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .admin-logo {
          max-width: 240px;
          height: auto;
          margin-bottom: var(--space-6);
        }

        .login-header h1 {
          font-family: var(--font-heading);
          font-size: var(--text-2xl);
          color: var(--color-primary);
          margin-bottom: var(--space-2);
        }

        .login-header p {
          color: var(--color-text-muted);
          font-size: var(--text-base);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-weight: 600;
          color: var(--color-primary);
          font-size: var(--text-sm);
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--color-bg-body);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          font-size: var(--text-base);
          color: var(--color-text-main);
          transition: all var(--transition-fast);
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
          background: white;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3);
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
        }

        .security-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          margin-top: var(--space-8);
          padding-top: var(--space-4);
          border-top: 1px solid var(--color-border);
          color: var(--color-text-muted);
          font-size: var(--text-xs);
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
