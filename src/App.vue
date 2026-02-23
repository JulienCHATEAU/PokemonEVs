<script setup>
/**
 * App.vue — V6 "Pro UI Polish"
 * Dark mode, PokemonSettings popover, LanguageSelector dropdown,
 * permanent sidebar (desktop), slide-over (mobile),
 * 2-column main content, i18n, Pokédex modal, data manager.
 */
import { ref, computed } from 'vue'
import {
  BookOpen, AlertTriangle, Database, Menu, Sun, Moon,
} from 'lucide-vue-next'

import { useI18n } from './composables/useI18n.js'
import { useStore } from './composables/useStore.js'
import { useTheme } from './composables/useTheme.js'

import BaseButton from './components/BaseButton.vue'
import PokedexModal from './components/PokedexModal.vue'
import ActionPanel from './components/ActionPanel.vue'
import StatsDashboard from './components/StatsDashboard.vue'
import DataManager from './components/DataManager.vue'
import PokemonSidebar from './components/PokemonSidebar.vue'
import LanguageSelector from './components/LanguageSelector.vue'

const { lang, t } = useI18n()
const {
  pokemonList, activeIndex, activePokemon,
  addPokemon, removePokemon, selectPokemon,
  resetStats, totalEvs, initPersistence,
} = useStore()
const { dark, toggle: toggleTheme } = useTheme()

initPersistence(lang.value === 'fr' ? 'Mon Pokémon' : 'My Pokémon')

// ── Pokédex modal ─────────────────────────────────
const showPokedex = ref(false)

function onPokedexSelect(dexEntry) {
  addPokemon(dexEntry, dexEntry.name)
  showPokedex.value = false
}

// ── Sidebar ref ───────────────────────────────────
const sidebarRef = ref(null)

function openMobileSidebar() {
  if (sidebarRef.value) {
    sidebarRef.value.mobileOpen = true
  }
}

// ── Confirm dialog ────────────────────────────────
const showConfirmReset = ref(false)

// ── Data manager ──────────────────────────────────
const showDataManager = ref(false)

function displayName(p) {
  if (!p) return ''
  if (p.dexEntry) return lang.value === 'fr' ? p.dexEntry.nameFr : p.dexEntry.name
  return p.name
}

function requestReset() {
  if (!activePokemon.value) return
  showConfirmReset.value = true
}

function confirmReset() {
  resetStats()
  showConfirmReset.value = false
}
</script>

<template>
  <div class="h-screen flex flex-col bg-[var(--color-surface-alt)]">
    <!-- ═══ Header ═══ -->
    <header class="sticky top-0 z-30 bg-[var(--color-header-bg)] backdrop-blur-lg border-b border-[var(--color-border)] shrink-0">
      <div class="px-4 h-14 flex items-center justify-between">
        <!-- Left: Mobile hamburger + Logo -->
        <div class="flex items-center gap-2">
          <!-- Mobile sidebar trigger -->
          <button
            class="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--color-surface-hover)]
                   transition-colors cursor-pointer"
            @click="openMobileSidebar"
          >
            <Menu :size="20" class="text-[var(--color-text-secondary)]" />
          </button>

          <img src="/logo.png" alt="Emerald EV Tracker" class="w-8 h-8 rounded-lg object-contain" />
          <div class="hidden sm:block">
            <h1 class="text-sm font-bold text-[var(--color-text-primary)] leading-tight">
              {{ t('header.title') }}
            </h1>
            <p class="text-[10px] text-[var(--color-text-muted)]">{{ t('header.subtitle') }}</p>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-1.5">
          <BaseButton variant="ghost" size="sm" @click="showDataManager = true">
            <Database :size="16" />
          </BaseButton>

          <!-- Theme toggle -->
          <BaseButton variant="ghost" size="sm" @click="toggleTheme">
            <Sun v-if="dark" :size="16" />
            <Moon v-else :size="16" />
          </BaseButton>

          <!-- Language dropdown -->
          <LanguageSelector />

          <BaseButton variant="accent" size="sm" @click="showPokedex = true">
            <BookOpen :size="16" />
            <span class="hidden sm:inline">{{ t('pokemon.openPokedex') }}</span>
          </BaseButton>
        </div>
      </div>
    </header>

    <!-- ═══ Body: Sidebar + Main ═══ -->
    <div class="flex flex-1 min-h-0">
      <!-- Sidebar -->
      <PokemonSidebar
        ref="sidebarRef"
        @open-pokedex="showPokedex = true"
      />

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto">
        <div class="max-w-5xl mx-auto px-4 py-10">
          <div class="flex flex-col lg:flex-row gap-5">
            <!-- Left: Action Panel -->
            <div class="w-full lg:w-[55%]">
              <ActionPanel />
            </div>

            <!-- Right: Stats Dashboard -->
            <div class="w-full lg:w-[45%]">
              <div class="lg:sticky lg:top-5">
                <StatsDashboard />

                <!-- Reset button -->
                <div v-if="activePokemon" class="mt-4">
                  <BaseButton
                    variant="danger"
                    size="md"
                    class="w-full"
                    :disabled="totalEvs(activePokemon) === 0"
                    @click="requestReset"
                  >
                    <AlertTriangle :size="16" />
                    {{ t('actions.resetEvs') }}
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- ═══ Pokédex Modal ═══ -->
    <PokedexModal
      v-if="showPokedex"
      @select="onPokedexSelect"
      @close="showPokedex = false"
    />

    <!-- ═══ Data Manager Modal ═══ -->
    <DataManager
      v-if="showDataManager"
      @close="showDataManager = false"
    />

    <!-- ═══ Confirm Reset Dialog ═══ -->
    <Teleport to="body">
      <div
        v-if="showConfirmReset"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          @click="showConfirmReset = false"
        />
        <div class="relative z-10 w-full max-w-sm bg-[var(--color-surface)] rounded-2xl shadow-2xl p-6 mx-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-16 h-10 rounded-full bg-[var(--color-danger-bg)] flex items-center justify-center">
              <AlertTriangle :size="20" class="text-[var(--color-danger-text)]" />
            </div>
            <div>
              <h3 class="font-bold text-[var(--color-text-primary)]">
                {{ t('actions.confirmReset') }}
              </h3>
              <p class="text-sm text-[var(--color-text-muted)] mt-0.5">
                {{ t('actions.confirmResetMsg').replace('{name}', displayName(activePokemon)) }}
              </p>
            </div>
          </div>

          <div class="flex gap-2">
            <BaseButton
              variant="default"
              size="md"
              class="flex-1"
              @click="showConfirmReset = false"
            >
              {{ t('actions.cancelAction') }}
            </BaseButton>
            <BaseButton
              variant="danger"
              size="md"
              class="flex-1"
              @click="confirmReset"
            >
              {{ t('actions.confirm') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
