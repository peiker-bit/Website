import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Payroll from './components/Payroll';
import Privatpersonen from './components/Privatpersonen';
import Unternehmen from './components/Unternehmen';
import DigitaleZusammenarbeit from './components/DigitaleZusammenarbeit';
import ServicesPage from './components/ServicesPage';
import Contact from './components/Contact';
import AGB from './components/AGB';
import Impressum from './components/Impressum';

// Admin components
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import MessageList from './components/admin/MessageList';
import EmailSettings from './components/admin/EmailSettings';
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Header />
              <main><Home /></main>
              <Footer />
            </>
          } />
          <Route path="/leistungen" element={
            <>
              <Header />
              <main><ServicesPage /></main>
              <Footer />
            </>
          } />
          <Route path="/lohn" element={
            <>
              <Header />
              <main><Payroll /></main>
              <Footer />
            </>
          } />
          <Route path="/privatpersonen" element={
            <>
              <Header />
              <main><Privatpersonen /></main>
              <Footer />
            </>
          } />
          <Route path="/unternehmen" element={
            <>
              <Header />
              <main><Unternehmen /></main>
              <Footer />
            </>
          } />
          <Route path="/digitale-zusammenarbeit" element={
            <>
              <Header />
              <main><DigitaleZusammenarbeit /></main>
              <Footer />
            </>
          } />
          <Route path="/kontakt" element={
            <>
              <Header />
              <main><Contact /></main>
              <Footer />
            </>
          } />
          <Route path="/agb" element={
            <>
              <Header />
              <main><AGB /></main>
              <Footer />
            </>
          } />
          <Route path="/impressum" element={
            <>
              <Header />
              <main><Impressum /></main>
              <Footer />
            </>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/messages" element={
            <ProtectedRoute>
              <MessageList />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <EmailSettings />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
