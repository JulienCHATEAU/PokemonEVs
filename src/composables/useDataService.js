import { ref } from 'vue'

const STORAGE_KEY = 'emerald-ev-tracker-v3'
const STORAGE_LANG_KEY = 'emerald-ev-lang'

/**
 * Validates that the imported JSON has the expected structure
 * to prevent app crashes from malformed data.
 */
function validateBackupData(data) {
  if (!data || typeof data !== 'object') return false
  if (!Array.isArray(data.pokemonList)) return false
  if (typeof data.activeIndex !== 'number') return false

  for (const p of data.pokemonList) {
    if (typeof p.id === 'undefined') return false
    if (typeof p.name !== 'string') return false
    if (!p.evs || typeof p.evs !== 'object') return false

    const requiredStats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe']
    for (const stat of requiredStats) {
      if (typeof p.evs[stat] !== 'number') return false
      if (p.evs[stat] < 0 || p.evs[stat] > 255) return false
    }

    if (typeof p.evCap !== 'number') return false
    if (typeof p.machoActive !== 'boolean') return false
    if (typeof p.pokerusActive !== 'boolean') return false
  }

  return true
}

export function useDataService() {
  const importError = ref('')

  /**
   * Export: gather all app data from localStorage and trigger a .json download.
   */
  function exportData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        importError.value = 'NO_DATA'
        return false
      }

      const data = JSON.parse(raw)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const today = new Date().toISOString().slice(0, 10)
      const filename = `emerald-ev-tracker-backup-${today}.json`

      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      return true
    } catch {
      importError.value = 'EXPORT_FAILED'
      return false
    }
  }

  /**
   * Import: read a .json file, validate structure, then overwrite localStorage.
   * Returns a Promise that resolves to true on success, false on failure.
   */
  function importData(file) {
    importError.value = ''

    return new Promise((resolve) => {
      if (!file || !file.name.endsWith('.json')) {
        importError.value = 'INVALID_FILE'
        resolve(false)
        return
      }

      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)

          if (!validateBackupData(data)) {
            importError.value = 'INVALID_STRUCTURE'
            resolve(false)
            return
          }

          localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
          resolve(true)
        } catch {
          importError.value = 'PARSE_ERROR'
          resolve(false)
        }
      }

      reader.onerror = () => {
        importError.value = 'READ_ERROR'
        resolve(false)
      }

      reader.readAsText(file)
    })
  }

  /**
   * Clear all app data from localStorage and reload.
   */
  function clearAllData() {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_LANG_KEY)
    window.location.reload()
  }

  return {
    importError,
    exportData,
    importData,
    clearAllData,
  }
}
