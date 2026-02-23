<script setup>
/**
 * ActionPanel — Training controls: multiplier toggles, stat filter chips,
 * wild Pokémon farm spots with sprites, vitamins with item sprites,
 * -1 fine-tuning buttons per stat, all i18n-aware.
 */
import { ref, computed } from 'vue'
import { Swords, FlaskConical, Zap } from 'lucide-vue-next'
import { FARM_SPOTS, VITAMINS, STAT_KEYS, STAT_META, getSpriteUrl, getItemSpriteUrl } from '../data/hoennDex.js'
import { useI18n } from '../composables/useI18n.js'
import { useStore } from '../composables/useStore.js'
import BaseButton from './BaseButton.vue'

const { lang, t } = useI18n()
const {
  activePokemon, getMultiplier,
  defeatPokemon, useVitamin, toggleMultiplier
} = useStore()

// ── Stat filter chips ──────────────────────────────
const activeFilters = ref(new Set())

function toggleFilter(stat) {
  const s = new Set(activeFilters.value)
  if (s.has(stat)) s.delete(stat)
  else s.add(stat)
  activeFilters.value = s
}

const filteredFarmSpots = computed(() => {
  if (activeFilters.value.size === 0) return FARM_SPOTS
  return FARM_SPOTS.filter((f) => activeFilters.value.has(f.stat))
})

function farmName(spot) {
  return lang.value === 'fr' ? spot.nameFr : spot.name
}

function farmLocation(spot) {
  return t('locations.' + spot.location)
}

const multiplier = computed(() => getMultiplier(activePokemon.value))

function isVitaminDisabled(stat) {
  if (!activePokemon.value) return true
  return activePokemon.value.evs[stat] >= 100
}
</script>

<template>
  <div class="space-y-5">
    <!-- ═══ Training Modifiers ═══ -->
    <section class="bg-white rounded-2xl border border-[var(--color-border)] p-4">
      <h3 class="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
        <Zap :size="15" class="text-[var(--color-accent)]" />
        {{ t('modifiers.title') }}
      </h3>

      <div class="flex flex-wrap gap-2">
        <!-- Macho Brace -->
        <BaseButton
          variant="chip"
          size="sm"
          :active="activePokemon?.machoActive"
          :disabled="!activePokemon"
          @click="toggleMultiplier('macho')"
        >
          <img
            :src="getItemSpriteUrl('macho-brace')"
            alt="Macho Brace"
            class="w-5 h-5 sprite-pixel"
          />
          {{ t('modifiers.machoBrace') }}
        </BaseButton>

        <!-- Pokérus -->
        <BaseButton
          variant="chip"
          size="sm"
          :active="activePokemon?.pokerusActive"
          :disabled="!activePokemon"
          @click="toggleMultiplier('pokerus')"
        >
          <span class="text-base">🦠</span>
          {{ t('modifiers.pokerus') }}
        </BaseButton>

        <!-- Multiplier badge -->
        <div
          v-if="multiplier > 1 && activePokemon"
          class="flex items-center gap-1 px-2.5 h-9 rounded-lg
                 bg-[var(--color-gold-light)] text-[var(--color-gold-dark)]
                 text-xs font-bold border border-amber-200"
        >
          ×{{ multiplier }}
        </div>
      </div>
    </section>

    <!-- ═══ Wild Pokémon (Farm Spots) ═══ -->
    <section class="bg-white rounded-2xl border border-[var(--color-border)] p-4">
      <div class="flex items-start justify-between mb-3">
        <div>
          <h3 class="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Swords :size="15" class="text-[var(--color-accent)]" />
            {{ t('farm.title') }}
          </h3>
          <p class="text-xs text-[var(--color-text-muted)] mt-0.5">{{ t('farm.subtitle') }}</p>
        </div>
      </div>

      <!-- Stat filter chips -->
      <div class="flex flex-wrap gap-1.5 mb-3">
        <BaseButton
          variant="chip"
          size="sm"
          :active="activeFilters.size === 0"
          @click="activeFilters = new Set()"
        >
          {{ t('farm.filterAll') }}
        </BaseButton>
        <BaseButton
          v-for="stat in STAT_KEYS"
          :key="stat"
          variant="chip"
          size="sm"
          :active="activeFilters.has(stat)"
          @click="toggleFilter(stat)"
        >
          <span
            class="w-2 h-2 rounded-full inline-block"
            :style="{ background: STAT_META[stat].color }"
          />
          {{ t('stats.' + stat) }}
        </BaseButton>
      </div>

      <!-- Farm spot list -->
      <div class="space-y-1.5">
        <button
          v-for="spot in filteredFarmSpots"
          :key="spot.nationalId + spot.stat"
          :disabled="!activePokemon"
          class="w-full flex items-center gap-3 p-2.5 rounded-xl border border-[var(--color-border)]
                 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)]
                 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none
                 active:scale-[0.98] group"
          @click="defeatPokemon(spot.stat, spot.baseEv)"
        >
          <img
            :src="getSpriteUrl(spot.nationalId)"
            :alt="farmName(spot)"
            class="w-9 h-9 sprite-pixel shrink-0"
            loading="lazy"
          />
          <div class="flex-1 min-w-0 text-left">
            <div class="flex items-center gap-1.5">
              <span class="font-medium text-sm text-[var(--color-text-primary)] truncate">
                {{ farmName(spot) }}
              </span>
              <span
                class="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                :style="{
                  background: STAT_META[spot.stat].color + '20',
                  color: STAT_META[spot.stat].color,
                }"
              >
                {{ t('stats.' + spot.stat) }} +{{ spot.baseEv }}
              </span>
            </div>
            <span class="text-xs text-[var(--color-text-muted)]">{{ farmLocation(spot) }}</span>
          </div>
          <span
            v-if="multiplier > 1 && activePokemon"
            class="text-[10px] font-bold 
                 px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity
                 text-gray-600 bg-gray-100 border border-gray-600"
          >
            +{{ spot.baseEv * multiplier }}
          </span>
        </button>
      </div>
    </section>

    <!-- ═══ Vitamins ═══ -->
    <section class="bg-white rounded-2xl border border-[var(--color-border)] p-4">
      <h3 class="text-sm font-semibold text-[var(--color-text-primary)] mb-1 flex items-center gap-2">
        <FlaskConical :size="15" class="text-[var(--color-accent)]" />
        {{ t('vitamins.title') }}
      </h3>
      <p class="text-xs text-[var(--color-text-muted)] mb-3">{{ t('vitamins.subtitle') }}</p>

      <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <button
          v-for="vit in VITAMINS"
          :key="vit.stat"
          :disabled="isVitaminDisabled(vit.stat)"
          class="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-[var(--color-border)]
                 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)]
                 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none
                 active:scale-[0.97]"
          @click="useVitamin(vit.stat)"
        >
          <img
            :src="getItemSpriteUrl(vit.slug)"
            :alt="lang === 'fr' ? vit.fr : vit.en"
            class="w-8 h-8 sprite-pixel"
            loading="lazy"
          />
          <span class="text-[11px] font-medium text-[var(--color-text-primary)] text-center leading-tight">
            {{ lang === 'fr' ? vit.fr : vit.en }}
          </span>
          <span
            class="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
            :style="{
              background: STAT_META[vit.stat].color + '20',
              color: STAT_META[vit.stat].color,
            }"
          >
            {{ t('stats.' + vit.stat) }}
          </span>
        </button>
      </div>
    </section>


  </div>
</template>
