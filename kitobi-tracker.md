# Kitobi – Entwicklungs-Tracker

**Letzte Aktualisierung:** 16. April 2026
**Gesamtfortschritt:** 3 / 63 Aufgaben abgeschlossen (5%)

---

## 🔵 Aktueller Fokus

> **Phase 0 – Projekt-Setup**
> Repo und Supabase sind bereits eingerichtet. Als nächstes: Vite + React initialisieren und alle Dependencies installieren.
> Nach Phase 1 (Auth) folgt Phase 1.5 (Onboarding) bevor die Datenbank mit echten Nutzerdaten befüllt wird.

---

## ⚠️ Offene Blocker

*(Keine Blocker)*

---

## 📋 Aufgaben nach Phase

Status-Legende: ✅ Fertig · 🔄 In Arbeit · ⏳ Offen · ❌ Blockiert · ⏭️ Übersprungen

---

### Phase 0 – Setup

| # | Aufgabe | Status | Notiz |
|---|---|---|---|
| 0.1 | GitHub Repo `kitobi` anlegen (unter Shoriu-Org oder eigenem Account) | ✅ | Erledigt |
| 0.2 | Vite + React + TypeScript initialisieren (`npm create vite@latest`) | ✅ | Erledigt |
| 0.3 | Tailwind CSS + shadcn/ui konfigurieren | ⏳ | |
| 0.4 | Supabase Projekt anlegen (Name: `kitobi`) | ✅ | Erledigt |
| 0.5 | `.env.local` mit Supabase URL + Anon Key + Claude API Key anlegen | ⏳ | |
| 0.6 | Projektstruktur nach Architektur-Doc anlegen (`pages/`, `components/`, `hooks/`, `lib/`, `store/`, `types/`) | ⏳ | |
| 0.7 | CSS-Variablen (`--color-*`) aus UI-Design in `src/styles/tokens.css` eintragen | ⏳ | |
| 0.8 | Google Fonts einbinden: Outfit, Inter, JetBrains Mono | ⏳ | |
| 0.9 | `ts-fsrs`, `@supabase/supabase-js`, `zustand`, `@tanstack/react-query`, `react-router-dom` installieren | ⏳ | |
| 0.10 | TipTap Editor installieren (`@tiptap/react`, `@tiptap/starter-kit`) | ⏳ | |

**Phase-Fortschritt:** 3 / 10 (30%)

---

### Phase 1 – Auth

| # | Aufgabe | Status | Notiz |
|---|---|---|---|
| 1.1 | Supabase Auth aktivieren (Email/Password) | ⏳ | |
| 1.2 | `supabase.ts` Client-Wrapper in `src/lib/` erstellen | ⏳ | |
| 1.3 | Login-Seite (`/login`) mit Email/Passwort-Formular | ⏳ | |
| 1.4 | Auth-State in Zustand-Store verwalten (eingeloggt / nicht) | ⏳ | |
| 1.5 | Protected Route Wrapper – Redirect zu `/login` wenn nicht eingeloggt | ⏳ | |
| 1.6 | Logout-Funktion in Settings/Sidebar | ⏳ | |

**Phase-Fortschritt:** 0 / 6 (0%)

---

### Phase 1.5 – Onboarding Wizard

| # | Aufgabe | Status | Notiz |
|---|---|---|---|
| 1.5.1 | Onboarding-Flow Routing: nach erstem Login auf `/onboarding` leiten, danach nie wieder | ⏳ | Flag in `user_profiles` Tabelle: `onboarding_completed` |
| 1.5.2 | Tabelle `user_profiles` anlegen (name, study_program, semester, daily_goal_min, onboarding_completed) | ⏳ | |
| 1.5.3 | Schritt 1 – Profil: Name, Studiengang, Semester eingeben | ⏳ | |
| 1.5.4 | Schritt 2 – Fächer: Fächer eingeben + KI schlägt passende Fächer basierend auf Studiengang vor | ⏳ | Claude API: "Für {Studiengang} typische Fächer?" → auswählbare Chips |
| 1.5.5 | Schritt 3 – Prüfungstermine: bekannte Termine direkt eintragen | ⏳ | |
| 1.5.6 | Schritt 4 – Lernziele: Minuten/Tag, wie viele Tage vor Prüfung anfangen | ⏳ | |
| 1.5.7 | Schritt 5 – KI-Zusammenfassung: Claude fasst Einrichtung zusammen + gibt personalisierten Starttipp | ⏳ | Motivierender Abschluss-Screen |
| 1.5.8 | Fortschrittsanzeige im Wizard (Schritte 1–5, aktiver Schritt hervorgehoben) | ⏳ | |
| 1.5.9 | Onboarding überspringen-Option (mit Hinweis dass es später in Settings nachholbar ist) | ⏳ | |

