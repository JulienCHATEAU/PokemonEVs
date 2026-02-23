<script setup>
/**
 * App.vue — V3 "International Edition"
 * 2-column desktop layout, i18n toggle, confirmation dialogs,
 * Pokédex modal, reactive store.
 */
import { ref, computed } from 'vue'
import {
  Globe, BookOpen, Plus, Trash2, ChevronDown, AlertTriangle, Database,
} from 'lucide-vue-next'

import { useI18n } from './composables/useI18n.js'
import { useStore } from './composables/useStore.js'
import { getSpriteUrl } from './data/hoennDex.js'

import BaseButton from './components/BaseButton.vue'
import PokedexModal from './components/PokedexModal.vue'
import ActionPanel from './components/ActionPanel.vue'
import StatsDashboard from './components/StatsDashboard.vue'
import DataManager from './components/DataManager.vue'

const { lang, toggleLang, t } = useI18n()
const {
  pokemonList, activeIndex, activePokemon,
  addPokemon, removePokemon, selectPokemon,
  resetStats, totalEvs, initPersistence,
} = useStore()

initPersistence(lang.value === 'fr' ? 'Mon Pokémon' : 'My Pokémon')

// ── Pokédex modal ─────────────────────────────────
const showPokedex = ref(false)

function onPokedexSelect(dexEntry) {
  addPokemon(dexEntry, dexEntry.name)
  showPokedex.value = false
}

// ── Team selector dropdown ────────────────────────
const showTeamDropdown = ref(false)

function displayName(p) {
  if (!p) return ''
  if (p.dexEntry) return lang.value === 'fr' ? p.dexEntry.nameFr : p.dexEntry.name
  return p.name
}

// ── Confirm dialog ────────────────────────────────
const showConfirmReset = ref(false)

// ── Data manager ──────────────────────────────────
const showDataManager = ref(false)

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
  <div class="min-h-screen bg-[var(--color-surface-alt)]">
    <!-- ═══ Header ═══ -->
    <header class="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-[var(--color-border)]">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <img src="/logo.png" alt="Emerald EV Tracker" class="w-8 h-8 rounded-lg object-contain" />
          <div class="hidden sm:block">
            <h1 class="text-sm font-bold text-[var(--color-text-primary)] leading-tight">
              {{ t('header.title') }}
            </h1>
            <p class="text-[10px] text-[var(--color-text-muted)]">{{ t('header.subtitle') }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Data Manager -->
          <BaseButton variant="ghost" size="sm" @click="showDataManager = true">
            <Database :size="16" />
          </BaseButton>

          <!-- Language toggle -->
          <BaseButton variant="ghost" size="sm" @click="toggleLang">
            <Globe :size="16" />
            <span class="text-xs font-bold uppercase">{{ lang === 'en' ? 'FR' : 'EN' }}</span>
          </BaseButton>

          <!-- Open Pokédex -->
          <BaseButton variant="accent" size="sm" @click="showPokedex = true">
            <BookOpen :size="16" />
            <span class="hidden sm:inline">{{ t('pokemon.openPokedex') }}</span>
          </BaseButton>
        </div>
      </div>
    </header>

    <!-- ═══ Team Selector Bar ═══ -->
    <div class="max-w-6xl mx-auto px-4 pt-4 pb-2">
      <div class="bg-white rounded-2xl border border-[var(--color-border)] p-3">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-[var(--color-text-secondary)] shrink-0">
            {{ t('pokemon.myPokemons') }}
          </span>

          <!-- Team pills -->
          <div class="flex-1 flex gap-1.5 overflow-x-auto scrollbar-none">
            <button
              v-for="(pkmn, idx) in pokemonList"
              :key="pkmn.id"
              :class="[
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium',
                'transition-all cursor-pointer shrink-0 border',
                idx === activeIndex
                  ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)] text-[var(--color-accent-dark)]'
                  : 'bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-slate-50',
              ]"
              @click="selectPokemon(idx)"
            >
              <img
                v-if="pkmn.dexEntry"
                :src="getSpriteUrl(pkmn.dexEntry.nationalId)"
                :alt="displayName(pkmn)"
                class="w-5 h-5 sprite-pixel"
              />
              <span v-else class="text-sm">❓</span>
              <span class="truncate max-w-[80px]">{{ displayName(pkmn) }}</span>
              <span
                v-if="totalEvs(pkmn) >= 510"
                class="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shrink-0"
              />
            </button>
          </div>

          <!-- Add button -->
          <BaseButton
            variant="ghost"
            size="sm"
            square
            @click="showPokedex = true"
          >
            <Plus :size="16" />
          </BaseButton>

          <!-- Remove button -->
          <BaseButton
            variant="ghost"
            size="sm"
            square
            :disabled="pokemonList.length <= 1"
            @click="removePokemon(activeIndex)"
          >
            <Trash2 :size="16" />
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- ═══ Main 2-Column Layout ═══ -->
    <main class="max-w-6xl mx-auto px-4 pb-8">
      <div class="flex flex-col lg:flex-row gap-5">
        <!-- Left: Action Panel (Management) -->
        <div class="w-full lg:w-[55%]">
          <ActionPanel />
        </div>

        <!-- Right: Stats Dashboard (Preview) -->
        <div class="w-full lg:w-[45%]">
          <div class="lg:sticky lg:top-[72px]">
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
    </main>

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
        <div class="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 mx-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-16 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle :size="20" class="text-red-500" />
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
