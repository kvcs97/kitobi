# Kitobi – Technische Architektur

> Basierend auf: kitobi-concept.md · *Kioku no Tobira – Die Tür der Erinnerung*

---

## 1. Tech Stack

| Schicht | Technologie | Begründung |
|---|---|---|
| Frontend | Vite + React 18 + TypeScript | Bekannter Stack vom Lernende-Tracker; schnelle DX, kein SSR nötig |
| Styling | Tailwind CSS + shadcn/ui | Konsistente Komponenten, passt zur Shoriu-Designsprache |
| Backend | Supabase (BaaS) | Auth, PostgreSQL, RLS, Storage – alles in einem; kein separates Backend nötig |
| Datenbank | PostgreSQL via Supabase | Relationale Daten (Karten, Notizen, Sessions) passen perfekt |
| Auth | Supabase Auth | Email/Password + OAuth; später Multi-User ohne Umbau |
| KI | Anthropic Claude API (claude-sonnet-4) | Karten- & Quiz-Generierung aus Notizen; Erklärungen bei Fehlern |
| State | Zustand + TanStack Query | Zustand für UI-State, TanStack Query für Server-State / Caching |
| Spaced Repetition | FSRS (ts-fsrs) | Modernster SR-Algorithmus (Anki-Standard); npm-Paket verfügbar |
| Hosting | GitHub Pages / Cloudflare Pages | Unter Shoriu-Domain: `kitobi.shoriu.app` |
| Markdown | TipTap Editor | Rich-Text mit Markdown-Unterstützung; erweiterbar (Code, LaTeX) |

---

## 2. Projektstruktur

```
kitobi/
├── src/
│   ├── components/
│   │   ├── ui/                  # shadcn/ui Basis-Elemente
│   │   ├── flashcards/          # FlashcardViewer, DeckList, CardEditor
│   │   ├── notes/               # NoteEditor, NoteList, SubjectBadge
│   │   ├── quiz/                # QuizRunner, QuestionCard, ResultSummary
│   │   ├── planner/             # StudyCalendar, ExamCountdown, DailyGoal
│   │   └── dashboard/           # StatsCard, StreakBadge, SubjectProgress
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Notes.tsx
│   │   ├── Decks.tsx
│   │   ├── Study.tsx            # SR-Session
│   │   ├── Quiz.tsx
│   │   ├── Planner.tsx
│   │   └── Settings.tsx
│   ├── hooks/
│   │   ├── useFlashcards.ts
│   │   ├── useNotes.ts
│   │   ├── useFSRS.ts
│   │   ├── useQuiz.ts
│   │   └── useStudyStats.ts
│   ├── lib/
│   │   ├── supabase.ts          # Supabase Client
│   │   ├── claude.ts            # Anthropic API Wrapper
│   │   ├── fsrs.ts              # FSRS-Logik (ts-fsrs)
│   │   └── utils.ts
│   ├── store/
│   │   └── uiStore.ts           # Zustand: Sidebar, Modals, aktives Fach
│   ├── types/
│   │   └── index.ts             # Alle DB-Typen als TypeScript-Interfaces
│   └── App.tsx
├── public/
├── .env.example
├── vite.config.ts
└── package.json
```

---

## 3. Routing & Seiten

| Route | Seite | Zugriffsschutz | Beschreibung |
|---|---|---|---|
| `/` | Dashboard | Auth | Übersicht: Streak, fällige Karten, Lernplan-Vorschau |
| `/login` | Login | Public | Email/Password + OAuth |
| `/notes` | Notizen | Auth | Alle Notizen nach Fach gruppiert |
| `/notes/:id` | Notiz-Detail | Auth | Editor-Ansicht für eine Notiz |
| `/decks` | Kartenstapel | Auth | Übersicht aller Decks nach Fach |
| `/decks/:id` | Deck-Detail | Auth | Karten eines Decks verwalten |
| `/study/:deckId` | Lernsession | Auth | FSRS-gesteuerte Wiederholungssession |
| `/quiz` | Quiz starten | Auth | Quiz-Konfiguration (Fach, Anzahl, Typ) |
| `/quiz/:sessionId` | Quiz laufen | Auth | Aktive Quiz-Session |
| `/planner` | Lernplan | Auth | Kalender, Prüfungstermine, Tagesziele |
| `/settings` | Einstellungen | Auth | Profil, Benachrichtigungen, API-Keys |

---

## 4. State Management

