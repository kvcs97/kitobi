# Kitobi – Entwicklungs-Tracker

**Letzte Aktualisierung:** 18. April 2026
**Gesamtfortschritt:** 65 / 68 Aufgaben abgeschlossen (96%)

---

## 🔵 Aktueller Fokus

> **Phase 5 – UI Polish** ✅ abgeschlossen
> Phase 0–5 vollständig abgeschlossen. Als nächstes: Phase 6 – Deployment (GitHub Actions, Custom Domain, RLS-Check).

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
| 0.3 | Tailwind CSS + shadcn/ui konfigurieren | ✅ | Erledigt |
| 0.4 | Supabase Projekt anlegen (Name: `kitobi`) | ✅ | Erledigt |
| 0.5 | `.env.local` mit Supabase URL + Anon Key + Claude API Key anlegen | ✅ | Erledigt |
| 0.6 | Projektstruktur nach Architektur-Doc anlegen (`pages/`, `components/`, `hooks/`, `lib/`, `store/`, `types/`) | ✅ | Erledigt |
| 0.7 | CSS-Variablen (`--color-*`) aus UI-Design in `src/styles/tokens.css` eintragen | ✅ | Erledigt |
| 0.8 | Google Fonts einbinden: Outfit, Inter, JetBrains Mono | ✅ | via @fontsource-variable; in index.css + tokens.css eingebunden |
| 0.9 | `ts-fsrs`, `@supabase/supabase-js`, `zustand`, `@tanstack/react-query`, `react-router-dom` installieren | ✅ | Alle 5 Pakete installiert |
| 0.10 | TipTap Editor installieren (`@tiptap/react`, `@tiptap/starter-kit`) | ✅ | Erledigt |

**Phase-Fortschritt:** 10 / 10 (100%) ✅

---

### Phase 1 – Auth

| # | Aufgabe | Status | Notiz |
|---|---|---|---|
| 1.1 | Supabase Auth aktivieren (Email/Password) | ✅ | Default in Supabase; im Dashboard unter Auth → Providers → Email prüfen |
| 1.2 | `supabase.ts` Client-Wrapper in `src/lib/` erstellen | ✅ | signIn, signUp, signOut, getSession, getUser |
| 1.3 | Login-Seite (`/login`) mit Email/Passwort-Formular | ✅ | shadcn Card + Input + Label; Fehleranzeige; navigate nach Login |
| 1.4 | Auth-State in Zustand-Store verwalten (eingeloggt / nicht) | ✅ | authStore.ts: user, session, initialized; initAuth() in main.tsx |
| 1.5 | Protected Route Wrapper – Redirect zu `/login` wenn nicht eingeloggt | ✅ | ProtectedRoute.tsx; Spinner während initialized=false; alle Routen gewrappt |
| 1.6 | Logout-Funktion in Settings/Sidebar | ✅ | Settings.tsx: signOut + navigate(/login); User-Email anzeigen |

**Phase-Fortschritt:** 6 / 6 (100%) ✅

---

### Phase 1.5 – Onboarding Wizard

| # | Aufgabe | Status | Notiz |
|---|---|---|---|
| 1.5.1 | Onboarding-Flow Routing: nach erstem Login auf `/onboarding` leiten, danach nie wieder | ✅ | ProtectedRoute prüft onboardingCompleted; /onboarding Route in App.tsx |
| 1.5.2 | Tabelle `user_profiles` anlegen (name, study_program, semester, daily_goal_min, onboarding_completed) | ✅ | SQL in supabase/migrations/001_user_profiles.sql — manuell im Supabase SQL-Editor ausführen |
| 1.5.3 | Schritt 1 – Profil: Name, Studiengang, Semester eingeben | ✅ | StepProfile.tsx |
| 1.5.4 | Schritt 2 – Fächer: Fächer eingeben + KI schlägt passende Fächer basierend auf Studiengang vor | ✅ | StepSubjects.tsx; Claude API → auswählbare Chips |
| 1.5.5 | Schritt 3 – Prüfungstermine: bekannte Termine direkt eintragen | ✅ | StepExamDates.tsx |
| 1.5.6 | Schritt 4 – Lernziele: Minuten/Tag, wie viele Tage vor Prüfung anfangen | ✅ | StepGoals.tsx; Button-Auswahl |
| 1.5.7 | Schritt 5 – KI-Zusammenfassung: Claude fasst Einrichtung zusammen + gibt personalisierten Starttipp | ✅ | StepSummary.tsx; summarizeOnboardingSetup |
| 1.5.8 | Fortschrittsanzeige im Wizard (Schritte 1–5, aktiver Schritt hervorgehoben) | ✅ | StepIndicator.tsx |
| 1.5.9 | Onboarding überspringen-Option (mit Hinweis dass es später in Settings nachholbar ist) | ✅ | Link unterhalb jedes Schritts |

**Phase-Fortschritt:** 9 / 9 (100%) ✅

---

### Phase 2 – Datenbank & Schema

