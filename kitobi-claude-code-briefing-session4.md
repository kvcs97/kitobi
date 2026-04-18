# Kitobi – Claude Code Briefing (Session 4)

Lies dieses Dokument vollständig bevor du irgendetwas tust.

---

## Was ist Kitobi?

Kitobi (kurz für *Kioku no Tobira* – 記憶の扉 – "Die Tür der Erinnerung") ist eine persönliche
Lern-Web-App für Studierende. Teil des **Shoriu**-Produktportfolios.

Kernfunktionen: Lernkarten mit FSRS Spaced Repetition, Notizen mit TipTap Editor,
KI-gestützte Quiz-Generierung via Claude API, Lernplaner mit Prüfungsterminen,
Fortschritts-Dashboard, KI-Onboarding Wizard.

---

## Dokumente im Projektordner

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
- **KI:** Anthropic Claude API (`claude-sonnet-4-20250514`) → `src/lib/claude.ts`
- **Hosting:** GitHub Pages unter `kitobi.shoriu.app`

---

## Aktueller Stand (Stand: 17. April 2026)

✅ **Komplett abgeschlossen:** Phase 0, 1, 1.5, 2, 3
🔄 **Nächste Phase:** Phase 4 – Dashboard & Stats

| Task | Status |
|---|---|
| 4.1 Dashboard-Layout mit Stat-Cards (Streak, fällige Karten, heute erledigt) | ⏳ ← **start here** |
| 4.2 Streak-Berechnung aus `study_logs` | ⏳ |
| 4.3 Fach-Fortschritts-Balken | ⏳ |
| 4.4 Prüfungs-Countdown | ⏳ |

Danach direkt weiter mit **Phase 5 – UI Polish** (7 Tasks) und **Phase 6 – Deployment** (5 Tasks).

---

## Empfohlene Reihenfolge für diese Session

**Block A – Phase 4: Dashboard (4 Tasks)**
- `4.2` Streak-Logik zuerst implementieren (`useStreak` Hook aus `study_logs`)
- `4.1` Dashboard-Layout: Stat-Cards (Streak 🔥, fällige Karten 📅, heute erledigt ✅)
- `4.3` Fach-Fortschritts-Balken pro Fach (fällige Karten / Gesamtkarten)
- `4.4` Prüfungs-Countdown: nächste 3 Prüfungen mit Tagen-Countdown

**Block B – Phase 5: UI Polish (7 Tasks)**
- `5.1` Sidebar: Active-State, kollabierbar (Icon-Only bei <1024px)
- `5.2` Empty States für alle Seiten (Notizen, Decks, Planer, Dashboard)
- `5.3` Loading States: Skeleton Cards überall wo Daten geladen werden
- `5.4` Responsive: Mobile Bottom Navigation (5 Icons: Home/Notizen/Karten/Quiz/Planer)
- `5.5` Tastatur-Navigation in Lernsession (Space = aufdecken, 1/2/3/4 = Again/Hard/Good/Easy)
- `5.6` `prefers-reduced-motion` für Flip-Animation
- `5.7` Toasts für Erfolge (shadcn/ui `toast` oder `sonner`)

**Block C – Phase 6: Deployment (5 Tasks)**
- `6.1` GitHub Actions Workflow: `npm run build` → nach `gh-pages` Branch deployen
- `6.2` GitHub Actions Secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ANTHROPIC_API_KEY`
- `6.3` Custom Domain `kitobi.shoriu.app` in GitHub Pages + CNAME-Datei im Repo
- `6.4` Supabase RLS finaler Check: alle Policies testen (SELECT/INSERT/UPDATE/DELETE)
- `6.5` Erster Deploy + Smoke-Test: Login, Onboarding, Karte lernen, Quiz durchführen

---

## Dashboard – Design-Referenz (aus kitobi-ui-design.md)

```
┌──────────────┬──────────────────────────────────────┐
│  Sidebar     │  Guten Morgen, [Name] 👋              │
│              │  [Datum]                             │
│              │                                      │
│              │  ┌──────────┐ ┌──────────┐ ┌──────┐ │
│              │  │ 🔥 Streak│ │📅 fällig │ │✅done│ │
│              │  └──────────┘ └──────────┘ └──────┘ │
│              │                                      │
│              │  Fach-Fortschritt (Progress Bars)    │
│              │  Nächste Prüfungen (Countdown)       │
│              │  [▶ Lernen starten] CTA              │
└──────────────┴──────────────────────────────────────┘
```

Streak-Logik: aufeinanderfolgende Tage mit mind. 1 Eintrag in `study_logs`.

---

## GitHub Actions Workflow (Vorlage für 6.1)

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_ANTHROPIC_API_KEY: ${{ secrets.VITE_ANTHROPIC_API_KEY }}
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: kitobi.shoriu.app
```

**Wichtig für Vite + React Router:** `vite.config.ts` braucht `base: '/'` und eine `404.html` die auf `index.html` redirected (SPA-Routing auf GitHub Pages).

---

## Wichtige Konventionen

- Alle Kommentare auf **Englisch**
- CSS-Variablen aus `src/styles/tokens.css` – keine hardcodierten Farben
- TypeScript strict – kein `any`
- Nach jedem abgeschlossenen Task: `kitobi-tracker.md` aktualisieren

---

## Start-Befehl

```
Lies kitobi-tracker.md und starte mit Phase 4 –
beginne mit Task 4.2 (useStreak Hook), dann 4.1 Dashboard-Layout.
```

---

*Session 4 · 17. April 2026 · app-dev-tracker Skill*
