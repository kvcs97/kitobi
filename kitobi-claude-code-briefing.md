# Kitobi – Claude Code Briefing

Lies dieses Dokument vollständig bevor du irgendetwas tust.

---

## Was ist Kitobi?

Kitobi (短 für *Kioku no Tobira* – 記憶の扉 – "Die Tür der Erinnerung") ist eine persönliche
Lern-Web-App für Studierende. Teil des **Shoriu**-Produktportfolios.

Kernfunktionen: Lernkarten mit FSRS Spaced Repetition, Notizen mit TipTap Editor,
KI-gestützte Quiz-Generierung via Claude API, Lernplaner mit Prüfungsterminen,
Fortschritts-Dashboard.

---

## Dokumente im Projektordner

Lies diese 4 Dokumente als erstes – sie sind die Quelle der Wahrheit:

| Datei | Inhalt |
|---|---|
| `kitobi-concept.md` | Was die App tut, Zielgruppe, User Stories, Scope |
| `kitobi-architecture.md` | Tech Stack, Projektstruktur, DB-Schema, RLS, API-Design |
| `kitobi-ui-design.md` | Design System (Farben, Fonts, Spacing), Komponenten, Wireframes |
| `kitobi-tracker.md` | **Aktueller Entwicklungsstand** – Phasen, Tasks, Status |

---

## Tech Stack (Kurzübersicht)

- **Frontend:** Vite + React 18 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Auth, PostgreSQL, RLS)
- **State:** Zustand (UI) + TanStack Query (Server State)
- **Spaced Repetition:** ts-fsrs
- **Editor:** TipTap
- **KI:** Anthropic Claude API (`claude-sonnet-4-20250514`)
- **Hosting:** GitHub Pages unter `kitobi.shoriu.app`

---

## Aktueller Stand

- ✅ GitHub Repo angelegt
- ✅ Supabase Projekt angelegt
- ⏳ Alles andere noch offen

**Nächster Task: 0.2** – Vite + React + TypeScript initialisieren

---

## Arbeitsweise

1. Lies immer zuerst `kitobi-tracker.md` um den aktuellen Stand zu kennen
2. Arbeite Task für Task durch – nicht mehrere Phasen auf einmal
3. Halte dich an die Projektstruktur aus `kitobi-architecture.md`
4. Halte dich an die CSS-Variablen und Komponenten-Stil aus `kitobi-ui-design.md`
5. Nach jeder abgeschlossenen Aufgabe: Status im Tracker aktualisieren
6. Frage nach bevor du Architektur-Entscheidungen eigenständig änderst

---

## Wichtige Konventionen

- Alle Kommentare im Code auf **Englisch**
- CSS-Variablen aus `src/styles/tokens.css` verwenden – keine hardcodierten Farben
- Supabase-Queries immer über den Client in `src/lib/supabase.ts`
- Claude API immer über den Wrapper in `src/lib/claude.ts`
- TypeScript strict mode – keine `any` Types
- Komponenten-Dateien: PascalCase (`FlashcardViewer.tsx`)
- Hooks: camelCase mit `use`-Prefix (`useFlashcards.ts`)

---

## Start-Befehl

```
Lies alle 4 Projektdokumente im aktuellen Ordner, dann zeig mir eine kurze
Zusammenfassung des aktuellen Stands und starte mit Task 0.2 aus dem Tracker.
```

---

*Dieses Briefing bei jeder neuen Claude Code Session verwenden.*
