import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from './ui/ScrollReveal';

const Contact = () => {
  return (
    <section id="contact" className="section bg-light">
      <div className="container">
        <div className="contact-wrapper">
          <div className="contact-info">
            <ScrollReveal>
              <h2>Kontakt aufnehmen</h2>
              <p>
                Lassen Sie uns über Ihre Zukunft sprechen. Vereinbaren Sie einen unverbindlichen Ersttermin.
              </p>
            </ScrollReveal>

            <div className="info-cards">
              {[
                { icon: <Phone size={24} />, title: "Telefon", desc: "0123 / 456 789" },
                { icon: <Mail size={24} />, title: "E-Mail", desc: "info@peiker-steuerberatung.de" },
                { icon: <MapPin size={24} />, title: "Standort", desc: <>Musterstraße 123<br />12345 Musterstadt</> }
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
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Ihr Name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">E-Mail</label>
                <input type="email" id="email" placeholder="ihre@email.de" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Nachricht</label>
                <textarea id="message" rows="4" placeholder="Wie können wir Ihnen helfen?"></textarea>
              </div>
              <motion.button
                type="submit"
                className="btn btn-primary full-width"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Nachricht senden <Send size={18} style={{ marginLeft: '8px' }} />
              </motion.button>
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

        .contact-info h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .contact-info p {
          color: var(--color-text-muted);
          margin-bottom: 3rem;
          font-size: 1.1rem;
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
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          /* cursor: pointer; removed to avoid confusion if not clickable */
        }

        .icon-box {
          width: 50px;
          height: 50px;
          background: var(--color-bg-light);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .info-card h3 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .info-card p {
          margin: 0;
          font-size: 0.95rem;
          color: var(--color-text-main);
        }

        .contact-form-container {
          background: white;
          padding: 3rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--color-primary);
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.875rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-family: var(--font-body);
          font-size: 1rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(0, 163, 255, 0.1);
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
