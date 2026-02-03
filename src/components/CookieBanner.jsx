import { useState, useEffect } from 'react';
import { enableAnalytics } from '../firebase';

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consensus = localStorage.getItem('cookie_consent');
        if (consensus === 'true') {
            enableAnalytics();
        } else if (consensus === null) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        enableAnalytics();
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'false');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            padding: '20px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px'
        }}>
            <div style={{ maxWidth: '800px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 10px', fontSize: '14px', lineHeight: '1.5' }}>
                    Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern und unseren Datenverkehr zu analysieren.
                    Durch Klicken auf "Akzeptieren" stimmen Sie der Verwendung von Cookies zu.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                        onClick={handleAccept}
                        style={{
                            padding: '8px 20px',
                            backgroundColor: '#2e7d32',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}
                    >
                        Akzeptieren
                    </button>
                    <button
                        onClick={handleDecline}
                        style={{
                            padding: '8px 20px',
                            backgroundColor: '#757575',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Ablehnen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
