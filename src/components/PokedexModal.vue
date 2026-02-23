<script setup>
/**
 * PokedexModal — Full-screen Pokédex browser with i18n + sprite grid.
 * Bilingual search, EV yield tooltips, responsive 3–5 columns.
 */
import { ref, computed } from 'vue'
import { X, Search } from 'lucide-vue-next'
import { HOENN_DEX, getSpriteUrl } from '../data/hoennDex.js'
import { useI18n } from '../composables/useI18n.js'
import BaseButton from './BaseButton.vue'

const emit = defineEmits(['select', 'close'])
const { lang, t } = useI18n()

const search = ref('')

function pokeName(p) {
  return lang.value === 'fr' ? p.nameFr : p.name
}

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return HOENN_DEX
  return HOENN_DEX.filter((p) => {
    if (p.name.toLowerCase().includes(q)) return true
    if (p.nameFr.toLowerCase().includes(q)) return true
    if (String(p.hoennId).padStart(3, '0').includes(q)) return true
    if (String(p.nationalId).includes(q)) return true
    if (p.types.some((t) => t.toLowerCase().includes(q))) return true
    // FR type match
    if (p.types.some((tp) => {
      const frType = ({
        Normal:'normal',Fire:'feu',Water:'eau',Grass:'plante',
        Electric:'électrik',Ice:'glace',Fighting:'combat',Poison:'poison',
        Ground:'sol',Flying:'vol',Psychic:'psy',Bug:'insecte',
        Rock:'roche',Ghost:'spectre',Dragon:'dragon',Dark:'ténèbres',Steel:'acier',
      })[tp]
      return frType?.includes(q)
    })) return true
    return false
  })
})

function evYieldText(pkmn) {
  return Object.entries(pkmn.evYield)
    .map(([s, v]) => `${t('stats.' + s)} +${v}`)
    .join(', ')
}

function selectPokemon(pkmn) {
  emit('select', pkmn)
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm"
        @click="$emit('close')"
      />

      <!-- Panel -->
      <div class="relative z-10 w-full max-w-3xl max-h-[90vh] bg-[var(--color-surface)] rounded-t-2xl sm:rounded-2xl
                  flex flex-col shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h2 class="text-lg font-bold text-[var(--color-text-primary)]">
              {{ t('pokedex.title') }}
            </h2>
            <p class="text-xs text-[var(--color-text-muted)] mt-0.5">
              {{ t('pokedex.count').replace('{n}', filtered.length) }}
            </p>
          </div>
          <BaseButton variant="ghost" size="sm" square @click="$emit('close')">
            <X :size="18" />
          </BaseButton>
        </div>

        <!-- Search -->
        <div class="px-5 pb-3">
          <div class="relative">
            <Search
              :size="16"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />
            <input
              v-model="search"
              :placeholder="t('pokedex.search')"
              class="w-full pl-9 pr-4 h-11 rounded-xl border border-[var(--color-border)]
                     bg-[var(--color-surface-alt)] text-sm
                     placeholder:text-[var(--color-text-muted)]
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30
                     focus:border-[var(--color-accent)]"
            />
          </div>
        </div>

        <!-- Grid -->
        <div class="flex-1 overflow-y-auto px-5 pb-5 scrollbar-none">
          <div
            v-if="filtered.length"
            class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2"
          >
            <button
              v-for="pkmn in filtered"
              :key="pkmn.nationalId"
              class="group flex flex-col items-center p-2 rounded-xl
                     border border-transparent hover:border-[var(--color-accent)]
                     hover:bg-[var(--color-accent-subtle)] transition-all cursor-pointer"
              @click="selectPokemon(pkmn)"
            >
              <img
                :src="getSpriteUrl(pkmn.nationalId)"
                :alt="pokeName(pkmn)"
                class="w-12 h-12 sprite-pixel"
                loading="lazy"
              />
              <span class="text-[11px] font-medium text-[var(--color-text-primary)]
                           group-hover:text-[var(--color-accent-dark)] mt-1 truncate w-full text-center">
                {{ pokeName(pkmn) }}
              </span>
              <span class="text-[10px] text-[var(--color-text-muted)]">
                #{{ String(pkmn.hoennId).padStart(3, '0') }}
              </span>
              <span class="text-[9px] text-[var(--color-accent)] font-medium mt-0.5 opacity-0
                           group-hover:opacity-100 transition-opacity truncate w-full text-center">
                {{ evYieldText(pkmn) }}
              </span>
            </button>
          </div>

          <!-- Empty state -->
          <div v-else class="flex flex-col items-center justify-center py-16 text-center">
            <Search :size="32" class="text-[var(--color-text-muted)] mb-3" />
            <p class="font-medium text-[var(--color-text-secondary)]">{{ t('pokedex.noResults') }}</p>
            <p class="text-sm text-[var(--color-text-muted)] mt-1">{{ t('pokedex.noResultsSub') }}</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
