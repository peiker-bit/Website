import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import EmailSettings from './EmailSettings';
import MenuManager from './MenuManager';
import TerminToolSettings from './TerminToolSettings';
import { Mail, Menu as MenuIcon, Calendar } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('email');

    return (
        <AdminLayout>
            <div className="settings-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Einstellungen</h1>
                    <p className="text-gray-500">Verwalten Sie Website-Konfigurationen und Kontaktformular-Optionen.</p>
                </div>

                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('email')}
                        className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'email'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Mail size={18} />
                        Benachrichtigungen
                    </button>
                    <button
                        onClick={() => setActiveTab('menu')}
                        className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'menu'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <MenuIcon size={18} />
                        Menü-Verwaltung
                    </button>
                    <button
                        onClick={() => setActiveTab('termintool')}
                        className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'termintool'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Calendar size={18} />
                        Terminbuchung
                    </button>
                </div>

                <div className="settings-content">
                    {activeTab === 'email' && <EmailSettings embedded={true} />}
                    {activeTab === 'menu' && <MenuManager />}
                    {activeTab === 'termintool' && <TerminToolSettings embedded={true} />}
                </div>
            </div>
            <style>{`
        .flex { display: flex; }
        .gap-4 { gap: 1rem; }
        .items-center { align-items: center; }
        .mb-8 { margin-bottom: 2rem; }
        .border-b { border-bottom-width: 1px; }
        .border-b-2 { border-bottom-width: 2px; }
        .border-gray-200 { border-color: #e5e7eb; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .font-medium { font-weight: 500; }
        .text-blue-600 { color: #2563eb; }
        .border-blue-600 { border-color: #2563eb; }
        .text-gray-500 { color: #6b7280; }
        .border-transparent { border-color: transparent; }
        .hover\:text-gray-700:hover { color: #374151; }
      `}</style>
        </AdminLayout>
    );
};

export default Settings;
