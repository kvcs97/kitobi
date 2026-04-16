# Kitobi – UI/UX Design

> Basierend auf: kitobi-concept.md + kitobi-architecture.md
> *Kioku no Tobira – Die Tür der Erinnerung*

---

## 1. Design Persona

> "Kitobi feels **fokussiert**, **warm**, und **geerdet**. Es ist das Tool, das sich anfühlt wie ein aufgeräumter Schreibtisch mit einer guten Tasse Tee – alles was du brauchst ist da, nichts lenkt ab."

### Inspiration & Referenzen

- **Obsidian** – dichte Informationsarchitektur ohne visuellen Lärm; dunkle Oberflächen die Tiefe erzeugen
- **Linear** – präzises UI mit feinen Details; subtile Animationen die sich verdient anfühlen
- **Anki (Web)** – funktional und klar; Kitobi macht das aber schöner ohne die Effizienz zu opfern

---

## 2. Design System

### 2.1 Farbpalette

Dark Mode als Standard – passt zum Lernkontext (abends, konzentriert, wenig Ablenkung).

| Role | Variable | Hex | Usage |
|---|---|---|---|
| Primary | `--color-primary` | `#C084FC` | CTAs, aktive Nav-Items, Links – weiches Violett (passend zu Shoriu) |
| Primary Dark | `--color-primary-dark` | `#A855F7` | Hover auf Primary |
| Secondary | `--color-secondary` | `#67E8F9` | Akzente, Tags, Highlights – helles Cyan |
| Background | `--color-bg` | `#0F0F13` | Seiten-Hintergrund |
| Surface | `--color-surface` | `#1A1A24` | Karten, Panels, Inputs |
| Surface Raised | `--color-surface-raised` | `#22222F` | Hover-Zustände, verschachtelte Karten |
| Border | `--color-border` | `#2E2E40` | Divider, Input-Rahmen |
| Text Primary | `--color-text` | `#F0EEF8` | Haupttext |
| Text Muted | `--color-text-muted` | `#7B7A96` | Labels, Platzhalter, Metadaten |
| Success | `--color-success` | `#4ADE80` | Richtige Antwort, Streak aktiv |
| Warning | `--color-warning` | `#FACC15` | Bald fällige Karten, Hinweise |
| Danger | `--color-danger` | `#F87171` | Falsche Antwort, Fehler, Löschen |

> **Fach-Farben:** Jedes Subject bekommt eine eigene Akzentfarbe (user-definiert, aus einer Auswahl von 8–10 Pastelltönen). Diese erscheinen als linker Rand auf Karten und als Badge-Hintergrund.

### 2.2 Typografie

| Role | Font | Size | Weight | Usage |
|---|---|---|---|---|
| Heading 1 | Outfit | 2rem | 700 | Seitentitel |
| Heading 2 | Outfit | 1.5rem | 600 | Abschnittstitel |
| Heading 3 | Outfit | 1.25rem | 600 | Kartentitel, Panel-Header |
| Body | Inter | 1rem | 400 | Hauptinhalt, Notizen |
| Small | Inter | 0.875rem | 400 | Labels, Meta, Timestamps |
| Mono | JetBrains Mono | 0.875rem | 400 | Code in Notizen, IDs |

> **Outfit** für Überschriften: geometrisch, leicht futuristisch, aber warm.
> **Inter** für Body: maximale Lesbarkeit, bewährt.
> Beide via Google Fonts.

### 2.3 Spacing & Layout