| # | Aufgabe | Status | Notiz |
|---|---|---|---|
| 2.1 | Tabelle `user_profiles` anlegen + RLS (wird in Phase 1.5 benötigt) | ✅ | Erledigt in Phase 1.5 |
| 2.2 | Tabelle `subjects` anlegen + RLS aktivieren | ✅ | SQL: 002_subjects.sql — im Supabase SQL-Editor ausführen |
| 2.3 | Tabelle `notes` anlegen + RLS | ✅ | SQL: 003_notes.sql |
| 2.4 | Tabellen `flashcard_decks` + `flashcards` anlegen + RLS | ✅ | SQL: 004_flashcards.sql; FSRS-Felder enthalten |
| 2.5 | Tabellen `quiz_sessions` + `quiz_questions` anlegen + RLS | ✅ | SQL: 005_quiz.sql |
| 2.6 | Tabelle `study_logs` anlegen + RLS | ✅ | SQL: 006_study_logs.sql |
| 2.7 | TypeScript-Typen aus DB-Schema generieren (`supabase gen types`) | ✅ | src/types/database.types.ts; supabase.ts + index.ts aktualisiert |
| 2.8 | Seed-Daten: 2 Test-Fächer + 5 Testkarten anlegen | ✅ | SQL: 008_seed.sql — User-ID ersetzen und ausführen |

**Phase-Fortschritt:** 8 / 8 (100%) ✅

---

### Phase 3 – Kernfunktionen (MVP)

| # | Aufgabe | Status | Notiz |
|---|---|---|---|
| 3.1 | **Fächer:** CRUD (anlegen, umbenennen, löschen, Farbe wählen) | ✅ | useSubjects Hook; SubjectDialog + SubjectList; QueryClientProvider |
| 3.2 | **Notizen:** Liste nach Fach gruppiert (`/notes`) | ✅ | Fach-Sidebar + gruppierte Karten; useNotes Hook |
| 3.3 | **Notizen:** TipTap Editor mit Autosave (`/notes/:id`) | ✅ | NoteEditor.tsx + TipTapEditor.tsx; debounced 2s autosave; Toolbar (Bold/Italic/Strike/H2/H3/List/Code/Quote/Undo/Redo); SaveIndicator |
| 3.4 | **Notizen:** Neue Notiz erstellen, löschen | ✅ | In Notes.tsx integriert (create + delete mit Bestätigung) |
| 3.5 | **Karten:** Deck-Übersicht (`/decks`) | ✅ | Grid mit DeckCards; fällige Karten + Lernen-Button; DeckDialog; useDecks + useDeckStats |
| 3.6 | **Karten:** Karten manuell erstellen/bearbeiten/löschen | ✅ | DeckDetail.tsx (/decks/:id); CardDialog; useCards (create/update/remove) |
| 3.7 | **FSRS:** `useFSRS` Hook implementieren (ts-fsrs, Rating → neue Intervalle) | ✅ | lib/fsrs.ts + useFSRS.ts; toFsrsCard; getSchedulePreviews; applyRating; formatInterval |
| 3.8 | **Lernsession:** Karten laden die heute fällig sind | ✅ | In Study.tsx; Query: flashcards where due_date <= now() ordered by due_date |
| 3.9 | **Lernsession:** Flip-Animation + Bewertungs-Buttons (Again/Hard/Good/Easy) | ✅ | CSS 3D flip; 4 Rating-Buttons mit Intervall-Vorschau; Fortschrittsbalken |
| 3.10 | **Lernsession:** FSRS-Werte nach Session in Supabase schreiben | ✅ | Immediate-save nach jeder Bewertung; deck-stats + cards invalidiert |
| 3.11 | **Study Log:** Eintrag nach jeder Session schreiben (Datum, Dauer, Karten) | ✅ | saveStudyLog() schreibt in study_logs am Session-Ende |
| 3.12 | **Quiz:** Konfigurationsseite (`/quiz`) | ✅ | Quelle (Notiz/Deck), Fragenanzahl (5/10/15), Start-Button |
| 3.13 | **Quiz:** Claude API Wrapper in `src/lib/claude.ts` | ✅ | Bereits vorhanden; generateQuizQuestions + generateFlashcards |
| 3.14 | **Quiz:** Fragen via Claude generieren (aus Notiz oder Deck) | ✅ | HTML→Text-Strip; Deck-Content aus Karten; Claude API call |
| 3.15 | **Quiz:** Quiz-Session laufen lassen + Antworten speichern | ✅ | Multiple Choice; sofortiges Feedback; Antworten in quiz_sessions + quiz_questions |
| 3.16 | **Quiz:** Ergebnis-Zusammenfassung nach Session | ✅ | Score in %, Emoji, "Neues Quiz"/"Dashboard" Buttons |
| 3.17 | **KI – Karten generieren:** Button in Notiz-Editor → Karten erstellen | ✅ | "KI-Karten" Button im Header; GenerateCardsDialog; bestehendes oder neues Deck |
| 3.18 | **Planer:** Prüfungstermine anlegen/bearbeiten | ✅ | Dialog mit Date-Input; exam_date per Fach; über useSubjects.update |
| 3.19 | **Planer:** Monats-Kalender mit Lern- und Prüfungstagen | ✅ | Monats-Grid; Prüfungstermine farbig markiert; Monat-Navigation |
| 3.20 | **Planer:** Tägliche Lernziele berechnen (Karten ÷ verbleibende Tage) | ✅ | dueCards / daysLeft; pro Fach in Sidebar-Widget |

