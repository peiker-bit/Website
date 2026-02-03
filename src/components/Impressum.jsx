import React, { useEffect } from 'react';
import SEO from './SEO';

const Impressum = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="impressum-page">
            <SEO
                title="Impressum"
                description="Impressum der Peiker Steuerberatung. Angaben gemäß § 5 TMG."
                url="/impressum"
                robots="noindex, follow"
            />
            <div className="container">
                <div className="impressum-content">
                    <h1>Impressum</h1>

                    <div className="impressum-section">
                        <h2>Patrick Peiker | Steuerberater</h2>
                        <p>
                            Patrick Peiker<br />
                            Bachelor of Laws, LL.B. (Wirtschaftsrecht)<br />
                            Steuerberater
                        </p>
                        <p>
                            Hauptstraße 34<br />
                            1. OG<br />
                            78628 Rottweil
                        </p>
                        <p>
                            Telefon: <a href="tel:074120688800">0741/2068880-0</a><br />
                            Fax: 0741/2068880-9<br />
                            Web: <a href="https://Peiker-Steuerberatung.de" target="_blank" rel="noopener noreferrer">Peiker-Steuerberatung.de</a><br />
                            Mail: <a href="mailto:Kontakt@Peiker-Steuerberatung.de">Kontakt@Peiker-Steuerberatung.de</a>
                        </p>
                        <p>
                            USt.-ID-Nr.: DE305 896 091
                        </p>
                    </div>

                    <div className="impressum-section">
                        <h3>Berufshaftungspflichtversicherung:</h3>
                        <p>R+V Allgemeine Versicherung AG</p>
                    </div>

                    <div className="impressum-section">
                        <h3>Zuständige Aufsichtsbehörde:</h3>
                        <p>
                            Steuerberaterkammer Südbaden<br />
                            Wentzingerstraße 19<br />
                            79106 Freiburg i.Br
                        </p>
                    </div>

                    <div className="impressum-section">
                        <h3>Berufsrechtliche Regelungen:</h3>
                        <ul>
                            <li>Steuerberatungsgesetz (StBerG)</li>
                            <li>Durchführungsverordnung zum Steuerberatungsgesetz (DVStB)</li>
                            <li>Steuerberatervergütungsverordnung (StBVV)</li>
                            <li>Berufsordnung für Steuerberater (BOStB)</li>
                        </ul>
                    </div>



                    <section>
                        <h3>1. Haftungsausschluss</h3>
                        <p>
                            Der Autor übernimmt keinerlei Gewähr für die Aktualität, Korrektheit, Vollständigkeit oder Qualität der bereitgestellten Informationen. Haftungsansprüche gegen den Autor, welche sich auf Schäden materieller oder ideeller Art beziehen, die durch die Nutzung oder Nichtnutzung der dargebotenen Informationen bzw. durch die Nutzung fehlerhafter und unvollständiger Informationen verursacht wurden, sind grundsätzlich ausgeschlossen, sofern seitens des Autors kein nachweislich vorsätzliches oder grob fahrlässiges Verschulden vorliegt.
                        </p>
                        <p>
                            Alle Angebote sind freibleibend und unverbindlich. Der Autor behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.
                        </p>
                    </section>

                    <section>
                        <h3>2. Verweise und Links</h3>
                        <p>
                            Bei direkten oder indirekten Verweisen auf fremde Webseiten („Hyperlinks“), die außerhalb des Verantwortungsbereiches des Autors liegen, würde eine Haftungsverpflichtung ausschließlich in dem Fall in Kraft treten, in dem der Autor von den Inhalten Kenntnis hat und es ihm technisch möglich und zumutbar wäre, die Nutzung im Falle rechtswidriger Inhalte zu verhindern.
                        </p>
                        <p>
                            Der Autor erklärt hiermit ausdrücklich, dass zum Zeitpunkt der Linksetzung keine illegalen Inhalte auf den zu verlinkenden Seiten erkennbar waren. Auf die aktuelle und zukünftige Gestaltung, die Inhalte oder die Urheberschaft der verlinkten/verknüpften Seiten hat der Autor keinerlei Einfluss. Deshalb distanziert er sich hiermit ausdrücklich von allen Inhalten aller verlinkten /verknüpften Seiten, die nach der Linksetzung verändert wurden. Diese Feststellung gilt für alle innerhalb des eigenen Internetangebotes gesetzten Links und Verweise sowie für Fremdeinträge in vom Autor eingerichteten Gästebüchern, Diskussionsforen, Linkverzeichnissen, Mailinglisten und in allen anderen Formen von Datenbanken, auf deren Inhalt externe Schreibzugriffe möglich sind. Für illegale, fehlerhafte oder unvollständige Inhalte und insbesondere für Schäden, die aus der Nutzung oder Nichtnutzung solcherart dargebotener Informationen entstehen, haftet allein der Anbieter der Seite, auf welche verwiesen wurde, nicht derjenige, der über Links auf die jeweilige Veröffentlichung lediglich verweist.
                        </p>
                    </section>

                    <section>
                        <h3>3. Urheber- und Kennzeichenrecht</h3>
                        <p>
                            Der Autor ist bestrebt, in allen Publikationen die Urheberrechte der verwendeten Bilder, Grafiken, Tondokumente, Videosequenzen und Texte zu beachten, von ihm selbst erstellte Bilder, Grafiken, Tondokumente, Videosequenzen und Texte zu nutzen oder auf lizenzfreie Grafiken, Tondokumente, Videosequenzen und Texte zurückzugreifen. Alle innerhalb des Internetangebotes genannten und ggf. durch Dritte geschützten Marken- und Warenzeichen unterliegen uneingeschränkt den Bestimmungen des jeweils gültigen Kennzeichenrechts und den Besitzrechten der jeweiligen eingetragenen Eigentümer. Allein aufgrund der bloßen Nennung ist nicht der Schluss zu ziehen, dass Markenzeichen nicht durch Rechte Dritter geschützt sind!
                        </p>
                        <p>
                            Das Copyright für veröffentlichte, vom Autor selbst erstellte Objekte bleibt allein beim Autor der Seiten. Eine Vervielfältigung oder Verwendung solcher Grafiken, Tondokumente, Videosequenzen und Texte in anderen elektronischen oder gedruckten Publikationen ist ohne ausdrückliche Zustimmung des Autors nicht gestattet.
                        </p>
                    </section>

                </div>
            </div>

            <style jsx>{`
                .impressum-page {
                    padding: 8rem 0 4rem;
                    background-color: #f8fafc;
                    min-height: 80vh;
                }
                .impressum-content {
                    background: white;
                    padding: 3rem;
                    border-radius: var(--radius-lg);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                    max-width: 900px;
                    margin: 0 auto;
                }
                h1 {
                    color: var(--color-primary);
                    font-size: 2rem;
                    margin-bottom: 2rem;
                    text-align: center;
                }
                h2 {
                    color: var(--color-text);
                    font-size: 1.5rem;
                    margin-bottom: 1.5rem;
                    font-weight: 600;
                }
                h3 {
                    color: var(--color-primary);
                    font-size: 1.15rem;
                    margin: 2rem 0 0.75rem;
                    font-weight: 600;
                }
                p {
                    color: var(--color-text);
                    line-height: 1.7;
                    margin-bottom: 1rem;
                    font-size: 0.95rem;
                }
                a {
                    color: var(--color-accent);
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
                .impressum-section {
                    margin-bottom: 2rem;
                }
                ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin-bottom: 1rem;
                }
                li {
                    color: var(--color-text);
                    line-height: 1.6;
                    margin-bottom: 0.5rem;
                }
                @media (max-width: 768px) {
                    .impressum-content {
                        padding: 1.5rem;
                    }
                    .impressum-page {
                        padding-top: 6rem;
                    }
                    h1 {
                        font-size: 1.75rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Impressum;
