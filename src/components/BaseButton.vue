<script setup>
/**
 * BaseButton — Reusable button with Fitts's Law sizing.
 * Large min-h touch targets, consistent styling, icon + label slots.
 */
defineProps({
  variant: { type: String, default: 'default' }, // default | accent | danger | ghost | chip
  size: { type: String, default: 'md' },          // sm | md | lg
  active: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  square: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<template>
  <button
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-150',
      'select-none cursor-pointer border',
      'active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none',
      // Size
      size === 'sm' && 'min-h-[36px] px-2.5 text-xs rounded-lg',
      size === 'md' && 'min-h-[44px] px-3.5 text-sm rounded-xl',
      size === 'lg' && 'min-h-[52px] px-5 text-base rounded-xl',
      square && '!px-0 aspect-square',
      // Variant
      variant === 'default' && [
        'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)]',
        'hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-strong)]',
      ],
      variant === 'accent' && [
        'bg-[var(--color-accent)] border-[var(--color-accent-dark)] text-white',
        'hover:bg-[var(--color-accent-hover)]',
      ],
      variant === 'danger' && [
        'bg-[var(--color-danger-bg)] border-[var(--color-danger-border)] text-[var(--color-danger-text)]',
        'hover:bg-[var(--color-danger-bg-hover)] hover:border-[var(--color-danger-border)]',
      ],
      variant === 'ghost' && [
        'bg-transparent border-transparent text-[var(--color-text-secondary)]',
        'hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]',
      ],
      variant === 'chip' && !active && [
        'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)]',
        'hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-strong)]',
      ],
      variant === 'chip' && active && [
        'bg-[var(--color-accent-subtle)] border-[var(--color-accent)]',
        'text-[var(--color-accent-dark)] font-semibold',
      ],
    ]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
