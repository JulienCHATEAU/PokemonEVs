<script setup>
/**
 * LanguageSelector — Dropdown for language switching (EN/FR).
 * Replaces the simple Globe toggle button in the header.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Globe, Check } from 'lucide-vue-next'
import { useI18n } from '../composables/useI18n.js'

const { lang, setLang, t } = useI18n()

const open = ref(false)
const dropdownRef = ref(null)
const triggerRef = ref(null)

const languages = [
  { code: 'en', flag: '🇬🇧' },
  { code: 'fr', flag: '🇫🇷' },
]

function toggle() { open.value = !open.value }

function select(code) {
  setLang(code)
  open.value = false
}

function onClickOutside(e) {
  if (
    open.value &&
    dropdownRef.value && !dropdownRef.value.contains(e.target) &&
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
    <!-- Trigger -->
    <button
      ref="triggerRef"
      class="inline-flex items-center gap-1.5 min-h-[36px] px-2.5 text-xs font-medium rounded-lg
             border border-transparent bg-transparent text-[var(--color-text-secondary)]
             hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]
             transition-all cursor-pointer select-none"
      @click.stop="toggle"
    >
      <Globe :size="16" />
      <span class="font-bold uppercase">{{ lang }}</span>
    </button>

    <!-- Dropdown -->
    <Transition name="dd">
      <div
        v-if="open"
        ref="dropdownRef"
        class="absolute right-0 top-full mt-1.5 z-50 w-44 bg-[var(--color-surface)] rounded-xl
               border border-[var(--color-border)] shadow-xl py-1.5 overflow-hidden"
      >
        <div class="px-3 py-1.5 mb-1">
          <span class="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
            {{ t('language.title') }}
          </span>
        </div>
        <button
          v-for="l in languages"
          :key="l.code"
          class="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-all cursor-pointer
                 hover:bg-[var(--color-surface-hover)]"
          :class="lang === l.code ? 'text-[var(--color-accent)] font-semibold' : 'text-[var(--color-text-secondary)]'"
          @click="select(l.code)"
        >
          <span class="text-base">{{ l.flag }}</span>
          <span class="flex-1 text-left">{{ t('language.' + l.code) }}</span>
          <Check v-if="lang === l.code" :size="14" class="text-[var(--color-accent)]" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dd-enter-active,
.dd-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dd-enter-from,
.dd-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}
</style>
