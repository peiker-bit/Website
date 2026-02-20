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
import Datenschutz from './components/Datenschutz';

// Admin components
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import MessageList from './components/admin/MessageList';
import BookingList from './components/admin/BookingList';
import Settings from './components/admin/Settings';
import TerminToolSettings from './components/admin/TerminToolSettings';
import ProtectedRoute from './components/admin/ProtectedRoute';
import NeumandentenList from './components/admin/NeumandentenList';
import NeumandentenDetail from './components/admin/NeumandentenDetail';

import CookieBanner from './components/CookieBanner';

function App() {
  return (
    <Router>
      <CookieBanner />
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
          <Route path="/lohnabrechnung" element={
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
          <Route path="/datenschutz" element={
            <>
              <Header />
              <main><Datenschutz /></main>
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
          <Route path="/admin/bookings" element={
            <ProtectedRoute>
              <BookingList />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/admin/neumandanten" element={
            <ProtectedRoute>
              <NeumandentenList />
            </ProtectedRoute>
          } />
          <Route path="/admin/neumandanten/:id" element={
            <ProtectedRoute>
              <NeumandentenDetail />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
