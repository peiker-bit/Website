import React from 'react';
import { Calculator, TrendingUp, Users, FileText, PieChart, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from './ui/ScrollReveal';

const services = [
  {
    icon: <Calculator size={32} />,
    title: 'Steuererklärung',
    desc: 'Professionelle Erstellung Ihrer Einkommensteuererklärung für Arbeitnehmer, Rentner und Vermieter.'
  },
  {
    icon: <Briefcase size={32} />,
    title: 'Jahresabschluss',
    desc: 'Erstellung von Jahresabschlüssen und Gewinnermittlungen nach Handels- und Steuerrecht.'
  },
  {
    icon: <TrendingUp size={32} />,
    title: 'Finanzbuchhaltung',
    desc: 'Digitale Buchführung mit DATEV Unternehmen online – effizient und papierlos.'
  },
  {
    icon: <Users size={32} />,
    title: 'Lohnbuchhaltung',
    desc: 'Zuverlässige Lohn- und Gehaltsabrechnungen inkl. aller Meldungen.'
  },
  {
    icon: <PieChart size={32} />,
    title: 'Betriebswirtschaft',
    desc: 'Analyse Ihrer Zahlen und Beratung zur Unternehmenssteuerung und Liquidität.'
  },
  {
    icon: <FileText size={32} />,
    title: 'Gründungsberatung',
    desc: 'Starten Sie erfolgreich in die Selbstständigkeit mit unserem Gründer-Coaching.'
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
    <section id="services" className="section bg-light">
      <div className="container">
        <ScrollReveal>
          <div className="section-header text-center">
            <h2 className="section-title">Unsere Leistungen</h2>
            <p className="section-subtitle">
              Wir bieten Ihnen das komplette Spektrum moderner Steuerberatung. Digital, persönlich und verständlich.
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
              className="service-card"
              whileHover={{
                y: -5,
                boxShadow: "0 20px 40px -5px rgba(14, 42, 71, 0.05)"
              }}
            >
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        .bg-light {
          background-color: var(--color-bg-subtle);
        }

        .section-header {
          margin-bottom: 4rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .section-title {
          font-size: var(--text-4xl);
          margin-bottom: 1rem;
        }

        .section-subtitle {
          color: var(--color-text-muted);
          font-size: 1.125rem;
          line-height: 1.6;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .service-card {
          background: white;
          padding: 2.5rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-normal);
          border: 1px solid var(--color-border);
          position: relative;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .service-card:hover {
          border-color: var(--color-accent-light);
          transform: translateY(-5px);
          box-shadow: var(--shadow-xl);
        }

        .service-icon {
          width: 56px;
          height: 56px;
          background: var(--color-bg-subtle);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          transition: all var(--transition-normal);
        }

        .service-card:hover .service-icon {
          background: var(--color-accent);
          color: white;
          transform: rotate(-5deg) scale(1.1);
          box-shadow: var(--shadow-glow);
        }

        .service-card h3 {
          margin-bottom: 1rem;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .service-card p {
          color: var(--color-text-muted);
          font-size: 1rem;
          line-height: 1.6;
          flex-grow: 1;
        }
      `}</style>
    </section>
  );
};

export default Services;
