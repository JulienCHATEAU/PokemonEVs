<script setup>
/**
 * PokemonSidebar — Permanent sidebar on desktop/tablet, slide-over on mobile.
 * Shows Pokémon list with sprites, names, mini EV progress rings.
 * Collapsible to slim (icons-only) mode on desktop.
 * Delete via trash icon on active Pokémon with confirm-on-click safety.
 */
import { ref } from 'vue'
import { Plus, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-vue-next'
import { useI18n } from '../composables/useI18n.js'
import { useStore } from '../composables/useStore.js'
import { getSpriteUrl } from '../data/hoennDex.js'

const { lang, t } = useI18n()
const {
  pokemonList, activeIndex,
  selectPokemon, removePokemon, totalEvs, evPercent,
} = useStore()

const emit = defineEmits(['open-pokedex'])

// ── Sidebar state ──────────────────────────────
const collapsed = ref(false)
const mobileOpen = ref(false)

function toggleCollapsed() { collapsed.value = !collapsed.value }
function closeMobile() { mobileOpen.value = false }

// ── Delete safety (double-click to confirm) ────
const confirmDeleteIdx = ref(-1)
let confirmTimer = null

function requestDelete(idx, e) {
  e.stopPropagation()
  if (confirmDeleteIdx.value === idx) {
    removePokemon(idx)
    confirmDeleteIdx.value = -1
    clearTimeout(confirmTimer)
  } else {
    confirmDeleteIdx.value = idx
    clearTimeout(confirmTimer)
    confirmTimer = setTimeout(() => { confirmDeleteIdx.value = -1 }, 3000)
  }
}

// ── Helpers ────────────────────────────────────
function displayName(p) {
  if (!p) return ''
  if (p.dexEntry) return lang.value === 'fr' ? p.dexEntry.nameFr : p.dexEntry.name
  return p.name
}

// SVG ring constants
const RING_R = 14
const RING_C = 2 * Math.PI * RING_R

function ringOffset(p) {
  const pct = Math.min(evPercent(p), 100)
  return RING_C - (RING_C * pct) / 100
}

function ringColor(p) {
  return totalEvs(p) >= 510 ? 'var(--color-gold)' : 'var(--color-accent)'
}

function handleSelect(idx) {
  selectPokemon(idx)
  mobileOpen.value = false
}

defineExpose({ mobileOpen })
</script>

<template>
  <!-- ═══ Mobile backdrop ═══ -->
  <Teleport to="body">
    <Transition name="sb-backdrop">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        @click="closeMobile"
      />
    </Transition>
  </Teleport>

  <!-- ═══ Desktop sidebar ═══ -->
  <aside
    :class="[
      'hidden lg:flex flex-col bg-white border-r border-[var(--color-border)]',
      'shrink-0 h-full overflow-hidden',
      collapsed ? 'sidebar-collapsed' : 'sidebar-expanded',
    ]"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-3 h-14 border-b border-[var(--color-border)] shrink-0">
      <span
        v-if="!collapsed"
        class="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider truncate"
      >
        {{ t('sidebar.team') }}
      </span>
      <button
        class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100
               transition-colors cursor-pointer shrink-0"
        :class="collapsed && 'mx-auto'"
        @click="toggleCollapsed"
      >
        <ChevronLeft v-if="!collapsed" :size="16" class="text-[var(--color-text-muted)]" />
        <ChevronRight v-else :size="16" class="text-[var(--color-text-muted)]" />
      </button>
    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 space-y-1">
      <TransitionGroup name="pkmn-list">
        <button
          v-for="(pkmn, idx) in pokemonList"
          :key="pkmn.id"
          :class="[
            'w-full flex items-center gap-2.5 rounded-xl transition-all cursor-pointer group relative',
            collapsed ? 'justify-center p-2' : 'px-3 py-2.5',
            idx === activeIndex
              ? 'bg-[var(--color-accent-subtle)] border border-[var(--color-accent)]'
              : 'border border-transparent hover:bg-slate-50 hover:border-[var(--color-border)]',
          ]"
          @click="handleSelect(idx)"
        >
          <!-- Progress ring + sprite -->
          <div class="relative shrink-0 w-10 h-10 flex items-center justify-center">
            <svg class="absolute inset-0 w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" :r="RING_R" fill="none" stroke="#e2e8f0" stroke-width="2.5" />
              <circle
                cx="18" cy="18" :r="RING_R" fill="none"
                :stroke="ringColor(pkmn)" stroke-width="2.5" stroke-linecap="round"
                :stroke-dasharray="RING_C" :stroke-dashoffset="ringOffset(pkmn)"
                class="transition-all duration-500"
              />
            </svg>
            <img
              v-if="pkmn.dexEntry"
              :src="getSpriteUrl(pkmn.dexEntry.nationalId)"
              :alt="displayName(pkmn)"
              class="w-6 h-6 sprite-pixel relative z-[1]"
            />
            <span v-else class="text-lg relative z-[1]">❓</span>
          </div>

          <!-- Name + EV count (expanded only) -->
          <div v-if="!collapsed" class="flex-1 min-w-0 text-left">
            <p class="text-sm font-medium text-[var(--color-text-primary)] truncate leading-tight">
              {{ displayName(pkmn) }}
            </p>
            <p class="text-[11px] text-[var(--color-text-muted)] leading-tight mt-0.5">
              {{ totalEvs(pkmn) }} / 510 EVs
            </p>
          </div>

          <!-- Delete button on active Pokémon (expanded only) -->
          <button
            v-if="!collapsed && idx === activeIndex && pokemonList.length > 1"
            :class="[
              'shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer',
              confirmDeleteIdx === idx
                ? 'bg-red-100 text-red-500 scale-110'
                : 'opacity-0 group-hover:opacity-100 hover:bg-red-50 text-[var(--color-text-muted)] hover:text-red-500',
            ]"
            :title="confirmDeleteIdx === idx ? t('sidebar.confirmDelete') : t('pokemon.remove')"
            @click="requestDelete(idx, $event)"
          >
            <Trash2 :size="14" />
          </button>
        </button>
      </TransitionGroup>
    </div>

    <!-- Add button -->
    <div class="shrink-0 p-2 border-t border-[var(--color-border)]">
      <button
        :class="[
          'w-full flex items-center gap-2 rounded-xl border border-dashed border-[var(--color-border)]',
          'text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]',
          'hover:bg-[var(--color-accent-subtle)] transition-all cursor-pointer',
          collapsed ? 'justify-center p-2' : 'px-3 py-2.5',
        ]"
        @click="emit('open-pokedex')"
      >
        <Plus :size="16" />
        <span v-if="!collapsed" class="text-xs font-medium">{{ t('sidebar.addPokemon') }}</span>
      </button>
    </div>
  </aside>

  <!-- ═══ Mobile slide-over sidebar ═══ -->
  <Teleport to="body">
    <Transition name="sb-slide">
      <aside
        v-if="mobileOpen"
        class="fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-[var(--color-border)]
               flex flex-col shadow-2xl lg:hidden"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-3 h-14 border-b border-[var(--color-border)] shrink-0">
          <span class="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
            {{ t('sidebar.team') }}
          </span>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100
                   transition-colors cursor-pointer"
            @click="closeMobile"
          >
            <X :size="16" class="text-[var(--color-text-muted)]" />
          </button>
        </div>

        <!-- List -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 space-y-1">
          <TransitionGroup name="pkmn-list">
            <button
              v-for="(pkmn, idx) in pokemonList"
              :key="pkmn.id"
              :class="[
                'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer group relative',
                idx === activeIndex
                  ? 'bg-[var(--color-accent-subtle)] border border-[var(--color-accent)]'
                  : 'border border-transparent hover:bg-slate-50 hover:border-[var(--color-border)]',
              ]"
              @click="handleSelect(idx)"
            >
              <!-- Progress ring + sprite -->
              <div class="relative shrink-0 w-10 h-10 flex items-center justify-center">
                <svg class="absolute inset-0 w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" :r="RING_R" fill="none" stroke="#e2e8f0" stroke-width="2.5" />
                  <circle
                    cx="18" cy="18" :r="RING_R" fill="none"
                    :stroke="ringColor(pkmn)" stroke-width="2.5" stroke-linecap="round"
                    :stroke-dasharray="RING_C" :stroke-dashoffset="ringOffset(pkmn)"
                    class="transition-all duration-500"
                  />
                </svg>
                <img
                  v-if="pkmn.dexEntry"
                  :src="getSpriteUrl(pkmn.dexEntry.nationalId)"
                  :alt="displayName(pkmn)"
                  class="w-6 h-6 sprite-pixel relative z-[1]"
                />
                <span v-else class="text-lg relative z-[1]">❓</span>
              </div>

              <!-- Name + EV count -->
              <div class="flex-1 min-w-0 text-left">
                <p class="text-sm font-medium text-[var(--color-text-primary)] truncate leading-tight">
                  {{ displayName(pkmn) }}
                </p>
                <p class="text-[11px] text-[var(--color-text-muted)] leading-tight mt-0.5">
                  {{ totalEvs(pkmn) }} / 510 EVs
                </p>
              </div>

              <!-- Delete on active -->
              <button
                v-if="idx === activeIndex && pokemonList.length > 1"
                :class="[
                  'shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer',
                  confirmDeleteIdx === idx
                    ? 'bg-red-100 text-red-500 scale-110'
                    : 'opacity-0 group-hover:opacity-100 hover:bg-red-50 text-[var(--color-text-muted)] hover:text-red-500',
                ]"
                :title="confirmDeleteIdx === idx ? t('sidebar.confirmDelete') : t('pokemon.remove')"
                @click="requestDelete(idx, $event)"
              >
                <Trash2 :size="14" />
              </button>
            </button>
          </TransitionGroup>
        </div>

        <!-- Add button -->
        <div class="shrink-0 p-2 border-t border-[var(--color-border)]">
          <button
            class="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-[var(--color-border)]
                   text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]
                   hover:bg-[var(--color-accent-subtle)] transition-all cursor-pointer"
            @click="emit('open-pokedex'); closeMobile()"
          >
            <Plus :size="16" />
            <span class="text-xs font-medium">{{ t('sidebar.addPokemon') }}</span>
          </button>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sidebar-expanded {
  width: 260px;
  min-width: 260px;
  transition: width 0.25s ease, min-width 0.25s ease;
}
.sidebar-collapsed {
  width: 64px;
  min-width: 64px;
  transition: width 0.25s ease, min-width 0.25s ease;
}

/* Mobile slide */
.sb-slide-enter-active,
.sb-slide-leave-active {
  transition: transform 0.3s ease;
}
.sb-slide-enter-from,
.sb-slide-leave-to {
  transform: translateX(-100%);
}
.sb-backdrop-enter-active,
.sb-backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.sb-backdrop-enter-from,
.sb-backdrop-leave-to {
  opacity: 0;
}

/* List transitions */
.pkmn-list-move,
.pkmn-list-enter-active,
.pkmn-list-leave-active {
  transition: all 0.3s ease;
}
.pkmn-list-enter-from,
.pkmn-list-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
.pkmn-list-leave-active {
  position: absolute;
  width: calc(100% - 16px);
}
</style>