```
Base unit: 4px

Spacing scale:
  xs:   4px   (0.25rem)  – Icon-Gaps, Inline-Abstände
  sm:   8px   (0.5rem)   – Interne Padding in kompakten Elementen
  md:   16px  (1rem)     – Standard-Padding in Karten, Buttons
  lg:   24px  (1.5rem)   – Abstand zwischen Sektionen
  xl:   32px  (2rem)     – Seiten-Padding oben/unten
  2xl:  48px  (3rem)     – Großzügige Trennungen
  3xl:  64px  (4rem)     – Hero-Bereiche, leere Zustände

Border Radius:
  sm:   4px    – Tags, kleine Badges
  md:   8px    – Buttons, Inputs, kleine Karten
  lg:   12px   – Haupt-Karten, Modals
  xl:   16px   – Lernkarten (Flashcard-Viewer)
  full: 9999px – Pill-Badges, Avatare

Shadows (subtil, da Dark Mode):
  sm:  0 1px 3px rgba(0,0,0,0.4)
  md:  0 4px 12px rgba(0,0,0,0.4)
  lg:  0 8px 24px rgba(0,0,0,0.5)
  glow: 0 0 20px rgba(192,132,252,0.15)  – für aktive Karten / CTAs
```

### 2.4 Komponenten

**Button**
- Primary: `--color-primary` Hintergrund, dunkler Text (`#0F0F13`), `border-radius: md`, `padding: sm lg`; Hover → `--color-primary-dark` + `glow` Shadow
- Secondary: transparenter Hintergrund, `1px solid --color-primary`, `--color-primary` Text
- Danger: `--color-danger` Hintergrund
- Ghost: kein Hintergrund, `--color-text-muted` Text, bei Hover `--color-surface-raised` Hintergrund
- Disabled: 40% opacity, `cursor: not-allowed`
- Icon-Button: quadratisch, Ghost-Stil, leicht größere Touch-Target-Fläche

**Input / Textarea / Select**
- Hintergrund: `--color-surface`
- Border: `1px solid --color-border`
- Focus: `2px solid --color-primary` outline, kein Standard-Browser-Ring
- Fehler: `1px solid --color-danger` + Fehlermeldung darunter in `--color-danger`, `small`
- Placeholder: `--color-text-muted`
- Padding: `sm md`

**Card**
- Hintergrund: `--color-surface`
- Border: `1px solid --color-border`
- Border-Radius: `lg`
- Shadow: `sm`
- Padding: `lg`
- Hover (bei klickbaren Cards): `--color-surface-raised` + `border-color: --color-primary` (20% opacity)
- Subject-Karte: linker `4px` Rand in der Fach-Farbe

**Flashcard (Lernkarte)**
- Großes zentriertes Layout, `border-radius: xl`
- Vorder-/Rückseite mit Flip-Animation (CSS transform rotateY)
- Fach-Farbe als subtiler `glow` Shadow
- Bewertungs-Buttons darunter: Again / Hard / Good / Easy in aufsteigender Grün-Intensität

**Badge / Tag**
- Pill-Form (`border-radius: full`)
- Hintergrund: 15% Opacity der Status-Farbe
- Text: volle Status-Farbe
- Zwei Größen: `sm` (Labels) und `md` (Fach-Tags)

**Navigation (Sidebar)**
- Breite: 240px (Desktop), kollabierbar auf 64px (Icon-Only)
- Hintergrund: `--color-surface`
- Border-Right: `1px solid --color-border`
- Logo / App-Name oben: "Kitobi" in Outfit 700, kleines Kanji-Symbol daneben
- Nav-Items: Icon + Label, `border-radius: md`
- Aktiver Item: `--color-primary` Hintergrund (10% opacity), `--color-primary` Text + Icon
- Hover: `--color-surface-raised`
- Unten: Benutzer-Avatar + Name + Settings-Link

**Progress Bar**
- Hintergrund: `--color-border`
- Füllstand: `--color-primary` oder Fach-Farbe
- `border-radius: full`
- Für Streak und Kartenfortschritt

**TipTap Editor**
- Hintergrund: `--color-surface`
- Toolbar oben: Ghost-Buttons für Bold, Italic, Heading, Code, Liste
- Schreibbereich: `color: --color-text`, `font: Inter 1rem`
- Code-Blöcke: `--color-bg` Hintergrund, JetBrains Mono
- AI-Button: floating am rechten Rand, `--color-primary` mit Sparkle-Icon

---

## 3. Seitenstruktur & Wireframes

### Dashboard (`/`)

