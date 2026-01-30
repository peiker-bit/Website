import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from './ui/ScrollReveal';
import { supabase } from '../lib/supabaseClient';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    confirm_email: '' // Honeypot
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [mountTime, setMountTime] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    setMountTime(Date.now());
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Clear validation error when user starts typing
    if (validationErrors[e.target.id]) {
      setValidationErrors({ ...validationErrors, [e.target.id]: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    // 1. Honeypot Check
    if (formData.confirm_email) {
      console.log('Bot detected: Honeypot filled.');
      // Fake success to fool bot
      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000);
      return;
    }

    // 2. Time Check (Minimum 2 seconds)
    const timeDiff = Date.now() - mountTime;
    if (timeDiff < 2000) {
      console.log('Bot detected: Submitted too fast.');
      setStatus('success'); // Fake success
      setTimeout(() => setStatus('idle'), 5000);
      return;
    }

    // 3. Validation - Mark missing fields in red
    const errors = {};
    if (!formData.name) errors.name = true;
    if (!formData.email) errors.email = true;
    if (!formData.message) errors.message = true;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setStatus('idle');
      return;
    }

    // Clear any previous validation errors
    setValidationErrors({});

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          { name: formData.name, email: formData.email, message: formData.message }
        ]);

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', message: '', confirm_email: '' });
      setTimeout(() => setStatus('idle'), 5000); // Reset status after 5s
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section bg-light">
      <div className="container">
        <div className="contact-wrapper">
          <div className="contact-info">
            <ScrollReveal>
              <h2 className="section-title">Kontakt aufnehmen</h2>
              <p>
                Lass uns über deine steuerlichen Themen sprechen.<br />
                In einem unverbindlichen Erstgespräch verschaffen wir uns gemeinsam einen Überblick und klären, wie ich dich unterstützen kann.
              </p>
            </ScrollReveal>

            <div className="info-cards">
              {[
                { icon: <Phone size={24} />, title: "Telefon", desc: "0741 / 206 88 800" },
                { icon: <Mail size={24} />, title: "E-Mail", desc: "Kontakt@Peiker-Steuerberatung.de" },
                { icon: <MapPin size={24} />, title: "Standort", desc: <>Hauptstraße 34<br />78628 Rottweil</> }
              ].map((item, index) => (
                <ScrollReveal key={index} delay={0.2 + (index * 0.1)}>
                  <motion.div
                    className="info-card"
                    whileHover={{ x: 10, backgroundColor: "white" }}
                  >
                    <div className="icon-box">{item.icon}</div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="contact-form-container"
          >
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Ihr Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className={validationErrors.name ? 'error' : ''}
                />
              </div>

              {/* Honeypot Field - Hidden */}
              <div className="form-group" style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
                <label htmlFor="confirm_email">Bitte nicht ausfüllen</label>
                <input
                  type="text"
                  id="confirm_email"
                  value={formData.confirm_email}
                  onChange={handleChange}
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-Mail</label>
                <input
                  type="email"
                  id="email"
                  placeholder="ihre@email.de"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className={validationErrors.email ? 'error' : ''}
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Nachricht</label>
                <textarea
                  id="message"
                  rows="4"
                  placeholder="Wie können wir Ihnen helfen?"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className={validationErrors.message ? 'error' : ''}
                ></textarea>
              </div>

              {status === 'error' && (
                <div style={{ color: 'red', marginBottom: '1rem' }}>
                  Es gab einen Fehler beim Senden. Bitte versuchen Sie es später erneut oder rufen Sie an.
                </div>
              )}

              {Object.keys(validationErrors).length > 0 && (
                <div className="validation-warning">
                  Bitte füllen Sie alle Felder aus.
                </div>
              )}

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="success-message"
                  style={{ color: 'green', fontWeight: 'bold', padding: '1rem', background: '#e6ffe6', borderRadius: '8px', textAlign: 'center' }}
                >
                  Vielen Dank! Ihre Nachricht wurde gesendet.
                </motion.div>
              ) : (
                <motion.button
                  type="submit"
                  className="btn btn-primary full-width"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={status === 'loading'}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={18} className="spin-anim" style={{ marginRight: '8px' }} /> Wird gesendet...
                    </>
                  ) : (
                    <>
                      Nachricht senden <Send size={18} style={{ marginLeft: '8px' }} />
                    </>
                  )}
                </motion.button>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      <style>{`
        .contact-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: flex-start;
        }

        .spin-anim {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .contact-info h2 {
          font-size: var(--text-4xl);
          margin-bottom: 1rem;
        }

        .contact-info p {
          color: var(--color-text-muted);
          margin-bottom: 3rem;
          font-size: 1.125rem;
        }

        .info-cards {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .info-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          background: white;
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-border);
          transition: all var(--transition-normal);
        }
        
        .info-card:hover {
            border-color: var(--color-accent-light);
            box-shadow: var(--shadow-md);
            transform: translateX(10px);
        }

        .icon-box {
          width: 56px;
          height: 56px;
          background: var(--color-bg-subtle);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
          transition: all var(--transition-normal);
        }
        
        .info-card:hover .icon-box {
            background: var(--color-accent);
            color: white;
        }

        .info-card h3 {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
          font-weight: 700;
        }

        .info-card p {
          margin: 0;
          font-size: 1rem;
          color: var(--color-text-main);
        }

        .contact-form-container {
          background: white;
          padding: 3rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--col-border);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--color-primary);
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 1rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          font-size: 1rem;
          transition: all var(--transition-fast);
          background: var(--color-bg-subtle);
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-light);
          background: white;
        }

        .form-group input.error,
        .form-group textarea.error {
          border-color: #dc3545;
          background-color: #fff5f5;
        }

        .form-group input.error:focus,
        .form-group textarea.error:focus {
          border-color: #dc3545;
          box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15);
        }

        .validation-warning {
          color: #dc3545;
          font-weight: 600;
          text-align: center;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: #fff5f5;
          border-radius: var(--radius-lg);
          border: 1px solid #dc3545;
        }

        .full-width {
          width: 100%;
        }

        @media (max-width: 968px) {
          .contact-wrapper {
            grid-template-columns: 1fr;
            gap: 4rem;
          }

          .contact-form-container {
             padding: 2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
