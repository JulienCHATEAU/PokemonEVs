<script setup>
/**
 * StatsDashboard — Read-only EV distribution: identity card, total bar,
 * per-stat animated bars. i18n-aware stat labels.
 */
import { computed } from 'vue'
import { BarChart3, Trophy, Minus } from 'lucide-vue-next'
import { STAT_KEYS, STAT_META, getSpriteUrl } from '../data/hoennDex.js'
import { useI18n } from '../composables/useI18n.js'
import { useStore } from '../composables/useStore.js'
import PokemonSettings from './PokemonSettings.vue'

const { lang, t } = useI18n()
const { activePokemon, totalEvs, evPercent, getMultiplier, adjustEv } = useStore()

const pokemon = computed(() => activePokemon.value)
const total = computed(() => totalEvs(pokemon.value))
const percent = computed(() => evPercent(pokemon.value))
const isMaxed = computed(() => total.value >= 510)
const multiplier = computed(() => getMultiplier(pokemon.value))

function displayName(p) {
  if (!p) return ''
  if (p.dexEntry) return lang.value === 'fr' ? p.dexEntry.nameFr : p.dexEntry.name
  return p.name
}

function statPercent(stat) {
  if (!pokemon.value) return 0
  return Math.round((pokemon.value.evs[stat] / pokemon.value.evCap) * 100)
}

function isStatMaxed(stat) {
  if (!pokemon.value) return false
  return pokemon.value.evs[stat] >= pokemon.value.evCap
}
</script>

<template>
  <div class="space-y-5">
    <!-- ═══ Identity Card ═══ -->
    <section
      v-if="pokemon"
      class="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5"
    >
      <div class="flex items-center gap-4">
        <!-- Sprite -->
        <div
          class="w-20 h-20 rounded-xl flex items-center justify-center shrink-0"
          :class="isMaxed ? 'bg-[var(--color-gold-light)]' : 'bg-[var(--color-accent-subtle)]'"
        >
          <img
            v-if="pokemon.dexEntry"
            :src="getSpriteUrl(pokemon.dexEntry.nationalId)"
            :alt="displayName(pokemon)"
            class="w-16 h-16 sprite-pixel"
          />
          <span v-else class="text-3xl">❓</span>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h2 class="text-xl font-bold text-[var(--color-text-primary)] truncate">
              {{ displayName(pokemon) }}
            </h2>
            <!-- Settings gear -->
            <PokemonSettings />
          </div>
          <div v-if="pokemon.dexEntry" class="flex items-center gap-1.5 mt-1">
            <span class="text-xs text-[var(--color-text-muted)]">
              #{{ String(pokemon.dexEntry.hoennId).padStart(3, '0') }}
            </span>
            <span
              v-for="tp in pokemon.dexEntry.types"
              :key="tp"
              class="text-[10px] font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]
                     px-1.5 py-0.5 rounded-md"
            >
              {{ t('types.' + tp) }}
            </span>
          </div>

          <!-- Multiplier info -->
          <div v-if="multiplier > 1" class="flex items-center gap-1 mt-1.5">
            <span class="text-[10px] font-bold text-[var(--color-gold-dark)]
                         bg-[var(--color-gold-light)] px-1.5 py-0.5 rounded-md border border-amber-200/50">
              {{ t('stats.boost') }} ×{{ multiplier }}
            </span>
            <span v-if="pokemon.machoActive" class="text-[10px] text-[var(--color-text-muted)]">
              {{ t('modifiers.machoBrace') }}
            </span>
            <span v-if="pokemon.pokerusActive" class="text-[10px] text-[var(--color-text-muted)]">
              {{ t('modifiers.pokerus') }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ Total EV Progress ═══ -->
    <section
      v-if="pokemon"
      class="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4"
    >
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <BarChart3 :size="15" class="text-[var(--color-accent)]" />
          {{ t('stats.title') }}
        </h3>
        <span
          class="text-xs font-bold px-2 py-1 rounded-lg"
          :class="isMaxed
            ? 'bg-[var(--color-gold-light)] text-[var(--color-gold-dark)]'
            : 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]'"
        >
          {{ total }} / 510
        </span>
      </div>

      <!-- Total bar -->
      <div class="w-full h-3 bg-[var(--color-surface-muted)] rounded-full overflow-hidden mb-1">
        <div
          class="h-full rounded-full transition-all duration-500 ease-out"
          :class="isMaxed ? 'bg-[var(--color-gold)]' : 'bg-[var(--color-accent)]'"
          :style="{ width: percent + '%' }"
        />
      </div>
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-[var(--color-text-muted)]">{{ t('stats.totalEvs') }}</span>
        <div v-if="isMaxed" class="flex items-center gap-1 text-[var(--color-gold-dark)]">
          <Trophy :size="12" />
          <span class="text-[11px] font-bold">{{ t('stats.evComplete') }}</span>
        </div>
        <span v-else class="text-[11px] text-[var(--color-text-muted)]">{{ percent }}%</span>
      </div>
    </section>

    <!-- ═══ Per-Stat Bars ═══ -->
    <section
      v-if="pokemon"
      class="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4 space-y-3"
    >
      <div
        v-for="stat in STAT_KEYS"
        :key="stat"
      >
        <div class="flex items-center justify-between mb-1">
          <span
            class="text-xs font-bold w-14"
            :style="{ color: STAT_META[stat].color }"
          >
            {{ t('stats.' + stat) }}
          </span>
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono text-[var(--color-text-secondary)]">
              {{ pokemon.evs[stat] }} / {{ pokemon.evCap }}
            </span>
            <button
              :disabled="pokemon.evs[stat] <= 0"
              class="w-5 h-5 rounded flex items-center justify-center
                     text-[var(--color-text-muted)] hover:text-[var(--color-danger-text)] hover:bg-[var(--color-danger-bg)]
                     transition-all cursor-pointer disabled:pointer-events-none"
              :title="t('stats.minus1')"
              @click="adjustEv(stat, -1)"
            >
              <Minus :size="12" />
            </button>
          </div>
        </div>
        <div class="w-full h-2.5 bg-[var(--color-surface-muted)] rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-300 ease-out"
            :style="{
              width: statPercent(stat) + '%',
              background: isStatMaxed(stat) ? 'var(--color-gold)' : STAT_META[stat].color,
            }"
          />
        </div>
        <div v-if="isStatMaxed(stat)" class="text-right mt-0.5">
          <span class="text-[10px] font-bold text-[var(--color-gold-dark)]">{{ t('stats.max') }}</span>
        </div>
      </div>
    </section>

    <!-- ═══ Empty state ═══ -->
    <div
      v-if="!pokemon"
      class="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-10 text-center"
    >
      <BarChart3 :size="40" class="mx-auto text-[var(--color-text-muted)] mb-3" />
      <p class="font-medium text-[var(--color-text-secondary)]">{{ t('pokemon.noPokemon') }}</p>
      <p class="text-sm text-[var(--color-text-muted)] mt-1">{{ t('pokemon.noPokemonSub') }}</p>
    </div>
  </div>
</template>