**Purpose:** Überblick über den aktuellen Lernstand und tagesaktuelle Aufgaben
**Users:** Eingeloggter Nutzer

```
┌─────────────────────────────────────────────────────┐
│  ◈ Kitobi          [Suche]              [Avatar]    │
├──────────────┬──────────────────────────────────────┤
│              │  Guten Morgen, Adam 👋               │
│  🏠 Dashboard│  Dienstag, 14. April                 │
│  📝 Notizen  │                                      │
│  🃏 Karten   │  ┌──────────┐ ┌──────────┐ ┌──────┐ │
│  🧪 Quiz     │  │ 🔥 12    │ │ 📅 24    │ │ ✅ 8 │ │
│  📅 Planer   │  │ Tage     │ │ fällig   │ │heute │ │
│              │  │ Streak   │ │ Karten   │ │ done │ │
│  ──────────  │  └──────────┘ └──────────┘ └──────┘ │
│  ⚙️ Settings │                                      │
│  [Avatar]    │  Heute lernen                        │
│  Adam        │  ┌────────────────────────────────┐  │
└──────────────┤  │ Mathematik    ████░░░░ 12/30   │  │
               │  │ Geschichte    ██░░░░░░  4/20   │  │
               │  └────────────────────────────────┘  │
               │                                      │
               │  Nächste Prüfungen                   │
               │  ┌─────────────────────────────────┐ │
               │  │ 📚 Analysis II   in 14 Tagen    │ │
               │  │ 📚 Statistik     in 28 Tagen    │ │
               │  └─────────────────────────────────┘ │
               │                                      │
               │  [▶ Lernen starten]                  │
               └──────────────────────────────────────┘

Key elements:
- Streak-Counter: prominent oben, Feuer-Icon, motivierend
- Fällige Karten heute: Zahl + direkter CTA "Lernen starten"
- Fach-Fortschritt: Pro Fach mit farbiger Progress Bar
- Prüfungs-Countdown: nächste 3 Prüfungstermine

Empty state: "Willkommen bei Kitobi! Erstelle dein erstes Fach um loszulegen." + CTA
Loading state: Skeleton Cards für Stats und Fortschritts-Balken
```

---

### Notizen (`/notes`)

**Purpose:** Alle Notizen verwalten, nach Fach strukturiert
**Users:** Eingeloggter Nutzer

```
┌──────────────┬──────────────────────────────────────┐
│  Sidebar     │  Notizen                             │
│              │  [+ Neue Notiz]     [🔍 Suchen]      │
│              │                                      │
│              │  ┌─ Mathematik ──────────────────┐   │
│              │  │ 📄 Analysis Grundlagen  14.4  │   │
│              │  │ 📄 Integralrechnung     10.4  │   │
│              │  │ [+ Notiz hinzufügen]          │   │
│              │  └───────────────────────────────┘   │
│              │                                      │
│              │  ┌─ Geschichte ───────────────────┐  │
│              │  │ 📄 Weimarer Republik    8.4   │   │
│              │  │ [+ Notiz hinzufügen]          │   │
│              │  └───────────────────────────────┘   │
│              │                                      │
│              │  [+ Neues Fach]                      │
└──────────────┴──────────────────────────────────────┘

Key elements:
- Gruppierung nach Fach mit farbigem Fach-Header
- Letzte Bearbeitungszeit rechts
- Inline "Notiz hinzufügen" pro Fach
- Suchfeld filtert live über alle Notizen

Empty state: "Noch keine Notizen. Erstelle deine erste Notiz!" + Illustration
Loading state: Skeleton-Lines pro Fach-Gruppe
```

---

### Notiz-Detail (`/notes/:id`)

**Purpose:** Notiz lesen und bearbeiten, KI-Aktionen ausführen
**Users:** Eingeloggter Nutzer

