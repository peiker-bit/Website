import React from 'react';
import { Calculator, TrendingUp, Users, FileText, PieChart, Briefcase, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from './ui/ScrollReveal';

const services = [
  {
    icon: <TrendingUp size={32} />,
    title: 'Finanzbuchhaltung',
    desc: 'Ich erstelle deine laufende Finanzbuchhaltung inklusive aussagekräftiger Auswertungen, damit du jederzeit weißt, wo dein Unternehmen steht und fundierte Entscheidungen treffen kannst.'
  },
  {
    icon: <Calculator size={32} />,
    title: 'Jahresabschlüsse & Steuererklärungen',
    desc: 'Ob Einnahmen-Überschuss-Rechnung oder Jahresabschluss: Ich erstelle deine Abschlüsse präzise, fristgerecht und mit Blick auf steuerliche Optimierungsmöglichkeiten.'
  },
  {
    icon: <Users size={32} />,
    title: 'Lohn- und Gehaltsabrechnung',
    desc: 'Zuverlässige Lohnabrechnungen, korrekte Meldungen und rechtssichere Abwicklung – damit du dich auf dein Team und dein Unternehmen konzentrieren kannst.'
  },
  {
    icon: <Briefcase size={32} />,
    title: 'Steuerliche Beratung & Gestaltung',
    desc: 'Ich berate dich nicht nur rückblickend, sondern vorausschauend. Gemeinsam entwickeln wir steuerliche Strategien, die zu deiner persönlichen oder unternehmerischen Situation passen.'
  },
  {
    icon: <PieChart size={32} />,
    title: 'Betriebswirtschaftliche Beratung',
    desc: 'Zahlen allein reichen nicht. Ich helfe dir, deine betriebswirtschaftlichen Kennzahlen zu verstehen und sinnvoll für deine Planung zu nutzen.'
  },
  {
    icon: <Gift size={32} />,
    title: 'Erbschaft & Schenkung',
    desc: 'Ich unterstütze dich bei steuerlichen Fragen im Zusammenhang mit Erbschaften und Schenkungen und begleite die steuerliche Abwicklung strukturiert und nachvollziehbar.'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

const Services = () => {
  return (
    <section id="services" className="section bg-subtle">
      <div className="container">
        <ScrollReveal>
          <div className="section-header text-center">
            <h2 className="section-title">Meine Leistungen</h2>
            <p className="section-subtitle">
              Maßgeschneiderte Lösungen für deinen Erfolg – transparent, digital und persönlich.
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="services-grid"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={item}
              className="service-card group"
            >
              <div className="card-content">
                <div className="icon-wrapper">
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
              <div className="card-border-gradient" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        .bg-subtle {
          background-color: var(--color-bg-subtle);
        }

        .section-header {
          margin-bottom: 5rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .section-title {
          font-size: var(--text-4xl);
          margin-bottom: 1.5rem;
          color: var(--color-primary);
          position: relative;
          display: inline-block;
        }
        
        /* Optional: aesthetic underline for title */
        .section-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 4px;
          background: var(--gradient-accent);
          border-radius: var(--radius-full);
        }

        .section-subtitle {
          color: var(--color-text-muted);
          font-size: 1.25rem;
          line-height: 1.6;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2.5rem;
        }

        .service-card {
          background: white;
          border-radius: var(--radius-2xl);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          height: 100%;
          border: 1px solid rgba(226, 232, 240, 0.8);
          display: flex;
          flex-direction: column;
        }

        .card-content {
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          height: 100%;
          z-index: 2;
          position: relative;
        }

        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          border-color: rgba(6, 182, 212, 0.3);
        }

        .icon-wrapper {
          width: 64px;
          height: 64px;
          background: var(--color-bg-subtle);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-xl);
          margin-bottom: 2rem;
          transition: all 0.4s ease;
          position: relative;
          z-index: 1;
        }
        
        /* Cool effect: Icon wrapper gets gradient on hover */
        .service-card:hover .icon-wrapper {
          background: var(--gradient-accent);
          color: white;
          transform: scale(1.1) rotate(-3deg);
          box-shadow: 0 10px 20px rgba(6, 182, 212, 0.25);
        }

        .service-card h3 {
          margin-bottom: 1rem;
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--color-primary);
          line-height: 1.3;
        }

        .service-card p {
          color: var(--color-text-muted);
          font-size: 1.05rem;
          line-height: 1.7;
          flex-grow: 1;
          margin-bottom: 0;
        }
        
        /* Gradient border effect at bottom */
        .card-border-gradient {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: var(--gradient-accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }
        
        .service-card:hover .card-border-gradient {
          transform: scaleX(1);
        }

        @media (max-width: 640px) {
            .services-grid {
              grid-template-columns: 1fr;
              gap: 1.5rem;
            }
            
            .service-card {
                padding: 0;
                border-radius: var(--radius-xl);
            }
            .card-content {
              padding: 2rem;
            }
        }
      `}</style>
    </section>
  );
};

export default Services;