**Phase-Fortschritt:** 0 / 9 (0%)

---

### Phase 2 – Datenbank & Schema

| # | Aufgabe | Status | Notiz |
|---|---|---|---|
| 2.1 | Tabelle `user_profiles` anlegen + RLS (wird in Phase 1.5 benötigt) | ⏳ | Felder: name, study_program, semester, daily_goal_min, onboarding_completed |
| 2.2 | Tabelle `subjects` anlegen + RLS aktivieren | ⏳ | |
| 2.3 | Tabelle `notes` anlegen + RLS | ⏳ | |
| 2.4 | Tabellen `flashcard_decks` + `flashcards` anlegen + RLS | ⏳ | |
| 2.5 | Tabellen `quiz_sessions` + `quiz_questions` anlegen + RLS | ⏳ | |
| 2.6 | Tabelle `study_logs` anlegen + RLS | ⏳ | |
| 2.7 | TypeScript-Typen aus DB-Schema generieren (`supabase gen types`) | ⏳ | |
| 2.8 | Seed-Daten: 2 Test-Fächer + 5 Testkarten anlegen | ⏳ | |

**Phase-Fortschritt:** 0 / 8 (0%)

---

### Phase 3 – Kernfunktionen (MVP)

| # | Aufgabe | Status | Notiz |
|---|---|---|---|
| 3.1 | **Fächer:** CRUD (anlegen, umbenennen, löschen, Farbe wählen) | ⏳ | |
| 3.2 | **Notizen:** Liste nach Fach gruppiert (`/notes`) | ⏳ | |
| 3.3 | **Notizen:** TipTap Editor mit Autosave (`/notes/:id`) | ⏳ | |
| 3.4 | **Notizen:** Neue Notiz erstellen, löschen | ⏳ | |
| 3.5 | **Karten:** Deck-Übersicht (`/decks`) | ⏳ | |
| 3.6 | **Karten:** Karten manuell erstellen/bearbeiten/löschen | ⏳ | |
| 3.7 | **FSRS:** `useFSRS` Hook implementieren (ts-fsrs, Rating → neue Intervalle) | ⏳ | |
| 3.8 | **Lernsession:** Karten laden die heute fällig sind | ⏳ | |
| 3.9 | **Lernsession:** Flip-Animation + Bewertungs-Buttons (Again/Hard/Good/Easy) | ⏳ | |
| 3.10 | **Lernsession:** FSRS-Werte nach Session in Supabase schreiben | ⏳ | |
| 3.11 | **Study Log:** Eintrag nach jeder Session schreiben (Datum, Dauer, Karten) | ⏳ | |
| 3.12 | **Quiz:** Konfigurationsseite (`/quiz`) | ⏳ | |
| 3.13 | **Quiz:** Claude API Wrapper in `src/lib/claude.ts` | ⏳ | |
| 3.14 | **Quiz:** Fragen via Claude generieren (aus Notiz oder Deck) | ⏳ | |
| 3.15 | **Quiz:** Quiz-Session laufen lassen + Antworten speichern | ⏳ | |
| 3.16 | **Quiz:** Ergebnis-Zusammenfassung nach Session | ⏳ | |
| 3.17 | **KI – Karten generieren:** Button in Notiz-Editor → Karten erstellen | ⏳ | |
| 3.18 | **Planer:** Prüfungstermine anlegen/bearbeiten | ⏳ | |
| 3.19 | **Planer:** Monats-Kalender mit Lern- und Prüfungstagen | ⏳ | |
| 3.20 | **Planer:** Tägliche Lernziele berechnen (Karten ÷ verbleibende Tage) | ⏳ | |

**Phase-Fortschritt:** 0 / 20 (0%)

---

### Phase 4 – Dashboard & Stats

| # | Aufgabe | Status | Notiz |
|---|---|---|---|
| 4.1 | Dashboard-Layout mit Stat-Cards (Streak, fällige Karten, heute erledigt) | ⏳ | |
| 4.2 | Streak-Berechnung aus `study_logs` | ⏳ | |
| 4.3 | Fach-Fortschritts-Balken (Karten heute erledigt / gesamt fällig) | ⏳ | |
| 4.4 | Prüfungs-Countdown auf Dashboard | ⏳ | |

**Phase-Fortschritt:** 0 / 4 (0%)

---

### Phase 5 – UI Polish

