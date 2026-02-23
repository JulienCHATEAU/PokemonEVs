# 💎 Emerald EV Tracker

A client-side **Effort Value (EV) tracker** for **Pokémon Emerald (Gen III)**, built with Vue 3 and Vite. Plan and simulate your EV training sessions with real Hoenn farm spots, vitamins, and multipliers — all while respecting Gen III mechanics.

![Vue 3](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

---

## ✨ Features

### Team Sidebar
- Build a team of up to 6 Pokémon selected from the complete **202-entry Hoenn Pokédex**.
- Permanent **collapsible sidebar** on desktop (260 px ↔ 64 px icons-only) and **slide-over drawer** on mobile.
- SVG **progress rings** per Pokémon showing total EV completion at a glance.
- Delete any team member via a trash icon with a **confirmation modal**.

### Pokédex Browser
- Full-screen searchable Pokédex modal with Gen III Emerald sprites (sourced from [PokeAPI sprites](https://github.com/PokeAPI/sprites)).
- Search by **name** (EN/FR), **type** (EN/FR), **Hoenn ID**, or **National ID**.
- Hover over any entry to preview its EV yield.

### EV Training Simulation
- **Farm Spots** — Predefined optimal grinding locations grouped by stat (e.g. *Whismur in Rusturf Tunnel* for HP EVs). Click to simulate defeating a wild Pokémon and gain the corresponding EVs.
- **Vitamins** — HP Up, Protein, Iron, Calcium, Zinc, Carbos — each grants +10 EVs, capped at 100 per stat (Gen III rules).
- **Fine-tuning** — Per-stat −1 buttons integrated directly into each stat bar for precise manual adjustment.

### Per-Pokémon Settings (Popover)
- **Gear icon** in the identity card opens a floating popover.
- Toggle **Macho Brace** (×2, with item sprite) and **Pokérus** (×2), stackable up to **×4**.
- Live multiplier summary displayed inside the popover.

### Stats Dashboard
- Real-time **animated progress bars** per stat, color-coded (HP, Atk, Def, SpA, SpD, Spe).
- Total 510 EV progress bar with a 🏆 trophy icon when the cap is reached.
- Gold **MAX** badge when an individual stat hits 252.
- Identity card showing sprite, name, types, and active multiplier badge.

### Dark Mode
- **Sun / Moon toggle** in the header.
- Full dark palette (deep navy / slate backgrounds, vibrant emerald accents, off-white text).
- Respects system preference on first visit; choice persisted to `localStorage`.

### Bilingual Interface (EN / FR)
- Full English & French translations for UI labels, stat names, Pokémon names, type names, and location names.
- **Language dropdown** with flag emojis and checkmark on the active language.
- Preference saved to `localStorage`.

### Data Portability
- **Backup** your entire team to a timestamped JSON file.
- **Import** a backup with automatic validation and confirmation dialog.
- **Clear all data** with a danger-zone confirmation.

### Persistence
- Auto-saves your entire team and active selection to `localStorage` (key: `emerald-ev-tracker-v3`).
- State is fully restored on page reload — no data loss.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm (comes with Node.js)

### Installation

```bash
git clone <repository-url>
cd PokemonEVs
npm install
```

### Development

```bash
npm run dev
```

Opens the app on [http://localhost:5173](http://localhost:5173) with hot-reload.

### Production Build

```bash
npm run build
```

Outputs optimized static files to `dist/`.

### Preview Build

```bash
npm run preview
```

Serves the production build locally for testing.

---

## 📁 Project Structure

```
PokemonEVs/
├── index.html                       # Entry HTML (favicon → logo.png)
├── package.json                     # Dependencies & scripts
├── vite.config.js                   # Vite + Vue + Tailwind config
├── public/
│   └── logo.png                     # App logo / favicon
└── src/
    ├── main.js                      # App bootstrap
    ├── App.vue                      # Root layout (header, sidebar, main, modals)
    ├── style.css                    # Tailwind @theme variables + dark mode overrides
    ├── components/
    │   ├── BaseButton.vue           # Reusable button (5 variants, 3 sizes)
    │   ├── PokedexModal.vue         # Full-screen Pokédex browser
    │   ├── ActionPanel.vue          # Training controls (farm spots, vitamins)
    │   ├── StatsDashboard.vue       # EV progress bars, identity card, −1 buttons
    │   ├── PokemonSidebar.vue       # Collapsible team sidebar + mobile drawer
    │   ├── PokemonSettings.vue      # Per-Pokémon Macho Brace / Pokérus popover
    │   ├── LanguageSelector.vue     # EN/FR language dropdown
    │   └── DataManager.vue          # Backup / import / clear data modal
    ├── composables/
    │   ├── useStore.js              # Reactive state: team CRUD, EV logic, persistence
    │   ├── useI18n.js               # EN/FR i18n system with translation keys
    │   ├── useTheme.js              # Dark / light mode toggle & persistence
    │   └── useDataService.js        # JSON export, import & validation helpers
    └── data/
        └── hoennDex.js              # 202 Pokédex entries, farm spots, vitamins, sprite helpers
```

---

## 🛠 Tech Stack

| Layer       | Technology                                                       |
| ----------- | ---------------------------------------------------------------- |
| Framework   | [Vue 3](https://vuejs.org/) — Composition API, `<script setup>` |
| Build Tool  | [Vite 7](https://vitejs.dev/)                                    |
| Styling     | [Tailwind CSS 4](https://tailwindcss.com/) with `@theme` CSS custom properties |
| Icons       | [Lucide Vue Next](https://lucide.dev/)                           |
| Language    | JavaScript (ES Modules)                                          |
| Sprites     | [PokeAPI Sprites](https://github.com/PokeAPI/sprites) (Gen III Emerald) |

> **No backend or API calls** — all Pokémon data is embedded locally. The app is 100% client-side.

---

## 🎮 Gen III EV Rules Enforced

| Rule                    | Value |
| ----------------------- | ----- |
| Total EV cap            | 510   |
| Per-stat EV cap         | 252   |
| Vitamin cap (per stat)  | 100   |
| Vitamin EV gain         | +10   |
| Macho Brace multiplier  | ×2    |
| Pokérus multiplier      | ×2    |
| Max combined multiplier | ×4    |

---

## 🧩 Architecture Overview

```
User interaction (click farm spot / vitamin / toggle setting)
        │
        ▼
  ActionPanel.vue ──▶ useStore composable methods
  PokemonSettings.vue   (defeatPokemon, useVitamin, toggleMultiplier…)
        │
        ▼
  Reactive state mutation (pokemonList[activeIndex].evs)
  with cap enforcement (252/stat, 510 total, 100 vitamin)
        │
        ▼
  Vue reactivity ──▶ StatsDashboard.vue (progress bars update)
                 ──▶ PokemonSidebar.vue (progress rings update)
        │
        ▼
  watch() ──▶ save() ──▶ localStorage
```

State is managed via a **singleton composable** (`useStore.js`) using module-level `ref`s shared across all components. Theme and language preferences are each managed by their own composable with independent `localStorage` keys.

---

## 🌐 Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Volar Extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar) for Vue 3 support

---

## 📄 License

This project is for personal/educational use. Pokémon is a trademark of Nintendo / Game Freak / The Pokémon Company.