- **Lokaler State** (`useState`): Formular-Inputs, Toggle-Zustände, aktuell angezeigte Karte in der Session
- **Globaler UI-State** (`Zustand`): aktives Fach/Filter, Sidebar-Zustand, offene Modals
- **Server State** (`TanStack Query`): alle Supabase-Daten (Notizen, Karten, Sessions, Stats) – mit automatischem Caching und Invalidierung nach Mutationen
- **FSRS-State**: wird lokal in der Study-Session berechnet und am Ende als Batch-Update in Supabase geschrieben

---

## 5. Datenbankschema

### `subjects`

| Spalte | Typ | Constraint | Beschreibung |
|---|---|---|---|
| `id` | `uuid` | PK | Primärschlüssel |
| `created_at` | `timestamptz` | default now() | Erstellungszeitpunkt |
| `user_id` | `uuid` | FK → auth.users | Besitzer |
| `name` | `text` | NOT NULL | z.B. "Mathematik" |
| `color` | `text` | | Hex-Farbe für UI |
| `exam_date` | `date` | | Nächster Prüfungstermin |

### `notes`

| Spalte | Typ | Constraint | Beschreibung |
|---|---|---|---|
| `id` | `uuid` | PK | Primärschlüssel |
| `created_at` | `timestamptz` | default now() | |
| `updated_at` | `timestamptz` | | Letzte Bearbeitung |
| `user_id` | `uuid` | FK → auth.users | |
| `subject_id` | `uuid` | FK → subjects | |
| `title` | `text` | NOT NULL | Titel der Notiz |
| `content` | `text` | | Markdown/TipTap JSON |

### `flashcard_decks`

| Spalte | Typ | Constraint | Beschreibung |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `created_at` | `timestamptz` | default now() | |
| `user_id` | `uuid` | FK → auth.users | |
| `subject_id` | `uuid` | FK → subjects | |
| `note_id` | `uuid` | FK → notes, nullable | Falls aus Notiz generiert |
| `name` | `text` | NOT NULL | Name des Decks |

### `flashcards`

| Spalte | Typ | Constraint | Beschreibung |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `created_at` | `timestamptz` | default now() | |
| `deck_id` | `uuid` | FK → flashcard_decks | |
| `front` | `text` | NOT NULL | Vorderseite |
| `back` | `text` | NOT NULL | Rückseite |
| `stability` | `float` | default 0 | FSRS: Stabilitätswert |
| `difficulty` | `float` | default 0 | FSRS: Schwierigkeitswert |
| `due_date` | `timestamptz` | default now() | Nächste fällige Wiederholung |
| `state` | `int` | default 0 | FSRS: New/Learning/Review/Relearning |
| `reps` | `int` | default 0 | Anzahl Wiederholungen |
| `lapses` | `int` | default 0 | Anzahl Fehler |

### `quiz_sessions`

| Spalte | Typ | Constraint | Beschreibung |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `created_at` | `timestamptz` | default now() | |
| `user_id` | `uuid` | FK → auth.users | |
| `subject_id` | `uuid` | FK → subjects, nullable | |
| `score` | `int` | | Richtige Antworten |
| `total` | `int` | | Gesamtfragen |
| `completed_at` | `timestamptz` | | Abschlusszeit |

### `quiz_questions`

| Spalte | Typ | Constraint | Beschreibung |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `session_id` | `uuid` | FK → quiz_sessions | |
| `question` | `text` | NOT NULL | Fragetext |
| `type` | `text` | | multiple_choice / fill / free |
| `correct_answer` | `text` | NOT NULL | |
| `user_answer` | `text` | | Tatsächliche Antwort |
| `options` | `jsonb` | | Antwortoptionen bei MC |
| `is_correct` | `bool` | | |

### `study_logs`

| Spalte | Typ | Constraint | Beschreibung |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `created_at` | `timestamptz` | default now() | |
| `user_id` | `uuid` | FK → auth.users | |
| `subject_id` | `uuid` | FK → subjects, nullable | |
| `date` | `date` | NOT NULL | Lerntag |
| `duration_min` | `int` | | Lernzeit in Minuten |
| `cards_reviewed` | `int` | | Anzahl geübter Karten |

### Relationen

```
auth.users  1 ──── N  subjects
auth.users  1 ──── N  notes
auth.users  1 ──── N  flashcard_decks
auth.users  1 ──── N  quiz_sessions
auth.users  1 ──── N  study_logs

subjects    1 ──── N  notes
subjects    1 ──── N  flashcard_decks
subjects    1 ──── N  quiz_sessions

flashcard_decks  1 ──── N  flashcards
quiz_sessions    1 ──── N  quiz_questions

notes       1 ──── N  flashcard_decks  (optional, bei KI-Generierung)
```

### Row Level Security (RLS)