| # | Aufgabe | Status | Notiz |
|---|---|---|---|
| 5.1 | Sidebar mit Navigation, Active-State, kollabierbar | ⏳ | |
| 5.2 | Leer-Zustände für alle Seiten (Empty States mit Illustrationen) | ⏳ | |
| 5.3 | Lade-Zustände (Skeleton Cards, Spinner) | ⏳ | |
| 5.4 | Responsive Layout: Mobile Bottom Navigation | ⏳ | |
| 5.5 | Tastatur-Navigation in Lernsession (1-4, Space) | ⏳ | |
| 5.6 | `prefers-reduced-motion` für Flip-Animation | ⏳ | |
| 5.7 | Toasts / Benachrichtigungen für Erfolge (Karten generiert, Quiz abgeschlossen) | ⏳ | |

**Phase-Fortschritt:** 0 / 8 (0%)

---

### Phase 6 – Deployment

| # | Aufgabe | Status | Notiz |
|---|---|---|---|
| 6.1 | GitHub Actions Build-Pipeline + GitHub Pages einrichten | ⏳ | Unter Shoriu-Org, konsistent mit anderen Produkten |
| 6.2 | Env-Variablen als GitHub Actions Secrets eintragen | ⏳ | |
| 6.3 | Subdomain `kitobi.shoriu.app` via CNAME auf GitHub Pages konfigurieren | ⏳ | DNS-Eintrag noch ausstehend |
| 6.4 | Produktions-Supabase RLS finaler Check | ⏳ | |
| 6.5 | Erster echter Deploy + Smoke-Test | ⏳ | |

**Phase-Fortschritt:** 0 / 5 (0%)

---


### Phase 7 – Bonus: Obsidian Plugin

| # | Aufgabe | Status | Notiz |
|---|---|---|---|
| 7.1 | Obsidian Plugin Projekt initialisieren (TypeScript, Obsidian API) | ⏳ | Voraussetzung: Phase 3 komplett |
| 7.2 | Supabase-Verbindung im Plugin konfigurieren (API Key, User Auth) | ⏳ | |
| 7.3 | Command: aktive Notiz → Kitobi synchronisieren | ⏳ | |
| 7.4 | Ordner/Tags in Obsidian → Fächer in Kitobi mappen | ⏳ | |
| 7.5 | Command: Karten aus aktiver Notiz via Claude generieren | ⏳ | |

**Phase-Fortschritt:** 0 / 5 (0%)

---

## 🧠 Entscheidungen & Notizen

| Datum | Thema | Entscheidung | Grund |
|---|---|---|---|
| 14.04.2026 | App-Name | **Kitobi** (Kurzform von *Kioku no Tobira*) | Frei als Markenname; passt zur Shoriu-Ästhetik |
| 14.04.2026 | Spaced Repetition | **FSRS** via `ts-fsrs` | Modernster Algorithmus; npm-Paket verfügbar; gleiche Logik wie neues Anki |
| 14.04.2026 | Hosting | **GitHub Pages** unter `kitobi.shoriu.app` | Alle Shoriu-Produkte bereits auf GitHub; alles beisammen |
| 16.04.2026 | Obsidian-Integration | **Phase 7 (Bonus)** nach fertigem MVP | Sinnvoll als Plugin, aber erst wenn Core-Produkt steht |
| 16.04.2026 | Onboarding | **Phase 1.5** nach Auth, vor Datenbank | KI-gestützter Wizard für Fächer, Ziele, Termine beim ersten Login |
| 14.04.2026 | Claude API | Direkt im Frontend für MVP | Key in `.env`; für Produktion via Supabase Edge Function proxyen |
| 14.04.2026 | Design | Dark Mode als Standard | Lernkontext (abends, fokussiert); Violett als Primary; Outfit + Inter |

---

## 📎 Verknüpfte Dokumente

- Konzept: `kitobi-concept.md`
- Architektur: `kitobi-architecture.md`
- UI/Design: `kitobi-ui-design.md`

---

## 🔁 Session-Log

| Session | Datum | Was wurde gemacht | Nächster Schritt |
|---|---|---|---|
| 1 | 14.04.2026 | Konzept, Architektur, UI-Design und Tracker erstellt | Phase 0: Repo + Vite + Supabase Setup |
| 2 | 16.04.2026 | Repo + Supabase eingerichtet; Hosting → GitHub Pages; Obsidian → Phase 7; Onboarding Wizard → Phase 1.5 | Phase 0: Vite + React + Dependencies installieren |

---

*Tracker wird nach jeder Session aktualisiert · app-dev-tracker Skill*
