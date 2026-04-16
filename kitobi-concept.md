# Kitobi – Konzeptdokument
*Kioku no Tobira · 記憶の扉 · "Die Tür der Erinnerung"*

> Eine persönliche Web-App für Studierende, die Lernkarten, Notizen, KI-gestützte Quizzes und Lernplanung in einem einzigen Tool vereint. Teil des Shoriu-Produktportfolios.

---

## 1. Problem & Zielsetzung

Studierende jonglieren heute mit mehreren Tools gleichzeitig: Anki für Karten, Notion für Notizen, Google Calendar für Planung, und nichts davon spricht miteinander. Lernfortschritt bleibt unsichtbar, Prüfungsvorbereitungen werden reaktiv statt strategisch angegangen. Kitobi vereint alle relevanten Lernphasen in einem kohärenten System – vom Erstellen von Notizen bis hin zur KI-gestützten Prüfungssimulation – und macht den eigenen Fortschritt sichtbar und steuerbar.

---

## 2. Zielgruppe

| Nutzertyp | Beschreibung | Hauptbedürfnis |
|---|---|---|
| **Primärnutzer (ich)** | Selbststudium, strukturiertes Lernen mit hohem Eigentransfer | Alles an einem Ort, offline-tauglich, kein Overhead |
| **Spätere Nutzer** | Studierende aller Fachrichtungen, die mehr als ein Tool wollen | Schneller Einstieg, intuitive UX, KI-Unterstützung |

---

## 3. Kernfunktionen (MVP)

- **Lernkarten mit Spaced Repetition** – Karten manuell erstellen oder aus Notizen generieren; SM-2-Algorithmus steuert Wiederholungsintervalle automatisch
- **Notizen & Zusammenfassungen** – Strukturierte Notizverwaltung nach Fach/Thema; Markdown-Support; Notizen als Basis für Karten und Quizzes nutzbar
- **Quizzes & Tests** – Multiple-Choice, Lückentext und Freitext-Fragen; manuell erstellbar oder KI-generiert aus bestehenden Notizen/Karten
- **Lernplan & Kalender** – Prüfungstermine eintragen; System schlägt tägliche Lernziele vor basierend auf verbleibendem Zeit und Kartenstapelgröße
- **Fortschrittstracking** – Dashboard mit Lernstreak, Kartenfortschritt pro Fach, Quiz-Trefferquoten und Zeitinvestition

---

## 4. KI-Anbindung (Phase 1.5 – direkt nach MVP)

- **Karten aus Notizen generieren** – Notiztext einfügen → KI erstellt Frage/Antwort-Paare automatisch
- **Quiz-Generierung** – Aus Notizen oder Kartenstapeln werden Quizfragen verschiedener Typen generiert
- **Erklärungen bei Fehler** – Bei falsch beantworteter Karte kann die KI eine Erklärung liefern
- **Zusammenfassungen** – KI fasst längere Notizen auf Kernpunkte zusammen

---

## 5. Erweiterungen (Phase 2+)

- **Multi-User / Gruppen** – Kartenstapel und Notizen mit Kommilitonen teilen
- **Datei-Import** – PDF, DOCX oder Bild hochladen → KI extrahiert Lerninhalt
- **Spracherkennung** – Antworten per Mikrofon eingeben (nützlich für Sprachen)
- **Öffentliche Marktplatz-Decks** – Community kann Kartenstapel teilen
- **Mobile App** – PWA oder native App für Lernen unterwegs
- **Gamification** – Punkte, Abzeichen, XP-System

---

## 6. User Stories

- Als **Lernender** möchte ich Lernkarten nach Fach sortiert erstellen, damit ich gezielt nach Thema lernen kann.
- Als **Lernender** möchte ich täglich vorgeschlagene Karten zur Wiederholung sehen, damit ich Spaced Repetition automatisch nutze ohne selbst zu planen.
- Als **Lernender** möchte ich aus meinen Notizen automatisch Quizfragen generieren lassen, damit ich keine Zeit mit manuellem Erstellen verschwende.
- Als **Lernender** möchte ich einen Prüfungstermin eintragen und einen Lernplan bekommen, damit ich die verbleibende Zeit optimal einteile.
- Als **Lernender** möchte ich ein Dashboard sehen, das meinen Fortschritt pro Fach zeigt, damit ich weiß, wo ich noch Nachholbedarf habe.
- Als **Lernender** möchte ich Notizen in Markdown schreiben und nach Fächern strukturieren, damit ich meine Unterlagen übersichtlich halte.
- Als **Lernender** möchte ich bei einer falsch beantworteten Karte eine KI-Erklärung abrufen, damit ich das Konzept sofort besser verstehe.
- Als **Lernender** möchte ich meine Lernstreak sehen, damit ich motiviert bleibe regelmäßig zu lernen.

---

## 7. Nicht im Scope (MVP)

- Kollaboration / Gruppen-Features (Phase 2)
- Datei-Upload oder PDF-Import
- Mobile App (Web-first; PWA optional später)
- Öffentlicher Kartenstapel-Marktplatz
- Bezahlsystem / Monetarisierung
- Mehrsprachige UI (nur Deutsch/Englisch zunächst)

---

## 8. Technische Rahmenbedingungen

| Aspekt | Anforderung / Präferenz |
|---|---|
| Platform | Web App (Desktop-first, responsive) |
| Stack-Empfehlung | React + Vite + Supabase (Auth, DB, Storage) |
| KI-Integration | Anthropic Claude API (claude-sonnet-4) |
| Nutzeranzahl | Zunächst 1 (du); später multi-user via Auth |
| Offline | Nice-to-have via PWA / localStorage-Cache |
| Hosting | Unter Shoriu-Domain (z.B. kitobi.shoriu.app) |
| Wartung | Selbst (du als Entwickler) |

> **Stack-Begründung:** React + Supabase ist dein aktueller Stack für den Lernende-Tracker bei medmix – du kennst die Patterns bereits. Supabase liefert Auth, Datenbank und Row-Level Security out of the box, ideal wenn du später Multi-User aufschaltest.

---

## 9. Datenmodell (Skizze)

```
users           → id, email, created_at
subjects        → id, user_id, name, color, exam_date
notes           → id, user_id, subject_id, title, content (markdown), created_at
flashcard_decks → id, user_id, subject_id, name
flashcards      → id, deck_id, front, back, interval, ease_factor, due_date
quiz_sessions   → id, user_id, subject_id, score, total, created_at
quiz_questions  → id, session_id, question, correct_answer, user_answer, type
study_logs      → id, user_id, date, duration_min, cards_reviewed, subject_id
```

---

## 10. Offene Fragen

- [ ] Welchen SM-2 vs. FSRS Algorithmus für Spaced Repetition? (FSRS ist moderner)
- [ ] KI-Karten-Generierung: direkt beim Speichern der Notiz oder manuell per Button?
- [ ] Soll das Markdown-Editor ein Rich-Text-Editor (z.B. TipTap) oder reines Markdown sein?
- [ ] Lernplan-Logik: einfaches lineares Aufteilen oder adaptiv nach Performance?
- [ ] App-Name final? "Kitobi" ist ein Arbeitstitel

---

## 11. Nächste Schritte

- [ ] Konzept reviewen und freigeben
- [ ] Technische Architektur ausarbeiten → *app-architecture Skill*
- [ ] UI/Design festlegen → *app-ui-design Skill*
- [ ] Entwicklung starten → *app-dev-tracker Skill*

---

*Erstellt mit dem app-concept Skill · April 2026*
