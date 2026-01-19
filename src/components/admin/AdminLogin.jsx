import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, AlertCircle, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

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
                navigate('/admin/dashboard');
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
                <div className="bg-circle bg-circle-1"></div>
                <div className="bg-circle bg-circle-2"></div>
                <div className="bg-circle bg-circle-3"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="login-card"
            >
                {/* Header */}
                <div className="login-header">
                    <div className="shield-icon">
                        <Shield size={40} />
                    </div>
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
                        className="btn-login"
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
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        .login-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 20s infinite ease-in-out;
        }

        .bg-circle-1 {
          width: 400px;
          height: 400px;
          top: -200px;
          left: -200px;
          animation-delay: 0s;
        }

        .bg-circle-2 {
          width: 300px;
          height: 300px;
          bottom: -150px;
          right: -150px;
          animation-delay: -7s;
        }

        .bg-circle-3 {
          width: 250px;
          height: 250px;
          top: 50%;
          right: 10%;
          animation-delay: -14s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .login-card {
          position: relative;
          background: white;
          border-radius: 24px;
          padding: 3rem;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          z-index: 1;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .shield-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
          color: white;
          border-radius: 20px;
          margin-bottom: 1.5rem;
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        }

        .login-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .login-header p {
          color: #64748b;
          font-size: 1rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
        }

        .error-message svg {
          flex-shrink: 0;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #1e293b;
          font-size: 0.95rem;
        }

        .form-group input {
          padding: 1rem 1.25rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8fafc;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-login {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.25rem;
          background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
          margin-top: 0.5rem;
        }

        .btn-login:hover:not(:disabled) {
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
          transform: translateY(-2px);
        }

        .btn-login:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .security-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 0.875rem;
        }

        @media (max-width: 640px) {
          .login-card {
            padding: 2rem 1.5rem;
          }

          .login-header h1 {
            font-size: 1.75rem;
          }

          .shield-icon {
            width: 64px;
            height: 64px;
          }

          .bg-circle-1,
          .bg-circle-2,
          .bg-circle-3 {
            display: none;
          }
        }
      `}</style>
        </div>
    );
};

export default AdminLogin;