```
┌──────────────┬──────────────────────────────────────┐
│  Sidebar     │  ← Notizen   [Mathematik]            │
│              │                                      │
│              │  Analysis Grundlagen                 │
│              │  Zuletzt bearbeitet: heute           │
│              │                                      │
│              │  ┌─ Toolbar ──────────────────────┐  │
│              │  │ B  I  H1 H2  <> ── •  1.       │  │
│              │  └────────────────────────────────┘  │
│              │                                      │
│              │  ┌─ Editor ───────────────────────┐  │
│              │  │                                │  │
│              │  │  # Grenzwerte                  │  │
│              │  │  Ein Grenzwert beschreibt...   │  │
│              │  │                                │  │
│              │  │  ## Epsilon-Delta-Definition   │  │
│              │  │  ...                           │  │
│              │  │                          ✨ KI │  │
│              │  └────────────────────────────────┘  │
│              │                                      │
│              │  ┌─ KI-Aktionen ──────────────────┐  │
│              │  │ [🃏 Karten generieren]          │  │
│              │  │ [🧪 Quiz erstellen]             │  │
│              │  │ [📋 Zusammenfassen]             │  │
│              │  └────────────────────────────────┘  │
└──────────────┴──────────────────────────────────────┘

Key elements:
- TipTap Editor, autosave nach 2s Inaktivität
- Floating KI-Button im Editor für Inline-Hilfe
- KI-Aktionen-Panel unten: direkt aus dieser Notiz Karten/Quiz generieren
- Breadcrumb-Navigation zurück zur Notizliste

Empty state: Cursor blinkt, Placeholder "Beginne zu schreiben..."
Loading state: KI-Aktionen zeigen Spinner + "KI generiert..."
```

---

### Kartenstapel (`/decks`)

**Purpose:** Alle Flashcard-Decks verwalten
**Users:** Eingeloggter Nutzer

```
┌──────────────┬──────────────────────────────────────┐
│  Sidebar     │  Karten                              │
│              │  [+ Neues Deck]                      │
│              │                                      │
│              │  ┌──────────────┐ ┌──────────────┐  │
│              │  │ ▌ Mathematik │ │ ▌ Geschichte  │  │
│              │  │ Analysis II  │ │ Weimarer Rep. │  │
│              │  │              │ │               │  │
│              │  │ 48 Karten    │ │ 23 Karten     │  │
│              │  │ 12 fällig    │ │  5 fällig     │  │
│              │  │              │ │               │  │
│              │  │ [▶ Lernen]   │ │ [▶ Lernen]    │  │
│              │  └──────────────┘ └───────────────┘  │
│              │                                      │
│              │  ┌──────────────┐                    │
│              │  │ + Neues Deck │                    │
│              │  └──────────────┘                    │
└──────────────┴──────────────────────────────────────┘

Key elements:
- Grid aus Deck-Karten (2 Spalten Desktop, 1 Spalte Mobile)
- Fach-Farbe als linker Rand
- Fällige Karten in Warning-Farbe wenn > 0
- Direkter "Lernen"-Button pro Deck

Empty state: "Noch keine Decks. Erstelle dein erstes Kartenstapel oder generiere Karten aus einer Notiz."
Loading state: Skeleton-Grid
```

---

### Lernsession (`/study/:deckId`)

**Purpose:** FSRS-gesteuerte Wiederholungssession
**Users:** Eingeloggter Nutzer

```
┌─────────────────────────────────────────────────────┐
│  ← Abbrechen    Analysis II        8 / 24           │
│  ▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░  33%                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│                                                     │
│         ┌─────────────────────────────┐             │
│         │                             │             │
│         │   Was ist die Ableitung     │             │
│         │   von sin(x)?               │             │
│         │                             │             │
│         │            [Umdrehen →]     │             │
│         └─────────────────────────────┘             │
│                                                     │
│         [Antwort anzeigen]                          │
│                                                     │
│    (nach Umdrehen: Bewertungs-Buttons)              │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│  │ Again  │ │  Hard  │ │  Good  │ │  Easy  │       │
│  │  <1m   │ │  10m   │ │   1d   │ │   4d   │       │
│  └────────┘ └────────┘ └────────┘ └────────┘       │
│                                                     │
└─────────────────────────────────────────────────────┘

Key elements:
- Vollflächen-Layout, minimale Ablenkung
- Fortschrittsbalken oben
- Karte mit Flip-Animation (CSS 3D)
- Bewertungs-Buttons erst nach Aufdecken sichtbar
- Nächstes Intervall unter jedem Button (Again, Hard, Good, Easy)
- KI-Erklärung abrufbar via "?" Icon nach dem Aufdecken

Empty state: "Alle Karten für heute erledigt! 🎉" + Streak-Animation + zurück zum Dashboard
Loading state: Karte blinkt kurz beim Laden
```

