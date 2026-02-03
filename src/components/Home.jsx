import React from 'react';
import Hero from './Hero';
import Services from './Services';
import About from './About';
import SEO from './SEO';
import Contact from './Contact';

const Home = () => {
    return (
        <>
            <SEO
                title="Startseite"
                description="Peiker Steuerberatung in Berlin - Ihr Partner für Steuererklärung, Lohnbuchhaltung und digitale Zusammenarbeit. Kompetent, persönlich und digital."
                url="/"
            />
            <div className="home">
                <Hero />
                <Services />
                <About />
            </div>
            <Contact />
        </>
    );
};

export default Home;
