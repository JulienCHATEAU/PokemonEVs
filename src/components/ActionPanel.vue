<script setup>
/**
 * ActionPanel — Training controls: multiplier toggles, stat filter chips,
 * wild Pokémon farm spots with sprites, vitamins with item sprites,
 * -1 fine-tuning buttons per stat, all i18n-aware.
 */
import { ref, computed } from 'vue'
import { Swords, FlaskConical } from 'lucide-vue-next'
import { FARM_SPOTS, VITAMINS, STAT_KEYS, STAT_META, getSpriteUrl, getItemSpriteUrl } from '../data/hoennDex.js'
import { useI18n } from '../composables/useI18n.js'
import { useStore } from '../composables/useStore.js'

const { lang, t } = useI18n()
const {
  activePokemon, getMultiplier,
  defeatPokemon, useVitamin,
} = useStore()

// ── Farm spots grouped by stat ─────────────────────
const farmGrouped = computed(() => {
  const groups = []
  for (const stat of STAT_KEYS) {
    const spots = FARM_SPOTS.filter((s) => s.stat === stat)
    if (spots.length > 0) groups.push({ stat, spots })
  }
  return groups
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
    <!-- ═══ Wild Pokémon (Farm Spots) — Grouped by Stat ═══ -->
    <section class="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4">
      <div class="mb-3">
        <h3 class="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <Swords :size="15" class="text-[var(--color-accent)]" />
          {{ t('farm.title') }}
        </h3>
        <p class="text-xs text-[var(--color-text-muted)] mt-0.5">{{ t('farm.subtitle') }}</p>
      </div>

      <div class="space-y-3">
        <div
          v-for="group in farmGrouped"
          :key="group.stat"
          class="flex items-start gap-3"
        >
          <!-- Stat label -->
          <div class="shrink-0 w-16 pt-2.5 flex flex-col items-center gap-0.5">
            <span
              class="text-[11px] font-bold leading-none"
              :style="{ color: STAT_META[group.stat].color }"
            >
              {{ t('stats.' + group.stat) }}
            </span>
            <span
              class="w-6 h-1 rounded-full"
              :style="{ background: STAT_META[group.stat].color }"
            />
          </div>

          <!-- Pokémon buttons for this stat -->
          <div class="flex-1 flex flex-wrap gap-1.5">
            <button
              v-for="spot in group.spots"
              :key="spot.nationalId + spot.stat"
              :disabled="!activePokemon"
              class="flex w-3/7 items-center gap-2 px-2.5 py-2 rounded-xl border border-[var(--color-border)]
                     hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)]
                     transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none
                     active:scale-[0.97] group"
              @click="defeatPokemon(spot.stat, spot.baseEv)"
            >
              <img
                :src="getSpriteUrl(spot.nationalId)"
                :alt="farmName(spot)"
                class="w-8 h-8 sprite-pixel shrink-0"
                loading="lazy"
              />
              <div class="text-left min-w-0">
                <span class="text-xs font-medium text-[var(--color-text-primary)] truncate block">
                  {{ farmName(spot) }}
                </span>
                <span class="text-[10px] text-[var(--color-text-muted)] leading-tight block">
                  {{ farmLocation(spot) }}
                  ·
                  <span
                    class="font-bold"
                    :style="{ color: STAT_META[spot.stat].color }"
                  >+{{ spot.baseEv }}</span>
                  <span
                    v-if="multiplier > 1 && activePokemon"
                    class="font-bold text-[var(--color-gold-dark)]"
                  >
                    → +{{ spot.baseEv * multiplier }}
                  </span>
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ Vitamins ═══ -->
    <section class="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4">
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