---

### Quiz (`/quiz`)

**Purpose:** Quiz konfigurieren und starten
**Users:** Eingeloggter Nutzer

```
┌──────────────┬──────────────────────────────────────┐
│  Sidebar     │  Quiz erstellen                      │
│              │                                      │
│              │  Fach                                │
│              │  [Alle Fächer ▾]                     │
│              │                                      │
│              │  Quelle                              │
│              │  ○ Aus Karten   ● Aus Notizen        │
│              │                                      │
│              │  Anzahl Fragen                       │
│              │  [──────●───────]  10 Fragen         │
│              │                                      │
│              │  Fragetypen                          │
│              │  ☑ Multiple Choice                   │
│              │  ☑ Lückentext                        │
│              │  ☐ Freitext                          │
│              │                                      │
│              │  [✨ Quiz generieren]                 │
└──────────────┴──────────────────────────────────────┘

Key elements:
- Einfaches Konfigurationsformular
- KI-Generierung per Button
- Ladeanimation während Claude generiert

Empty state: n/a (Konfigurationsseite)
Loading state: Button → Spinner + "KI erstellt dein Quiz..."
```

---

### Quiz-Session (`/quiz/:sessionId`)

**Purpose:** Aktive Quiz-Session durchführen
**Users:** Eingeloggter Nutzer

```
┌─────────────────────────────────────────────────────┐
│  ← Abbrechen    Mathematik Quiz     Frage 3 / 10    │
│  ▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░  30%                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Was ist die Stammfunktion von cos(x)?              │
│                                                     │
│  ┌──────────────────────────────────────────┐       │
│  │  A)  sin(x) + C                          │       │
│  └──────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────┐       │
│  │  B)  -sin(x) + C                         │       │
│  └──────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────┐       │
│  │  C)  cos(x) + C                          │       │
│  └──────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────┐       │
│  │  D)  tan(x) + C                          │       │
│  └──────────────────────────────────────────┘       │
│                                                     │
│                              [Weiter →]             │
└─────────────────────────────────────────────────────┘

Nach Auswahl: richtige Antwort grün, falsche Antwort rot, Erklärung einblenden

Key elements:
- Eine Frage pro Bildschirm
- Ausgewählte Antwort visuell hervorgehoben
- Sofortiges Feedback nach Auswahl (Farbe + Icon)
- Am Ende: Ergebnis-Zusammenfassung mit Score + Schwachstellen

Empty state: n/a
Loading state: Zwischen Fragen kurzer Fade
```

---

### Planer (`/planner`)

**Purpose:** Prüfungstermine verwalten und Lernplan einsehen
**Users:** Eingeloggter Nutzer

```
┌──────────────┬──────────────────────────────────────┐
│  Sidebar     │  Lernplan                            │
│              │                                      │
│              │  ┌─ April 2026 ─────────────────┐   │
│              │  │ Mo Di Mi Do Fr Sa So          │   │
│              │  │  1  2  3  4  5  6  7          │   │
│              │  │  8  9 10 11 12 13 14●         │   │
│              │  │ 15 16 17 18 19 20 21          │   │
│              │  │ 22 23 24 25[26]27 28          │   │
│              │  └───────────────────────────────┘   │
│              │  ● Heute  [26] Prüfung              │
│              │                                      │
│              │  Prüfungen                           │
│              │  ┌─────────────────────────────────┐ │
│              │  │ 📚 Analysis II    26. Apr ⊕    │ │
│              │  │ 📚 Statistik      10. Mai ⊕    │ │
│              │  │ [+ Prüfung hinzufügen]          │ │
│              │  └─────────────────────────────────┘ │
│              │                                      │
│              │  Heutige Lernziele                   │
│              │  ┌─────────────────────────────────┐ │
│              │  │ Analysis II   15 Karten          │ │
│              │  │ Statistik      8 Karten          │ │
│              │  └─────────────────────────────────┘ │
└──────────────┴──────────────────────────────────────┘

Key elements:
- Monats-Kalender mit markierten Lerntagen und Prüfungsterminen
- Prüfungsliste mit Countdown
- Tägliche Lernziele auto-berechnet aus Kartenmenge ÷ verbleibende Tage

Empty state: "Füge deine erste Prüfung hinzu um automatische Lernziele zu erhalten."
Loading state: Kalender-Skeleton
```