**Phase-Fortschritt:** 20 / 20 (100%) ✅

---

### Phase 4 – Dashboard & Stats

| # | Aufgabe | Status | Notiz |
|---|---|---|---|
| 4.1 | Dashboard-Layout mit Stat-Cards (Streak, fällige Karten, heute erledigt) | ✅ | Dashboard.tsx; StatCard-Komponente; Greeting mit Tageszeit |
| 4.2 | Streak-Berechnung aus `study_logs` | ✅ | useStreak in useStudyStats.ts; reviewedToday + durationToday |
| 4.3 | Fach-Fortschritts-Balken (Karten heute erledigt / gesamt fällig) | ✅ | SubjectProgress-Komponente; due/total per subject via decks join |
| 4.4 | Prüfungs-Countdown auf Dashboard | ✅ | ExamCountdown-Komponente; nächste 3 Prüfungen; Farbkodierung nach Dringlichkeit |

**Phase-Fortschritt:** 4 / 4 (100%) ✅

---

### Phase 5 – UI Polish

| # | Aufgabe | Status | Notiz |
|---|---|---|---|
| 5.1 | Sidebar mit Navigation, Active-State, kollabierbar | ✅ | AppLayout + Sidebar.tsx; icon-only <1024px; toggle-Button; nested routes in App.tsx |
| 5.2 | Leer-Zustände für alle Seiten (Empty States mit Illustrationen) | ✅ | Dashboard: keine Fächer; Notes + Decks bereits vorhanden |
| 5.3 | Lade-Zustände (Skeleton Cards, Spinner) | ✅ | Dashboard Skeleton; Notes + Decks bereits vorhanden |
| 5.4 | Responsive Layout: Mobile Bottom Navigation | ✅ | BottomNav.tsx; fixed bottom; md:hidden; 5 Icons |
| 5.5 | Tastatur-Navigation in Lernsession (1-4, Space) | ✅ | Study.tsx useEffect; Space=flip, 1=Again, 2=Hard, 3=Good, 4=Easy |
| 5.6 | `prefers-reduced-motion` für Flip-Animation | ✅ | @media in index.css; transition: none |
| 5.7 | Toasts / Benachrichtigungen für Erfolge (Karten generiert, Quiz abgeschlossen) | ✅ | sonner installiert; Toast in Study, Quiz, GenerateCardsDialog |

**Phase-Fortschritt:** 7 / 7 (100%) ✅

---

### Phase 6 – Deployment

| # | Aufgabe | Status | Notiz |
|---|---|---|---|
| 6.1 | GitHub Actions Build-Pipeline + GitHub Pages einrichten | ✅ | `.github/workflows/deploy.yml`; peaceiris/actions-gh-pages@v4; npm ci + build |
| 6.2 | Env-Variablen als GitHub Actions Secrets eintragen | ⏳ | Manuell in GitHub: Settings → Secrets → VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_ANTHROPIC_API_KEY |
| 6.3 | Subdomain `kitobi.shoriu.com` via CNAME auf GitHub Pages konfigurieren | ✅ | `public/CNAME` angelegt; 404.html SPA-Routing; index.html Redirect-Restore; vite.config.ts `base: '/'` |
| 6.4 | Produktions-Supabase RLS finaler Check | ✅ | Alle 7 Tabellen: RLS aktiv, for all + auth.uid(); Flashcards + quiz_questions via Join-Ownership; no gaps found |
| 6.5 | Erster echter Deploy + Smoke-Test | ⏳ | Nach Secrets-Setup: git push → Actions-Pipeline → kitobi.shoriu.com |

**Phase-Fortschritt:** 3 / 5 (60%)

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
| 14.04.2026 | Hosting | **GitHub Pages** unter `kitobi.shoriu.com` | Alle Shoriu-Produkte bereits auf GitHub; alles beisammen |
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
| 3 | 17.04.2026 | Phase 3 komplett: TipTap Editor, Deck-CRUD, FSRS-Session, Quiz+Claude, KI-Karten, Planer | Phase 4: Dashboard + Stats |
| 4 | 18.04.2026 | Phase 4 komplett: useStreak Hook, Dashboard-Layout (Stat-Cards, Subject-Progress, Exam-Countdown), tsconfig-Fix | Phase 5: UI Polish |
| 5 | 18.04.2026 | Phase 5 komplett: AppLayout+Sidebar (kollabierbar), BottomNav, Tastatur-Navigation, prefers-reduced-motion, sonner Toasts | Phase 6: Deployment |
| 6 | 18.04.2026 | Phase 6 teilw.: GitHub Actions deploy.yml, CNAME, SPA-404.html, RLS-Check, prod Build erfolgreich | Manuell: Secrets eintragen + Push |

---

*Tracker wird nach jeder Session aktualisiert · app-dev-tracker Skill*
