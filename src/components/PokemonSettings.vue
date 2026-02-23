<script setup>
/**
 * PokemonSettings — Popover for per-Pokémon training modifiers
 * (Macho Brace / Pokérus toggles). Triggered by gear icon in StatsDashboard.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Settings, X } from 'lucide-vue-next'
import { useI18n } from '../composables/useI18n.js'
import { useStore } from '../composables/useStore.js'
import { getItemSpriteUrl } from '../data/hoennDex.js'
import BaseButton from './BaseButton.vue'

const { t } = useI18n()
const { activePokemon, toggleMultiplier, getMultiplier } = useStore()

const open = ref(false)
const popoverRef = ref(null)
const triggerRef = ref(null)

const multiplier = computed(() => getMultiplier(activePokemon.value))

function toggle() { open.value = !open.value }

function onClickOutside(e) {
  if (
    open.value &&
    popoverRef.value && !popoverRef.value.contains(e.target) &&
    triggerRef.value && !triggerRef.value.contains(e.target)
  ) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside, true))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside, true))
</script>

<template>
  <div class="relative">
    <!-- Trigger: gear icon -->
    <button
      ref="triggerRef"
      class="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer
             text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-surface-hover)]"
      :title="t('settings.title')"
      @click.stop="toggle"
    >
      <Settings :size="16" />
    </button>

    <!-- Popover -->
    <Transition name="pop">
      <div
        v-if="open"
        ref="popoverRef"
        class="absolute right-0 top-full mt-2 z-50 w-64 bg-[var(--color-surface)] rounded-xl
               border border-[var(--color-border)] shadow-xl p-4 space-y-3"
      >
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
            {{ t('settings.title') }}
          </h4>
          <button
            class="w-6 h-6 rounded-md flex items-center justify-center text-[var(--color-text-muted)]
                   hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]
                   transition-all cursor-pointer"
            @click="open = false"
          >
            <X :size="14" />
          </button>
        </div>

        <!-- Macho Brace toggle -->
        <button
          :disabled="!activePokemon"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all cursor-pointer
                 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]"
          :class="activePokemon?.machoActive
            ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)] text-[var(--color-accent-dark)]'
            : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)]'"
          @click="toggleMultiplier('macho')"
        >
          <img
            :src="getItemSpriteUrl('macho-brace')"
            alt="Macho Brace"
            class="w-7 h-7 sprite-pixel shrink-0"
          />
          <div class="text-left flex-1 min-w-0">
            <span class="text-sm font-medium block">{{ t('settings.machoBrace') }}</span>
            <span class="text-[10px] text-[var(--color-text-muted)]">EV ×2</span>
          </div>
          <div
            class="w-9 h-5 rounded-full transition-all shrink-0 relative"
            :class="activePokemon?.machoActive ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border-strong)]'"
          >
            <div
              class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
              :class="activePokemon?.machoActive ? 'left-[18px]' : 'left-0.5'"
            />
          </div>
        </button>

        <!-- Pokérus toggle -->
        <button
          :disabled="!activePokemon"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all cursor-pointer
                 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]"
          :class="activePokemon?.pokerusActive
            ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)] text-[var(--color-accent-dark)]'
            : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)]'"
          @click="toggleMultiplier('pokerus')"
        >
          <span class="text-2xl shrink-0 w-7 text-center">🦠</span>
          <div class="text-left flex-1 min-w-0">
            <span class="text-sm font-medium block">{{ t('settings.pokerus') }}</span>
            <span class="text-[10px] text-[var(--color-text-muted)]">EV ×2</span>
          </div>
          <div
            class="w-9 h-5 rounded-full transition-all shrink-0 relative"
            :class="activePokemon?.pokerusActive ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border-strong)]'"
          >
            <div
              class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
              :class="activePokemon?.pokerusActive ? 'left-[18px]' : 'left-0.5'"
            />
          </div>
        </button>

        <!-- Multiplier summary -->
        <div
          v-if="multiplier > 1 && activePokemon"
          class="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                 bg-[var(--color-gold-light)] border border-amber-200/50"
        >
          <span class="text-xs font-bold text-[var(--color-gold-dark)]">
            {{ t('settings.activeBonus') }}: ×{{ multiplier }}
          </span>
        </div>
        <div
          v-else-if="activePokemon"
          class="text-center text-[11px] text-[var(--color-text-muted)]"
        >
          {{ t('settings.noBonus') }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}
</style>
