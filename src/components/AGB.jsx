import React, { useEffect } from 'react';

const AGB = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="agb-page">
            <div className="container">
                <div className="agb-content">
                    <h1>Allgemeine Geschäftsbedingungen</h1>
                    <h2>für Steuerberater und steuerberatende Berufsausübungsgesellschaften</h2>
                    <p className="stand">Stand: Oktober 2023</p>

                    <p>
                        Die folgenden „Allgemeinen Geschäftsbedingungen“ gelten für Verträge<sup>1)</sup> zwischen Steuerberatern<sup>2)</sup> und steuerberatenden Berufsausübungsgesellschaften (im Folgenden „Steuerberater“ genannt) und ihren Auftraggebern, soweit nicht etwas anderes ausdrücklich in Textform vereinbart oder gesetzlich zwingend vorgeschrieben ist.
                    </p>

                    <section>
                        <h3>1. Umfang und Ausführung des Auftrags</h3>
                        <p>(1) Für den Umfang der vom Steuerberater zu erbringenden Leistungen ist der erteilte Auftrag maßgebend. Der Auftrag wird nach den Grundsätzen ordnungsgemäßer Berufsausübung unter Beachtung der einschlägigen berufsrechtlichen Normen und der Berufspflichten (vgl. StBerG, BOStB) ausgeführt.</p>
                        <p>(2) Die Berücksichtigung ausländischen Rechts bedarf einer ausdrücklichen Vereinbarung in Textform.</p>
                        <p>(3) Ändert sich die Rechtslage nach abschließender Erledigung einer Angelegenheit, so ist der Steuerberater nicht verpflichtet, den Auftraggeber auf die Änderung oder die sich daraus ergebenden Folgen hinzuweisen.</p>
                        <p>(4) Die Prüfung der Richtigkeit, Vollständigkeit und Ordnungsmäßigkeit der dem Steuerberater übergebenen Unterlagen und Zahlen, insbesondere der Buchführung und Bilanz, gehört nur zum Auftrag, wenn dies in Textform vereinbart ist. Der Steuerberater wird die vom Auftraggeber gemachten Angaben, insbesondere Zahlenangaben, als richtig zu Grunde legen. Soweit er offensichtliche Unrichtigkeiten feststellt, wird er den Auftraggeber darauf hinweisen.</p>
                        <p>(5) Der Auftrag stellt keine Vollmacht für die Vertretung vor Behörden, Gerichten und sonstigen Stellen dar. Diese ist gesondert zu erteilen. Ist wegen der Abwesenheit des Auftraggebers eine Abstimmung mit diesem über die Einlegung von Rechtsbehelfen oder Rechtsmitteln nicht möglich, ist der Steuerberater im Zweifel zu fristwahrenden Handlungen berechtigt.</p>
                    </section>

                    <section>
                        <h3>2. Verschwiegenheitspflicht</h3>
                        <p>(1) Der Steuerberater ist nach Maßgabe der Gesetze verpflichtet, über alle Tatsachen, die ihm im Zusammenhang mit der Ausführung des Auftrags zur Kenntnis gelangen, Stillschweigen zu bewahren, es sei denn, der Auftraggeber entbindet ihn von dieser Verpflichtung. Die Verschwiegenheitspflicht besteht auch nach Beendigung des Vertragsverhältnisses fort. Die Verschwiegenheitspflicht besteht im gleichen Umfang auch für die Mitarbeiter des Steuerberaters.</p>
                        <p>(2) Die Verschwiegenheitspflicht besteht nicht, soweit die Offenlegung zur Wahrung berechtigter Interessen des Steuerberaters erforderlich ist. Der Steuerberater ist auch insoweit von der Verschwiegenheitspflicht entbunden, als er nach den Versicherungsbedingungen seiner Berufshaftpflichtversicherung zur Information und Mitwirkung verpflichtet ist.</p>
                        <p>(3) Gesetzliche Auskunfts- und Aussageverweigerungsrechte, u. a. nach § 102 AO, § 53 StPO und § 383 ZPO, bleiben unberührt.</p>
                        <p>(4) Der Steuerberater ist von der Verschwiegenheitspflicht entbunden, soweit dies zur Bestellung eines allgemeinen Vertreters (§ 69 StBerG) oder zur Durchführung eines Zertifizierungsaudits in der Kanzlei des Steuerberaters erforderlich ist und die insoweit tätigen Personen ihrerseits über ihre Verschwiegenheitspflicht belehrt worden sind. Der Auftraggeber erklärt sich damit einverstanden, dass durch den allgemeinen Vertreter oder den Zertifizierer/Auditor Einsicht in seine – vom Steuerberater angelegte und geführte – Handakte genommen wird.</p>
                    </section>

                    <section>
                        <h3>3. Mitwirkung Dritter</h3>
                        <p>Der Steuerberater ist berechtigt, zur Ausführung des Auftrags Mitarbeiter und unter den Voraussetzungen des § 62a StBerG auch externe Dienstleister (insbesondere datenverarbeitende Unternehmen) heranzuziehen. Die Beteiligung fachkundiger Dritter zur Mandatsbearbeitung (z. B. andere Steuerberater, Wirtschaftsprüfer, Rechtsanwälte) bedarf der Einwilligung und des Auftrags des Auftraggebers. Der Steuerberater ist nicht berechtigt und verpflichtet, diese Dritten ohne Auftrag des Auftraggebers hinzuzuziehen.</p>
                    </section>

                    <section>
                        <h3>4. Elektronische Kommunikation, Datenschutz<sup>3)</sup></h3>
                        <p>(1) Der Steuerberater ist berechtigt, personenbezogene Daten des Auftraggebers im Rahmen der erteilten Aufträge maschinell zu erheben und in einer automatisierten Datei zu verarbeiten oder einem Dienstleistungsrechenzentrum zur weiteren Auftragsdatenverarbeitung zu übertragen.</p>
                        <p>(2) Der Steuerberater ist berechtigt, in Erfüllung seiner Pflichten nach der DSGVO und dem Bundesdatenschutzgesetz einen Beauftragten für den Datenschutz zu bestellen. Sofern dieser Beauftragte für den Datenschutz nicht bereits nach Ziff. 2 Abs. 1 Satz 3 der Verschwiegenheitspflicht unterliegt, hat der Steuerberater dafür Sorge zu tragen, dass der Beauftragte für den Datenschutz sich mit Aufnahme seiner Tätigkeit zur Wahrung des Datengeheimnisses verpflichtet.</p>
                        <p>(3) Der Auftraggeber wird darauf hingewiesen, dass die Verwendung elektronischer Kommunikationsmittel (E-Mail etc.) mit Risiken für die Vertraulichkeit der Kommunikation verbunden sein kann. Der Auftraggeber stimmt der Nutzung elektronischer Kommunikationsmittel durch den Steuerberater zu.</p>
                    </section>

                    <section>
                        <h3>5. Mängelbeseitigung</h3>
                        <p>Bei etwaigen Mängeln ist dem Steuerberater Gelegenheit zur Nachbesserung zu geben. Offenbare Unrichtigkeiten (z. B. Schreibfehler, Rechenfehler) können vom Steuerberater jederzeit, auch Dritten gegenüber, berichtigt werden. Sonstige Mängel darf der Steuerberater Dritten gegenüber mit Einwilligung des Auftraggebers berichtigen. Die Einwilligung ist nicht erforderlich, wenn berechtigte Interessen des Steuerberaters den Interessen des Auftraggebers vorgehen.</p>
                    </section>

                    <section>
                        <h3>6. Haftung</h3>
                        <p>(1) Die Haftung des Steuerberaters und seiner Erfüllungsgehilfen für einen Schaden, der aus einer oder – bei einheitlicher Schadensfolge – aus mehreren Pflichtverletzungen anlässlich der Erfüllung eines Auftrags resultiert, wird auf 1.000.000,00 €<sup>4)</sup> (in Worten: eine Million €) begrenzt.<sup>5)</sup> Die Haftungsbegrenzung bezieht sich allein auf Fahrlässigkeit. Die Haftung für Vorsatz bleibt insoweit unberührt. Von der Haftungsbegrenzung ausgenommen sind Haftungsansprüche für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit. Die Haftungsbegrenzung gilt für die gesamte Tätigkeit des Steuerberaters für den Auftraggeber, also insbesondere auch für eine Ausweitung des Auftragsinhalts; einer erneuten Vereinbarung der Haftungsbegrenzung bedarf es insoweit nicht. Die Haftungsbegrenzung gilt auch gegenüber Dritten, soweit diese in den Schutzbereich des Mandatsverhältnisses fallen; § 334 BGB wird insoweit ausdrücklich nicht abbedungen. Einzelvertragliche Haftungsbegrenzungsvereinbarungen gehen dieser Regelung vor, lassen die Wirksamkeit dieser Regelung jedoch – soweit nicht ausdrücklich anders geregelt – unberührt.</p>
                        <p>(2) Die Haftungsbegrenzung gilt, wenn entsprechend hoher Versicherungsschutz bestanden hat, rückwirkend von Beginn des Mandatsverhältnisses bzw. dem Zeitpunkt der Höherversicherung an und erstreckt sich, wenn der Auftragsumfang nachträglich geändert oder erweitert wird, auch auf diese Fälle.</p>
                        <p>(3) Die Erteilung mündlicher Auskünfte gehört nicht zu den vertraglichen Hauptleistungen des Steuerberaters. Sie bergen die Gefahr insbesondere einer unvollständigen mündlichen Darlegung des zu beurteilenden Sachverhalts sowie von Missverständnissen zwischen Steuerberater und Auftraggeber. Deshalb wird vereinbart, dass der Steuerberater nur für in Textform erteilte Auskünfte einzutreten hat und die Haftung für mündliche Auskünfte des Steuerberaters oder seiner Mitarbeiter ausgeschlossen ist.</p>
                        <p>(4) Schadensersatzansprüche des Auftraggebers, mit Ausnahme solcher aus der Verletzung des Lebens, des Körpers oder der Gesundheit, verjähren 18 Monate ab Kenntnis oder grob fahrlässiger Unkenntnis des Auftraggebers von den Ansprüchen, spätestens aber fünf Jahre nach der Anspruchsentstehung. Maßgeblich ist die früher endende Frist.</p>
                    </section>

                    <section>
                        <h3>7. Pflichten des Auftraggebers; unterlassene Mitwirkung und Annahmeverzug des Auftraggebers</h3>
                        <p>(1) Der Auftraggeber ist zur Mitwirkung verpflichtet, soweit es zur ordnungsgemäßen Erledigung des Auftrags erforderlich ist. Insbesondere hat er dem Steuerberater unaufgefordert alle für die Ausführung des Auftrags notwendigen Unterlagen vollständig und so rechtzeitig zu übergeben, dass dem Steuerberater eine angemessene Bearbeitungszeit zur Verfügung steht. Entsprechendes gilt für die Unterrichtung über alle Vorgänge und Umstände, die für die Ausführung des Auftrags von Bedeutung sein können. Der Auftraggeber ist verpflichtet, alle Mitteilungen des Steuerberaters zur Kenntnis zu nehmen und bei Zweifelsfragen Rücksprache zu halten.</p>
                        <p>(2) Der Auftraggeber hat alles zu unterlassen, was die Unabhängigkeit des Steuerberaters oder seiner Erfüllungsgehilfen beeinträchtigen könnte.</p>
                        <p>(3) Der Auftraggeber verpflichtet sich, Arbeitsergebnisse des Steuerberaters nur mit dessen Einwilligung weiterzugeben, soweit sich nicht bereits aus dem Auftragsinhalt die Einwilligung zur Weitergabe an einen bestimmten Dritten ergibt.</p>
                        <p>(4) Setzt der Steuerberater beim Auftraggeber Datenverarbeitungsprogramme ein, so ist der Auftraggeber verpflichtet, den Hinweisen des Steuerberaters zur Installation und Anwendung der Programme nachzukommen. Des Weiteren ist der Auftraggeber verpflichtet, die Programme nur in dem vom Steuerberater vorgeschriebenen Umfang zu nutzen, und er ist auch nur in dem Umfang zur Nutzung berechtigt. Der Auftraggeber darf die Programme nicht verbreiten. Der Steuerberater bleibt Inhaber der Nutzungsrechte. Der Auftraggeber hat alles zu unterlassen, was der Ausübung der Nutzungsrechte an den Programmen durch den Steuerberater entgegensteht.</p>
                        <p>(5) Unterlässt der Auftraggeber eine ihm nach Ziff. 7 Abs. 1 bis 4 oder anderweitig obliegende Mitwirkung oder kommt er mit der Annahme der vom Steuerberater angebotenen Leistung in Verzug, so ist der Steuerberater berechtigt, den Vertrag fristlos zu kündigen. Unberührt bleibt der Anspruch des Steuerberaters auf Ersatz der ihm durch den Verzug oder die unterlassene Mitwirkung des Auftraggebers entstandenen Mehraufwendungen sowie des verursachten Schadens, und zwar auch dann, wenn der Steuerberater von dem Kündigungsrecht keinen Gebrauch macht.</p>
                    </section>

                    <section>
                        <h3>8. Urheberrechtsschutz</h3>
                        <p>Die Leistungen des Steuerberaters stellen dessen geistiges Eigentum dar. Sie sind urheberrechtlich geschützt. Eine Weitergabe von Arbeitsergebnissen außerhalb der bestimmungsgemäßen Verwendung ist nur mit vorheriger Zustimmung des Steuerberaters in Textform zulässig.</p>
                    </section>

                    <section>
                        <h3>9. Vergütung, Rechnungsstellung, Vorschuss und Aufrechnung</h3>
                        <p>(1) Die Vergütung (Gebühren und Auslagenersatz) des Steuerberaters für seine Berufstätigkeit nach § 33 StBerG bemisst sich nach der Steuerberatervergütungsverordnung (StBVV). Eine höhere oder niedrigere als die gesetzliche Vergütung kann in Textform vereinbart werden. Die Vereinbarung einer niedrigeren Vergütung ist nur in außergerichtlichen Angelegenheiten zulässig. Sie muss in einem angemessenen Verhältnis zu der Leistung, der Verantwortung und dem Haftungsrisiko des Steuerberaters stehen.</p>
                        <p>(2) Der Auftraggeber ist mit einer Rechnungsstellung des Steuerberaters in Textform einverstanden.</p>
                        <p>(3) Für Tätigkeiten, die in der StBVV keine Regelung erfahren (z. B. § 57 Abs. 3 Nrn. 2 und 3 StBerG), gilt die vereinbarte Vergütung, anderenfalls die für diese Tätigkeit vorgesehene gesetzliche Vergütung, ansonsten die übliche Vergütung (§§ 612 Abs. 2 und 632 Abs. 2 BGB).</p>
                        <p>(4) Eine Aufrechnung gegenüber einem Vergütungsanspruch des Steuerberaters ist nur mit unbestrittenen oder rechtskräftig festgestellten Forderungen zulässig. Etwaige Ansprüche des Auftraggebers auf Rückzahlung einer gezahlten Vergütung verjähren 18 Monate nach Zugang der Rechnung beim Auftraggeber</p>
                        <p>(5) Für bereits entstandene und voraussichtlich entstehende Gebühren und Auslagen kann der Steuerberater einen Vorschuss fordern. Wird der geforderte Vorschuss nicht gezahlt, kann der Steuerberater nach vorheriger Ankündigung seine weitere Tätigkeit für den Auftraggeber einstellen, bis der Vorschuss eingeht. Der Steuerberater ist verpflichtet, seine Absicht, die Tätigkeit einzustellen, dem Auftraggeber rechtzeitig bekanntzugeben, wenn dem Auftraggeber Nachteile aus einer Einstellung der Tätigkeit erwachsen können. Für den Steuerberater ist eine Verrechnung von Vorschüssen mit allen fälligen Forderungen aus dem Auftragsverhältnis möglich, unabhängig davon, für welche Tätigkeit der Vorschuss gefordert wurde.</p>
                        <p>(6) Der Auftraggeber kommt in Verzug, wenn er nicht innerhalb von 14 Tagen nach Rechnungsdatum leistet.</p>
                    </section>

                    <section>
                        <h3>10. Beendigung des Vertrags</h3>
                        <p>(1) Der Vertrag endet mit Erfüllung der vereinbarten Leistungen, durch Ablauf der vereinbarten Laufzeit oder durch Kündigung. Der Vertrag endet nicht durch den Tod, durch den Eintritt der Geschäftsunfähigkeit des Auftraggebers oder im Falle einer Gesellschaft durch deren Auflösung.</p>
                        <p>(2) Der Vertrag kann – wenn und soweit er einen Dienstvertrag i. S. d. §§ 611, 675 BGB darstellt – von jedem Vertragspartner außerordentlich gekündigt werden, es sei denn, es handelt sich um ein Dienstverhältnis mit festen Bezügen, § 627 Abs. 1 BGB; die Kündigung hat in Textform zu erfolgen. Soweit im Einzelfall hiervon abgewichen werden soll, bedarf es einer Vereinbarung zwischen Steuerberater und Auftraggeber.</p>
                        <p>(3) Mit Beendigung des Vertrags hat der Auftraggeber dem Steuerberater die beim Auftraggeber zur Ausführung des Auftrags eingesetzten Datenverarbeitungsprogramme einschließlich angefertigter Kopien sowie sonstige Programmunterlagen unverzüglich herauszugeben bzw. zu löschen.</p>
                        <p>(4) Nach Beendigung des Auftragsverhältnisses sind die Unterlagen beim Steuerberater abzuholen.</p>
                        <p>(5) Endet der Auftrag vor seiner vollständigen Ausführung, so richtet sich der Vergütungsanspruch des Steuerberaters nach den gesetzlichen Regelungen, insbesondere § 12 Abs. 4 StBVV. Soweit im Einzelfall hiervon abgewichen werden soll, bedarf es einer gesonderten Vereinbarung in Textform.</p>
                    </section>

                    <section>
                        <h3>11. Zurückbehaltungsrecht in Bezug auf Arbeitsergebnisse und Unterlagen</h3>
                        <p>(1) Der Steuerberater kann von Unterlagen, die er an den Auftraggeber zurückgibt, Abschriften oder Fotokopien anfertigen und zurückbehalten oder dies im Wege der elektronischen Datenverarbeitung vornehmen.</p>
                        <p>(2) Der Steuerberater kann die Herausgabe der Dokumente verweigern, bis er wegen seiner Gebühren und Auslagen befriedigt ist (§ 66 Abs. 3 StBerG). Hinsichtlich der Arbeitsergebnisse gilt ein vertragliches Zurückbehaltungsrecht als vereinbart.</p>
                    </section>

                    <section>
                        <h3>12. Gerichtsstand, Erfüllungsort, Information VSBG</h3>
                        <p>(1) Für den Auftrag, seine Ausführung und sich hieraus ergebende Ansprüche gilt ausschließlich deutsches Recht. Erfüllungsort und Gerichtsstand ist, sofern der Auftraggeber Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist, die berufliche Niederlassung des Steuerberaters. Dies gilt auch für den Fall, dass der Auftraggeber nach Auftragserteilung seinen Wohnsitz oder gewöhnlichen Aufenthaltsort in das Ausland verlegt oder der Wohnsitz oder gewöhnliche Aufenthaltsort im Zeitpunkt der Klageerhebung nicht bekannt sind.</p>
                        <p>(2) Der Steuerberater ist – nicht – bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§§ 36, 37 VSBG).<sup>6)</sup></p>
                    </section>

                    <section>
                        <h3>13. Wirksamkeit bei Teilnichtigkeit</h3>
                        <p>Falls einzelne Bestimmungen dieser Geschäftsbedingungen unwirksam sein oder werden sollten, wird die Wirksamkeit der übrigen Bestimmungen dadurch nicht berührt.</p>
                    </section>

                    <hr className="divider" />

                    <div className="footnotes">
                        <p><small>1) Bei online abgeschlossenen Verträgen mit Verbrauchern ist der DWS-Vordruck Nr. 1130 „Muster-Widerrufsbelehrung, Muster-Zustimmungserklärung und Muster-Widerrufsformular für online abgeschlossene Verbrauchermandate“ zu beachten. Auf die weiterführenden Hinweise im DWS-Merkblatt Nr. 1001 wird verwiesen.</small></p>
                        <p><small>2) Der Begriff „Steuerberater“ umfasst im Folgenden jeweils auch Steuerbevollmächtigte.</small></p>
                        <p><small>3) Zur Verarbeitung personenbezogener Daten muss zudem eine Rechtsgrundlage aus Art. 6 DSGVO einschlägig sein. Der Steuerberater muss außerdem die Informationspflichten gem. Art. 13 oder 14 DSGVO durch Übermittlung zusätzlicher Informationen erfüllen. Hierzu sind die Hinweise und Erläuterungen im DWS-Hinweisblatt Nr. 1007 zu den DWS-Vordrucken Nr. 1005 „Datenschutzinformationen für Mandanten“ und Nr. 1006 „Datenschutzinformation zur Verarbeitung von Beschäftigtendaten“ zu beachten.</small></p>
                        <p><small>4) Bitte Betrag einsetzen. Um von dieser Regelung Gebrauch machen zu können, muss bei einer Einzelkanzlei ein Betrag von mindestens 1 Mio. € angegeben werden, und die vertragliche Versicherungssumme muss wenigstens 1 Mio. € für den einzelnen Schadensfall betragen; andernfalls ist die Ziffer 6 zu streichen. Für Berufsausübungsgesellschaften gelten höhere Beträge (siehe Fn. 5). Auf die weiterführenden Hinweise im DWS-Merkblatt Nr. 1001 wird verwiesen.</small></p>
                        <p><small>5) Nach § 55f Abs. 1 StBerG ist jede Berufsausübungsgesellschaft, gleich welcher Rechtsform, zum Abschluss und zur Unterhaltung einer Berufshaftpflichtversicherung verpflichtet. Differenzierend geregelt ist die Höhe der erforderlichen Sozietätsdeckung, je nachdem, ob durch die Rechtsform eine Beschränkung der Haftung für natürliche Personen vorliegt (vgl. § 55f Abs. 2 und 3 StBerG). Nach § 67a Abs. 1 Satz 1 Nr. 2 StBerG kann die Haftung durch allgemeine Geschäftsbedingungen auf den vierfachen Betrag der Mindestversicherungssumme begrenzt werden, wenn insoweit Versicherungsschutz besteht. Die vertragliche Versicherungssumme muss den Vorgaben hinsichtlich des einzelnen Schadensfalles entsprechen; andernfalls ist die Ziffer 6 zu streichen. Auf die Hinweise im DWS-Merkblatt Nr. 1001 wird verwiesen.</small></p>
                        <p><small>6) Falls die Durchführung von Streitbeilegungsverfahren vor der Verbraucherschlichtungsstelle gewünscht ist, ist das Wort „nicht“ zu streichen. Auf die zuständige Verbraucherschlichtungsstelle ist in diesem Fall unter Angabe von deren Anschrift und Website hinzuweisen.</small></p>
                        <p><small>© 10/2023 DWS Steuerberater Medien GmbH · Bestellservice: Postfach 02 35 53 · 10127 Berlin · Telefon 0 30/2 88 85 66 · Telefax 0 30/28 88 56 70 · E-Mail: info@dws-medien.de · Internet: www.dws-medien.de</small></p>
                    </div>

                </div>
            </div>

            <style jsx>{`
                .agb-page {
                    padding: 8rem 0 4rem;
                    background-color: #f8fafc;
                    min-height: 80vh;
                }
                .agb-content {
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
                    margin-bottom: 0.5rem;
                    text-align: center;
                }
                h2 {
                    color: var(--color-text);
                    font-size: 1.25rem;
                    margin-bottom: 2rem;
                    text-align: center;
                    font-weight: 500;
                }
                .stand {
                    text-align: center;
                    color: var(--color-text-muted);
                    margin-bottom: 3rem;
                    font-style: italic;
                }
                h3 {
                    color: var(--color-primary);
                    font-size: 1.15rem;
                    margin: 2.5rem 0 1rem;
                    font-weight: 600;
                }
                p {
                    color: var(--color-text);
                    line-height: 1.7;
                    margin-bottom: 1rem;
                    font-size: 0.95rem;
                    text-align: justify;
                }
                sup {
                    color: var(--color-accent);
                    font-weight: 600;
                }
                .divider {
                    margin: 3rem 0;
                    border: 0;
                    border-top: 1px solid #e2e8f0;
                }
                .footnotes p {
                    font-size: 0.8rem;
                    color: var(--color-text-muted);
                    margin-bottom: 0.5rem;
                    text-align: left;
                }
                @media (max-width: 768px) {
                    .agb-content {
                        padding: 1.5rem;
                    }
                    .agb-page {
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

export default AGB;
