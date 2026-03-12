-- ==============================================================================
-- 4 Beispiel-Stellenanzeigen für die Kanzlei
-- ==============================================================================

INSERT INTO public.jobs (
  title, 
  slug, 
  short_description, 
  description, 
  tasks, 
  requirements, 
  benefits, 
  location, 
  employment_type, 
  start_date, 
  salary, 
  contact_person, 
  contact_email, 
  status, 
  sort_order, 
  seo_title, 
  seo_description
) VALUES 
(
  'Steuerfachangestellte/r (m/w/d)',
  'steuerfachangestellte-m-w-d',
  'Wir suchen eine/n engagierte/n Steuerfachangestellte/n zur selbstständigen Betreuung unserer Mandanten in familiärer Atmosphäre.',
  'Als digitale und stetig wachsende Kanzlei suchen wir ab sofort eine/n Steuerfachangestellte/n (m/w/d) zur Verstärkung unseres Teams. Wenn Sie Freude an der eigenverantwortlichen Betreuung von Mandanten haben und in einer Kanzlei arbeiten möchten, in der ein wertschätzendes Miteinander im Vordergrund steht, dann sind Sie bei uns genau richtig.',
  '- Eigenverantwortliche Betreuung eines festen Mandantenstamms
- Erstellung von Finanz- und Lohnbuchhaltungen
- Vorbereitung und Erstellung von Jahresabschlüssen
- Erstellung von betrieblichen und privaten Steuererklärungen
- Prüfung von Steuerbescheiden und Kommunikation mit Finanzämtern',
  '- Erfolgreich abgeschlossene Ausbildung zur/zum Steuerfachangestellten
- Sicherer Umgang mit DATEV-Programmen und MS-Office
- Selbstständige, strukturierte und gewissenhafte Arbeitsweise
- Freude am direkten Kontakt mit Mandanten
- Teamfähigkeit und Aufgeschlossenheit gegenüber der Digitalisierung',
  '- 30 Tage Urlaub, damit Sie Zeit für sich haben
- Flexible Arbeits- und Gleitzeiten (Home-Office nach Absprache möglich)
- Ein modern ausgestatteter, ergonomischer Arbeitsplatz
- Regelmäßige fachliche Fort- und Weiterbildungen (kostenfreier Zugang)
- Ein unbefristetes Arbeitsverhältnis mit attraktiver Vergütung
- Fahrtkostenzuschuss oder steuerfreie Sachbezüge nach Wahl',
  'München',
  'Vollzeit / Teilzeit',
  'Ab sofort',
  'Nach Vereinbarung',
  'Herr Peiker',
  'karriere@kanzlei-peiker.de',
  'published',
  10,
  'Steuerfachangestellte/r (m/w/d) in München gesucht',
  'Bewerben Sie sich jetzt als Steuerfachangestellte/r (m/w/d) bei unserer modernen Steuerkanzlei. Attraktive Benefits und flexible Arbeitszeiten erwarten Sie.'
),
(
  'Steuerfachwirt/in (m/w/d)',
  'steuerfachwirt-m-w-d',
  'Übernehmen Sie Verantwortung für anspruchsvolle Mandate und begleiten Sie steuerliche Sonderprojekte in unserer Kanzlei.',
  'Wir suchen einen erfahrenen und proaktiven Steuerfachwirt (m/w/d), der Freude daran hat, tiefer in steuerliche Fragestellungen einzutauchen und Mandanten ganzheitlich zu beraten. Sie arbeiten in engem Austausch mit der Kanzleileitung und tragen zur hohen Qualität unserer Beratungsleistungen bei.',
  '- Ganzheitliche Betreuung und Beratung anspruchsvoller Mandanten
- Erstellung von komplexen Jahresabschlüssen nach HGB und Steuerrecht
- Erstellung von anspruchsvollen Steuererklärungen (Unternehmen & Privatpersonen)
- Begleitung von steuerlichen Betriebsprüfungen
- Ausarbeitung von Lösungsvorschlägen bei komplexen steuerlichen Sachverhalten',
  '- Erfolgreich absolvierte Prüfung zum/zur Steuerfachwirt/in
- Fundierte Berufserfahrung im Kanzleiumfeld
- Tiefgehende Kenntnisse im aktuellen Steuerrecht
- Ausgeprägte analytische und kommunikative Fähigkeiten
- Sicherer Umgang mit DATEV
- Bereitschaft zur Übernahme von Verantwortung',
  '- Ein attraktives, überdurchschnittliches Gehaltspaket
- Anspruchsvolle und abwechslungsreiche Mandatsarbeit
- Strukturierte Förderung bei dem Wunsch nach dem Steuerberaterexamen
- 30 Tage Urlaub und flexible Home-Office Regelungen
- Betriebliche Altersvorsorge
- Flache Hierarchien und kurze Entscheidungswege',
  'München',
  'Vollzeit',
  'Zum nächstmöglichen Zeitpunkt',
  'Attraktiv / Qualifikationsabhängig',
  'Herr Peiker',
  'karriere@kanzlei-peiker.de',
  'published',
  20,
  'Steuerfachwirt/in (m/w/d) - Moderne Kanzlei in München',
  'Sie suchen eine neue Herausforderung als Steuerfachwirt/in? Starten Sie Ihre Karriere bei uns mit anspruchsvollen Mandaten und Top-Konditionen.'
),
(
  'Bilanzbuchhalter/in (m/w/d)',
  'bilanzbuchhalter-m-w-d',
  'Werden Sie unser Experte für Jahresabschlüsse und komplexe FiBu. Flexible Arbeitszeiten & tolles Team!',
  'Sie haben ein Auge fürs Detail und Zahlen sind genau Ihre Welt? Für den weiteren systematischen Ausbau unserer digitalen Buchhaltungsprozesse suchen wir eine/n Bilanzbuchhalter/in (m/w/d), der/die uns in diesem kritischen Bereich den Rücken stärkt.',
  '- Erstellung von Monats-, Quartals- und Jahresabschlüssen
- Bearbeitung anspruchsvoller Finanzbuchhaltungen inkl. Anlagenbuchhaltung
- Erstellung von Umsatzsteuervoranmeldungen und statistischen Meldungen
- Optimierung der digitalen Prozesse in der Buchhaltung (Unternehmen Online)
- Vorbereitung oder Erstellung von Steuererklärungen für Unternehmen
- Ansprechpartner für Mandanten in buchhalterischen Angelegenheiten',
  '- Erfolgreich abgeschlossene Weiterbildung zum/zur Bilanzbuchhalter/in (IHK)
- Souveräner Umgang mit DATEV, insbesondere DATEV Unternehmen online
- Ausgeprägte Affinität für digitale Prozesse
- Selbstständige, sorgfältige und termingetreue Arbeitsweise
- Hoher Qualitätsanspruch an die eigene Arbeit',
  '- Einen krisensicheren Arbeitsplatz in einer expandierenden Kanzlei
- Eine moderne und vollumfänglich digitale Arbeitsausstattung
- Viel Freiraum für eigenverantwortliches Arbeiten
- Hervorragende Work-Life-Balance (Gleitzeit & Home-Office)
- Jährliche Teamevents und regelmäßige Gesundheitsangebote',
  'München',
  'Vollzeit / Teilzeit',
  'Ab sofort',
  '',
  'Herr Peiker',
  'karriere@kanzlei-peiker.de',
  'published',
  30,
  'Wir suchen Bilanzbuchhalter (m/w/d) - Flexible & Moderne Kanzlei',
  'Werden Sie Bilanzbuchhalter/in (m/w/d) in unserer Kanzlei. Es erwartet Sie ein starkes Team, spannende Digital-Projekte und hervorragende Benefits.'
),
(
  'Auszubildende/r Steuerfachangestellte/r (m/w/d)',
  'ausbildung-steuerfachangestellte-m-w-d',
  'Starte Deine berufliche Zukunft bei uns! Wir bieten eine exzellente Ausbildung mit sehr hohen Übernahmechancen.',
  'Du bist auf der Suche nach einem spannenden, sicheren und zukunftsorientierten Ausbildungsplatz? Eine Ausbildung in der Steuerberatung bietet unzählige Karrieremöglichkeiten – und das alles digitaler, als Du vielleicht denkst! Wir legen großen Wert auf eine fundierte Ausbildung, bei der Du vom ersten Tag an Teil des Teams bist.',
  '- Kennenlernen aller steuerlichen und betriebswirtschaftlichen Abläufe der Kanzlei
- Unterstützung bei der Buchführung für unsere Mandanten
- Einführung in die Erstellung von Steuererklärungen und Jahresabschlüssen
- Vorbereitung von Lohn- und Gehaltsabrechnungen
- Kennenlernen und Anwendung moderner Kanzleisoftware (DATEV)',
  '- Allgemeine Hochschulreife, Fachhochschulreife oder Mittlere Reife mit guten Noten (insb. in Mathe/Deutsch)
- Interesse an wirtschaftlichen Zusammenhängen und Zahlen
- Freude am Umgang mit Menschen und eine gute Kommunikationsfähigkeit
- Zuverlässigkeit, Sorgfalt und Lernbereitschaft
- Spaß am Arbeiten mit digitalen Systemen',
  '- Eine erstklassige, strukturierte Ausbildung durch erfahrene Mentoren
- Ein sehr gutes Betriebsklima und herzliche Kollegen
- Moderne Kanzleiräume und top Hardware
- Übernahmechance nach erfolgreichem Abschluss
- Kostenfreie Getränke und regelmäßige Team-Events
- Unterstützung bei der Prüfungsvorbereitung',
  'München',
  'Ausbildung',
  '01.08. oder 01.09. d.J.',
  'Nach IHK Empfehlung',
  'Herr Peiker',
  'karriere@kanzlei-peiker.de',
  'published',
  40,
  'Ausbildung Steuerfachangestellte(r) (m/w/d) - Wir bilden aus',
  'Starte deine Ausbildung bei uns in der Steuerkanzlei. Wir machen dich fit für die Zukunft der Beratung! Bewirb dich jetzt für das aktuelle oder kommende Jahr.'
);