---

### Settings (`/settings`)

**Purpose:** Profil und App-Einstellungen
**Users:** Eingeloggter Nutzer

```
┌──────────────┬──────────────────────────────────────┐
│  Sidebar     │  Einstellungen                       │
│              │                                      │
│              │  Profil                              │
│              │  [Avatar]  Adam                      │
│              │  adam@example.com                    │
│              │  [Passwort ändern]                   │
│              │                                      │
│              │  Fächer verwalten                    │
│              │  ┌──────────────────────────────┐    │
│              │  │ ▌ Mathematik       [✎] [🗑] │    │
│              │  │ ▌ Geschichte       [✎] [🗑] │    │
│              │  │ [+ Fach hinzufügen]          │    │
│              │  └──────────────────────────────┘    │
│              │                                      │
│              │  KI-Einstellungen                    │
│              │  Claude API Key: [••••••••] [✎]      │
│              │                                      │
│              │  Erscheinungsbild                    │
│              │  ● Dark  ○ Light  ○ System           │
│              │                                      │
│              │  [Abmelden]                          │
└──────────────┴──────────────────────────────────────┘
```

---

## 4. Responsive Verhalten

| Breakpoint | Layout-Änderungen |
|---|---|
| Mobile (<768px) | Sidebar → Bottom Navigation (5 Icons); Karten-Grid → 1 Spalte; Editor Fullscreen; Lernsession unverändert (bereits optimiert) |
| Tablet (768–1024px) | Sidebar kollabiert auf Icon-Only (64px); Karten-Grid → 2 Spalten |
| Desktop (>1024px) | Standard-Layout, Sidebar 240px, Karten-Grid 3 Spalten |

**Bottom Navigation Mobile:**
```
[🏠] [📝] [🃏] [🧪] [📅]
 Home  Notiz Kart Quiz Plan
```

---

## 5. Accessibility

- Farbkontrast: alle Textkombinationen ≥ 4.5:1 (geprüft für Dark Mode Palette)
- Fokus-Stile: `outline: 2px solid --color-primary` auf allen interaktiven Elementen, kein Entfernen von `outline`
- Touch-Targets: min. 44×44px auf Mobile (Bewertungs-Buttons in Lernsession besonders beachten)
- Flip-Animation: `prefers-reduced-motion` Media Query – Animation deaktivieren, direkter Wechsel
- Screenreader: Karten-Vorder-/Rückseite mit `aria-live` Region für Screenreader-Ankündigung
- Tastatur-Navigation: Lernsession per Tastatur bedienbar (1=Again, 2=Hard, 3=Good, 4=Easy; Space=Aufdecken)

---

## 6. Nächste Schritte

- [ ] Design reviewen und freigeben
- [ ] CSS-Variablen (`--color-*`) in `src/styles/tokens.css` übernehmen
- [ ] Outfit + Inter + JetBrains Mono via Google Fonts einbinden
- [ ] shadcn/ui mit Dark Mode Theme konfigurieren
- [ ] Basis-Komponenten implementieren (Button, Card, Input, Badge)
- [ ] Entwicklung tracken → *app-dev-tracker Skill*

---

*Erstellt mit dem app-ui-design Skill · April 2026*
