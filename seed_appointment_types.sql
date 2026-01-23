-- Seed the availability_options with the client's specific types
-- This ensures they show up in the Admin Dashboard "Termintool" settings.

INSERT INTO availability_options (name, duration_minutes, description, price, is_active)
VALUES
  ('Erstberatung', 45, 'Unverbindliches Erstgespräch für Neumandanten.', 0.00, true),
  ('Jahresabschluss', 60, 'Besprechung zum Jahresabschluss.', 0.00, true),
  ('Lohn & Gehalt', 30, 'Fragen zu Lohn- und Gehaltsabrechnungen.', 0.00, true),
  ('USt-Voranmeldung', 30, 'Klärung von Fragen zur Umsatzsteuervoranmeldung.', 0.00, true),
  ('Rückruf', 15, 'Kurzer Rückruf zu einem spezifischen Anliegen.', 0.00, true);

-- Cleanup 'Erstgespräch' default if it was auto-created and you prefer the 'Erstberatung' wording
-- DELETE FROM availability_options WHERE name = 'Erstgespräch';
