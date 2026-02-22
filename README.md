# 💎 Emerald EV Tracker

A client-side **Effort Value (EV) tracker** for **Pokémon Emerald (Gen III)**, built with Vue 3 and Vite. Plan and simulate your EV training sessions with real Hoenn farm spots, vitamins, and multipliers — all while respecting Gen III mechanics.

![Vue 3](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

---

## ✨ Features

### Team Management
- Build a team of up to 6 Pokémon selected from the complete **202-entry Hoenn Pokédex**.
- Switch between team members via a pill-based selector bar.
- Each Pokémon's EVs are tracked independently.

### Pokédex Browser
- Full-screen searchable Pokédex modal with Gen III Emerald sprites (sourced from [PokeAPI sprites](https://github.com/PokeAPI/sprites)).
- Search by **name** (EN/FR), **type** (EN/FR), **Hoenn ID**, or **National ID**.
- Hover over any entry to preview its EV yield.

### EV Training Simulation
- **Farm Spots** — Predefined optimal grinding locations (e.g. *Whismur in Rusturf Tunnel* for HP EVs). Click to simulate defeating a wild Pokémon and gain the corresponding EVs.
- **Vitamins** — HP Up, Protein, Iron, Calcium, Zinc, Carbos — each grants +10 EVs, capped at 100 per stat (Gen III rules).
- **Fine-tuning** — Per-stat −1 buttons for precise manual adjustment.
- **Filter** farm spots by the stat you're currently training.

### Training Multipliers
- Toggle **Macho Brace** (×2) and **Pokérus** (×2), stackable up to **×4**.
- Actual EV gain is displayed on hover, accounting for active multipliers.

### Stats Dashboard
- Real-time **animated progress bars** per stat, color-coded (HP, Atk, Def, SpA, SpD, Spe).
- Total 510 EV progress bar with a 🏆 trophy icon when the cap is reached.
- Gold **MAX** badge when an individual stat hits 252.

### Bilingual Interface (EN / FR)
- Full English & French translations for UI labels, stat names, Pokémon names, type names, and location names.
- Language toggle in the header; preference saved to `localStorage`.

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
├── index.html                  # Entry HTML
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite + Vue + Tailwind config
├── public/                     # Static assets
└── src/
    ├── main.js                 # App bootstrap
    ├── App.vue                 # Root component (header, layout, modals)
    ├── style.css               # Tailwind imports & CSS custom properties
    ├── components/
    │   ├── BaseButton.vue      # Reusable button (5 variants, 3 sizes)
    │   ├── PokedexModal.vue    # Full-screen Pokédex browser
    │   ├── ActionPanel.vue     # Training controls (multipliers, farm spots, vitamins)
    │   └── StatsDashboard.vue  # EV progress bars & identity card
    ├── composables/
    │   ├── useStore.js         # Reactive state: team CRUD, EV logic, localStorage
    │   └── useI18n.js          # EN/FR i18n system & language toggle
    └── data/
        └── hoennDex.js         # 202 Pokédex entries, farm spots, vitamins, sprite helpers
```

---

## 🛠 Tech Stack

| Layer       | Technology                                                       |
| ----------- | ---------------------------------------------------------------- |
| Framework   | [Vue 3](https://vuejs.org/) — Composition API, `<script setup>` |
| Build Tool  | [Vite 7](https://vitejs.dev/)                                    |
| Styling     | [Tailwind CSS 4](https://tailwindcss.com/)                       |
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
User interaction (click farm spot / vitamin / toggle modifier)
        │
        ▼
  ActionPanel.vue ──▶ useStore composable methods
                      (defeatPokemon, useVitamin, toggleMultiplier…)
        │
        ▼
  Reactive state mutation (pokemonList[activeIndex].evs)
  with cap enforcement (252/stat, 510 total, 100 vitamin)
        │
        ▼
  Vue reactivity ──▶ StatsDashboard.vue (progress bars update)
        │
        ▼
  watch() ──▶ save() ──▶ localStorage
```

State is managed via a **singleton composable** (`useStore.js`) using module-level `ref`s shared across all components.

---

## 🌐 Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Volar Extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar) for Vue 3 support

---

## 📄 License

This project is for personal/educational use. Pokémon is a trademark of Nintendo / Game Freak / The Pokémon Company.