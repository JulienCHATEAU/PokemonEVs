import { ref, computed, onMounted } from 'vue'

const STORAGE_KEY = 'emerald-ev-theme'

const isDark = ref(false)

function applyTheme() {
  const root = document.documentElement
  if (isDark.value) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function useTheme() {
  function toggle() {
    isDark.value = !isDark.value
    try { localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light') } catch {}
    applyTheme()
  }

  function init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'dark') {
        isDark.value = true
      } else if (stored === 'light') {
        isDark.value = false
      } else {
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
    } catch {
      isDark.value = false
    }
    applyTheme()
  }

  onMounted(init)

  const dark = computed(() => isDark.value)

  return { dark, toggle }
}
