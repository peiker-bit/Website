import React, { useEffect } from 'react';
import SEO from './SEO';

const Datenschutz = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="datenschutz-page">
            <SEO
                title="Datenschutz"
                description="Datenschutzerklärung der Peiker Steuerberatung. Informationen zur Erhebung und Verarbeitung Ihrer personenbezogenen Daten."
                url="/datenschutz"
                keywords="Datenschutz, Datenschutzerklärung, DSGVO, Privatsphäre, Datenverarbeitung"
            />
            <div className="container">
                <div className="datenschutz-content">
                    <h1>Datenschutzerklärung</h1>

                    <section>
                        <h2>Anbieter und verantwortliche Stelle im Sinne des Datenschutzgesetzes</h2>
                        <p>
                            PEIKER | Steuerberatung<br />
                            Patrick Peiker<br />
                            Hauptstraße 34<br />
                            78628 Rottweil
                        </p>
                    </section>

                    <section>
                        <h2>Geltungsbereich</h2>
                        <p>
                            Nutzer erhalten mit dieser Datenschutzerklärung Information über die Art, den Umfang und Zweck der Erhebung und Verwendung ihrer Daten durch den verantwortlichen Anbieter erhoben und verwendet werden.
                        </p>
                        <p>
                            Den rechtlichen Rahmen für den Datenschutz bilden das Bundesdatenschutzgesetz (BDSG) und das Telemediengesetz (TMG).
                        </p>
                    </section>

                    <section>
                        <h2>Erfassung allgemeiner Informationen</h2>
                        <p>
                            Mit jedem Zugriff auf dieses Angebot werden durch uns bzw. den Webspace-Provider automatisch Informationen erfasst. Diese Informationen, auch als Server-Logfiles bezeichnet, sind allgemeiner Natur und erlauben keine Rückschlüsse auf Ihre Person.
                        </p>
                        <p>
                            Erfasst werden unter anderem: Name der Webseite, Datei, Datum, Datenmenge, Webbrowser und Webbrowser-Version, Betriebssystem, der Domainname Ihres Internet-Providers, die sogenannte Referrer-URL (jene Seite, von der aus Sie auf unser Angebot zugegriffen haben) und die IP-Adresse.
                        </p>
                        <p>
                            Ohne diese Daten wäre es technisch teils nicht möglich, die Inhalte der Webseite auszuliefern und darzustellen. Insofern ist die Erfassung der Daten zwingend notwendig. Darüber hinaus verwenden wir die anonymen Informationen für statistische Zwecke. Sie helfen uns bei der Optimierung des Angebots und der Technik. Wir behalten uns zudem das Recht vor, die Log-Files bei Verdacht auf eine rechtswidrige Nutzung unseres Angebotes nachträglich zu kontrollieren.
                        </p>
                    </section>

                    <section>
                        <h2>Erbringung kostenpflichtiger Leistungen</h2>
                        <p>
                            Damit wir kostenpflichtige Leistungen erbringen können, fragen wir zusätzliche Daten ab. Das gilt zum Beispiel für die Angaben zur Zahlung.
                        </p>
                        <p>
                            Damit die Sicherheit Ihrer Daten während der Übertragung gewährleistet ist, arbeiten wir mit Verschlüsselungsverfahren (etwa SSL) über HTTPS, die den aktuellen Stand der Technik widerspiegeln.
                        </p>
                    </section>

                    <section>
                        <h2>Kontaktformular</h2>
                        <p>
                            Wenn Sie uns über das Onlineformular oder per E-Mail kontaktieren, speichern wir die von Ihnen gemachten Angaben, um Ihre Anfrage beantworten und mögliche Anschlussfragen stellen zu können.
                        </p>
                    </section>

                    <section>
                        <h2>Einbindung von Diensten und Inhalten Dritter</h2>
                        <p>
                            Unser Angebot umfasst mitunter Inhalte, Dienste und Leistungen anderer Anbieter. Das sind zum Beispiel Karten, die von Google-Maps zur Verfügung gestellt werden, Videos von YouTube sowie Grafiken und Bilder anderer Webseiten. Damit diese Daten im Browser des Nutzers aufgerufen und dargestellt werden können, ist die Übermittlung der IP-Adresse zwingend notwendig. Die Anbieter (im Folgenden als „Dritt-Anbieter“ bezeichnet) nehmen also die IP-Adresse des jeweiligen Nutzers wahr.
                        </p>
                        <p>
                            Auch wenn wir bemüht sind, ausschließlich Dritt-Anbieter zu nutzen, welche die IP-Adresse nur benötigen, um Inhalte ausliefern zu können, haben wir keinen Einfluss darauf, ob die IP-Adresse möglicherweise gespeichert wird. Dieser Vorgang dient in dem Fall unter anderem statistischen Zwecken. Sofern wir Kenntnis davon haben, dass die IP-Adresse gespeichert wird, weisen wir unsere Nutzer darauf hin.
                        </p>
                    </section>

                    <section>
                        <h2>Cookies</h2>
                        <p>
                            Diese Webseite verwendet sogenannte Cookies. Das sind Textdateien, die vom Server aus auf Ihrem Rechner gespeichert werden. Sie enthalten Informationen zum Browser, zur IP-Adresse, dem Betriebssystem und zur Internetverbindung. Diese Daten werden von uns nicht an Dritte weitergegeben oder ohne ihre Zustimmung mit personenbezogenen Daten verknüpft.
                        </p>
                        <p>
                            Cookies erfüllen vor allem zwei Aufgaben. Sie helfen uns, Ihnen die Navigation durch unser Angebot zu erleichtern, und ermöglichen die korrekte Darstellung der Webseite. Sie werden nicht dazu genutzt, Viren einzuschleusen oder Programme zu starten.
                        </p>
                        <p>
                            Nutzer haben die Möglichkeit, unser Angebot auch ohne Cookies aufzurufen. Dazu müssen im Browser die entsprechenden Einstellungen geändert werden. Informieren Sie sich bitte über die Hilfsfunktion Ihres Browsers, wie Cookies deaktiviert werden. Wir weisen allerdings darauf hin, dass dadurch einige Funktionen dieser Webseite möglicherweise beeinträchtigt werden und der Nutzungskomfort eingeschränkt wird. Die Seiten <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">http://www.aboutads.info/choices/</a> (USA) und <a href="http://www.youronlinechoices.com/uk/your-ad-choices/" target="_blank" rel="noopener noreferrer">http://www.youronlinechoices.com/uk/your-ad-choices/</a> (Europa) erlauben es Ihnen, Online-Anzeigen-Cookies zu verwalten.
                        </p>
                    </section>

                    <section>
                        <h2>Verwendung von Google Analytics</h2>
                        <p>
                            Diese Webseite benutzt Google Analytics, einen Webanalysedienst der Google Inc. (“Google”). Google Analytics verwendet sog. “Cookies”, Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Webseite durch Sie ermöglichen. Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieser Webseite werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert. Aufgrund der Aktivierung der IP-Anonymisierung auf diesen Webseiten, wird Ihre IP-Adresse von Google jedoch innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum zuvor gekürzt. Nur in Ausnahmefällen wird die volle IP-Adresse an einen Server von Google in den USA übertragen und dort gekürzt.
                        </p>
                        <p>
                            Im Auftrag des Betreibers dieser Webseite wird Google diese Informationen benutzen, um Ihre Nutzung der Webseite auszuwerten, um Reports über die Webseitenaktivitäten zusammenzustellen und um weitere mit der Webseitennutzung und der Internetnutzung verbundene Dienstleistungen gegenüber dem Webseitenbetreiber zu erbringen. Die im Rahmen von Google Analytics von Ihrem Browser übermittelte IP-Adresse wird nicht mit anderen Daten von Google zusammengeführt. Sie können die Speicherung der Cookies durch eine entsprechende Einstellung Ihrer Browser-Software verhindern. Wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Webseite vollumfänglich werden nutzen können.
                        </p>
                        <p>
                            Sie können darüber hinaus die Erfassung der durch das Cookie erzeugten und auf Ihre Nutzung der Webseite bezogenen Daten (inkl. Ihrer IP-Adresse) an Google sowie die Verarbeitung dieser Daten durch Google verhindern, indem sie das unter dem folgenden Link verfügbare Browser-Plugin herunterladen und installieren: Browser Add On zur Deaktivierung von Google Analytics.
                        </p>
                        <p>
                            Nähere Informationen zu Nutzungsbedingungen und Datenschutz finden Sie unter <a href="http://www.google.com/analytics/terms/de.html" target="_blank" rel="noopener noreferrer">http://www.google.com/analytics/terms/de.html</a> bzw. unter <a href="https://www.google.de/intl/de/policies/" target="_blank" rel="noopener noreferrer">https://www.google.de/intl/de/policies/</a>.
                        </p>
                    </section>

                    <section>
                        <h2>Google AdWords</h2>
                        <p>
                            Diese Webseite nutzt das Online-Werbeprogramm „Google AdWords“ und im Rahmen dessen das Conversion-Tracking. Dabei wird von Google Adwords ein Cookie auf Ihrem Rechner gesetzt, sofern Sie über eine Google-Anzeige auf unsere Webseite gelangt sind. Diese Cookies verlieren nach 30 Tagen ihre Gültigkeit und dienen nicht der persönlichen Identifizierung. Besucht der Nutzer bestimmte Seiten unserer Webseite und das Cookie ist noch nicht abgelaufen, können wir und Google erkennen, dass der Nutzer auf die Anzeige geklickt hat und zu dieser Seite weitergeleitet wurde. Jeder Google AdWords-Kunde erhält ein anderes Cookie. Cookies können somit nicht über die Webseiten von AdWords-Kunden nachverfolgt werden.
                        </p>
                        <p>
                            Die mit Hilfe des Conversion-Cookies eingeholten Informationen dienen dazu Conversion-Statistiken für AdWords-Kunden zu erstellen, die sich für Conversion-Tracking entschieden haben. Die Kunden erfahren die Gesamtanzahl der Nutzer, die auf ihre Anzeige geklickt haben und zu einer mit einem Conversion-Tracking-Tag versehenen Seite weitergeleitet wurden. Sie erhalten jedoch keine Informationen, mit denen sich Nutzer persönlich identifizieren lassen.
                        </p>
                        <p>
                            Wenn Sie nicht am Tracking-Verfahren teilnehmen möchten, können Sie das Cookie des Google Conversion-Trackings über ihren Internet-Browser unter Nutzereinstellungen leicht deaktivieren. Sie werden dann nicht in die Conversion-Tracking Statistiken aufgenommen. Mehr hierzu erfahren Sie über die Datenschutzbestimmungen von Google unter <a href="http://www.google.de/policies/privacy/" target="_blank" rel="noopener noreferrer">http://www.google.de/policies/privacy/</a>
                        </p>
                    </section>

                    <section>
                        <h2>Facebook Social Plug-in</h2>
                        <p>
                            Wir binden auf unseren Webseiten Plug-ins des sozialen Netzwerks Facebook (Anschrift: 1601 South California Avenue, Palo Alto, CA 94304, USA) ein. Sie erkennen die Plug-ins - eine Übersicht finden Sie hier: <a href="http://developers.facebook.com/docs/Plug-ins/" target="_blank" rel="noopener noreferrer">http://developers.facebook.com/docs/Plug-ins/</a> - am Like-Button (Gefällt mir) oder am Logo von Facebook.
                        </p>
                        <p>
                            Rufen Sie eine unserer Webseiten mit Facebook Plug-in auf, wird eine direkte Verbindung mit Facebook aufgebaut. Auf die Art und den Umfang der Daten, die dabei von Facebook erhoben, gespeichert und verarbeitet werden, haben wir keinen Einfluss. Wir können Sie lediglich entsprechend unseres Kenntnisstandes informieren.
                        </p>
                        <p>
                            Facebook wird über das Plug-in informiert, dass Sie die entsprechende Webseite unseres Angebots aufgerufen haben. Das gilt auch für Nutzer, die nicht bei Facebook registriert sind. In dem Fall besteht die Möglichkeit, dass Facebook die IP-Adresse speichert.
                        </p>
                        <p>
                            Sind Sie Mitglied bei Facebook und eingeloggt, kann der Aufruf einer Webseite mit Facebook Plug-in Ihrem Nutzerkonto bei Facebook eindeutig zugeordnet werden. Darüber hinaus übermitteln die Plug-ins alle Interaktionen, wenn Sie zum Beispiel den Like-Button nutzen oder einen Kommentar hinterlassen.
                        </p>
                        <p>
                            Um zu verhindern, dass Facebook Daten über Sie speichert, loggen Sie sich vor dem Besuch unserer Webseiten bitte bei Facebook aus. Sie können die Plug-ins darüber hinaus mit Add-ons für den Browser blocken (zum Beispiel „Facebook Blocker“).
                        </p>
                        <p>
                            Informationen zu den Datenschutzbestimmungen, dem Zweck und Umfang der Datenerfassung und Datenverarbeitung sowie den Einstellmöglichkeiten zum Schutz der Privatsphäre bei Facebook erhalten Sie hier: <a href="http://www.facebook.com/privacy/explanation.php" target="_blank" rel="noopener noreferrer">http://www.facebook.com/privacy/explanation.php</a>.
                        </p>
                    </section>

                    <section>
                        <h2>Datensparsamkeit</h2>
                        <p>
                            Personenbezogene Daten speichern wir gemäß den Grundsätzen der Datenvermeidung und Datensparsamkeit nur so lange, wie es erforderlich ist oder vom Gesetzgeber her vorgeschrieben wird (gesetzliche Speicherfrist). Entfällt der Zweck der erhobenen Informationen oder endet die Speicherfrist, sperren oder löschen wir die Daten.
                        </p>
                    </section>

                    <section>
                        <h2>Ihre Rechte auf Auskunft, Berichtigung, Sperre, Löschung und Widerspruch</h2>
                        <p>
                            Sie haben das Recht, auf Antrag unentgeltlich eine Auskunft, über die bei uns gespeicherten personenbezogenen Daten, anzufordern und/oder eine Berichtigung, Sperrung oder Löschung zu verlangen. Ausnahmen: Es handelt sich um die vorgeschriebene Datenspeicherung zur Geschäftsabwicklung oder die Daten unterliegen der gesetzlichen Aufbewahrungspflicht.
                        </p>
                        <p>
                            Für diese Zwecke kontaktieren Sie bitte unseren Datenschutzbeauftragen (Kontaktdaten: am Ende der Datenschutzerklärung).
                        </p>
                        <p>
                            Um eine Datensperre jederzeit berücksichtigen zu können, ist es erforderlich, die Daten für Kontrollzwecke in einer Sperrdatei vorzuhalten. Besteht keine gesetzliche Archivierungspflicht, können Sie auch die Löschung der Daten verlangen. Anderenfalls sperren wir die Daten, sofern Sie dies wünschen.
                        </p>
                    </section>

                    <section>
                        <h2>Änderung unserer Datenschutzerklärung</h2>
                        <p>
                            Um zu gewährleisten, dass unsere Datenschutzerklärung stets den aktuellen gesetzlichen Vorgaben entspricht, behalten wir uns jederzeit Änderungen vor. Das gilt auch für den Fall, dass die Datenschutzerklärung aufgrund neuer oder überarbeiteter Leistungen, zum Beispiel neuer Serviceleistungen, angepasst werden muss. Die neue Datenschutzerklärung greift dann bei Ihrem nächsten Besuch auf unserem Angebot.
                        </p>
                        <p className="source">
                            Quelle: <a href="https://www.mein-datenschutzbeauftragter.de" target="_blank" rel="noopener noreferrer">Datenschutz-Konfigurator von mein-datenschutzbeauftragter.de</a>
                        </p>
                    </section>
                </div>
            </div>

            <style jsx>{`
                .datenschutz-page {
                    padding: 8rem 0 4rem;
                    background-color: #f8fafc;
                    min-height: 80vh;
                }
                .datenschutz-content {
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
                    margin-top: 2rem;
                }
                section:first-of-type h2 {
                    margin-top: 0;
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
                section {
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
                .source {
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                    margin-top: 2rem;
                    border-top: 1px solid #eee;
                    padding-top: 1rem;
                }
                @media (max-width: 768px) {
                    .datenschutz-content {
                        padding: 1.5rem;
                    }
                    .datenschutz-page {
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

export default Datenschutz;