| Tabelle | Policy | Regel |
|---|---|---|
| alle | SELECT | `auth.uid() = user_id` |
| alle | INSERT | `auth.uid() = user_id` |
| alle | UPDATE | `auth.uid() = user_id` |
| alle | DELETE | `auth.uid() = user_id` |

> Solange Kitobi single-user ist, reicht eine einfache `user_id`-Policy für alle Tabellen. Bei Multi-User-Erweiterung (Gruppen/Sharing) werden separate Policies pro Tabelle nötig.

---

## 6. Authentifizierung & Rollen

| Rolle | Beschreibung | Berechtigungen |
|---|---|---|
| `authenticated` | Eingeloggter Nutzer | Voller Zugriff auf eigene Daten (RLS) |
| `anon` | Nicht eingeloggt | Kein Datenzugriff; nur Login-Seite |

**Auth-Flow:**
1. User öffnet `kitobi.shoriu.app` → React Router prüft Session
2. Keine Session → Redirect zu `/login`
3. Login via Supabase Auth (Email/Password oder OAuth)
4. Supabase gibt JWT zurück → in `localStorage` gespeichert
5. Supabase Client hängt JWT automatisch an alle Requests
6. RLS auf DB-Ebene filtert Daten nach `auth.uid()`
7. Logout → Token löschen → Redirect zu `/login`

---

## 7. API / Datenzugriff

Primär **direkt via Supabase Client** – kein separates Backend nötig.

**Externe API: Anthropic Claude**

Die Claude API wird direkt vom Frontend aufgerufen (API-Key in `.env`, nur client-seitig). Für Produktionsumgebung empfehlenswert: Supabase Edge Function als Proxy (Key serverseitig).

| Operation | Beschreibung |
|---|---|
| Karten aus Notiz generieren | Notiz-Content → Claude → Array von `{front, back}` → bulk insert in `flashcards` |
| Quiz generieren | Notiz oder Deck → Claude → Array von Fragen → insert in `quiz_questions` |
| Erklärung bei Fehler | Falsch beantwortete Karte → Claude → Erklärungstext (kein DB-Eintrag) |
| Notiz zusammenfassen | Notiz-Content → Claude → Zusammenfassung (optional in Notiz speichern) |

**Wichtige Supabase-Queries:**

| Operation | Tabelle | Beschreibung |
|---|---|---|
| `select` | `flashcards` | Alle Karten mit `due_date <= now()` für heutige Session |
| `update` | `flashcards` | FSRS-Werte nach Session (stability, difficulty, due_date, state) |
| `select` | `notes` | Alle Notizen eines Fachs, sortiert nach `updated_at` |
| `insert` | `study_logs` | Eintrag nach jeder Lernsession |
| `select` | `study_logs` | Streak-Berechnung: aufeinanderfolgende Tage mit Eintrag |

---

## 8. Umgebungsvariablen

```env
# .env.example

# Supabase
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Anthropic Claude API
VITE_ANTHROPIC_API_KEY=your-claude-api-key

# App
VITE_APP_NAME=Kitobi
VITE_APP_VERSION=0.1.0
```

---

## 9. Bekannte Risiken & Entscheidungen

| Thema | Entscheidung | Begründung / Risiko |
|---|---|---|
| FSRS vs. SM-2 | **FSRS** (ts-fsrs) | Modernerer Algorithmus; bessere Retention; aber etwas komplexer als SM-2 |
| Claude API direkt im Frontend | Für MVP akzeptabel | API-Key ist in `.env` und nur im Browser sichtbar – für Produktion via Supabase Edge Function proxyen |
| TipTap vs. reines Markdown | **TipTap** | Bessere UX; WYSIWYG + Markdown-Shortcuts; Komplexitäts-Overhead ist überschaubar |
| Multi-User-Readiness | RLS von Anfang an aktivieren | Auch wenn zunächst single-user: RLS jetzt einbauen spart massiven Umbau später |
| Hosting unter Shoriu | GitHub Pages oder Cloudflare Pages | Cloudflare Pages bevorzugt: schnellere Builds, bessere Edge-Performance, kostenlos |

---

## 10. Nächste Schritte

- [ ] Architektur reviewen und freigeben
- [ ] Supabase Projekt anlegen unter `kitobi` und Schema deployen
- [ ] Vite + React Projekt initialisieren (`npm create vite@latest`)
- [ ] `ts-fsrs`, `@supabase/supabase-js`, `zustand`, `@tanstack/react-query`, `tiptap` installieren
- [ ] UI/Design festlegen → *app-ui-design Skill*
- [ ] Entwicklung tracken → *app-dev-tracker Skill*

---

*Erstellt mit dem app-architecture Skill · April 2026*
