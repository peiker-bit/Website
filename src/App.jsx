import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Payroll from './components/Payroll';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lohn" element={<Payroll />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
