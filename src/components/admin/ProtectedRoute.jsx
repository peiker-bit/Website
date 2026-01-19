import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        // Check current session
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
            } catch (error) {
                console.error('Error checking session:', error);
                setSession(null);
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="protected-route-loading">
                <Loader2 size={48} className="spin-icon" />
                <p>Authentifizierung wird überprüft...</p>

                <style>{`
          .protected-route-loading {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          }

          .protected-route-loading .spin-icon {
            color: #3b82f6;
            animation: spin 1s linear infinite;
          }

          .protected-route-loading p {
            color: #64748b;
            font-size: 1.1rem;
            font-weight: 500;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!session) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // If authenticated, render the protected component
    return children;
};

export default ProtectedRoute;
