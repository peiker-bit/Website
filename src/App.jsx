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

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leistungen" element={<ServicesPage />} />
            <Route path="/lohn" element={<Payroll />} />
            <Route path="/privatpersonen" element={<Privatpersonen />} />
            <Route path="/unternehmen" element={<Unternehmen />} />
            <Route path="/digitale-zusammenarbeit" element={<DigitaleZusammenarbeit />} />
            <Route path="/kontakt" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
