import { ref, computed, watch, onMounted } from 'vue'
import { STAT_KEYS } from '../data/hoennDex.js'

const STORAGE_KEY = 'emerald-ev-tracker-v3'

// ── Shared reactive state ───────────────────────────
const pokemonList = ref([])
const activeIndex = ref(0)

// ── Factory ─────────────────────────────────────────
function createPokemon(dexEntry = null, fallbackName = 'My Pokémon') {
  return {
    id: Date.now() + Math.random(),
    name: dexEntry ? dexEntry.name : fallbackName,
    dexEntry: dexEntry ?? null,
    evCap: 252,
    evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    machoActive: false,
    pokerusActive: false,
  }
}

export function useStore() {
  const activePokemon = computed(() => pokemonList.value[activeIndex.value] ?? null)

  function totalEvs(pokemon) {
    if (!pokemon) return 0
    return Object.values(pokemon.evs).reduce((s, v) => s + v, 0)
  }

  function evPercent(pokemon) {
    return Math.round((totalEvs(pokemon) / 510) * 100)
  }

  // ── Management ──────────────────────────────────
  function addPokemon(dexEntry, fallbackName) {
    pokemonList.value.push(createPokemon(dexEntry, fallbackName))
    activeIndex.value = pokemonList.value.length - 1
  }

  function removePokemon(index) {
    if (pokemonList.value.length <= 1) return
    pokemonList.value.splice(index, 1)
    if (activeIndex.value >= pokemonList.value.length) {
      activeIndex.value = pokemonList.value.length - 1
    }
  }

  function selectPokemon(index) {
    activeIndex.value = index
  }

  // ── EV Logic (Gen 3) ───────────────────────────
  function getMultiplier(pokemon) {
    let m = 1
    if (pokemon?.machoActive) m *= 2
    if (pokemon?.pokerusActive) m *= 2
    return m
  }

  function defeatPokemon(stat, baseEv) {
    const pokemon = activePokemon.value
    if (!pokemon) return

    const gain = baseEv * getMultiplier(pokemon)
    const maxForStat = pokemon.evCap - pokemon.evs[stat]
    const maxForTotal = 510 - totalEvs(pokemon)
    const actualGain = Math.max(0, Math.min(gain, maxForStat, maxForTotal))
    pokemon.evs[stat] += actualGain
  }

  function adjustEv(stat, amount) {
    const pokemon = activePokemon.value
    if (!pokemon) return

    if (amount > 0) {
      const maxForStat = pokemon.evCap - pokemon.evs[stat]
      const maxForTotal = 510 - totalEvs(pokemon)
      pokemon.evs[stat] += Math.max(0, Math.min(amount, maxForStat, maxForTotal))
    } else {
      pokemon.evs[stat] = Math.max(0, pokemon.evs[stat] + amount)
    }
  }

  function useVitamin(stat) {
    const pokemon = activePokemon.value
    if (!pokemon || pokemon.evs[stat] >= 100) return
    const maxGain = Math.min(10, 100 - pokemon.evs[stat], 510 - totalEvs(pokemon))
    if (maxGain > 0) pokemon.evs[stat] += maxGain
  }

  function resetStats() {
    const pokemon = activePokemon.value
    if (!pokemon) return
    STAT_KEYS.forEach((s) => (pokemon.evs[s] = 0))
  }

  function toggleMultiplier(type) {
    const pokemon = activePokemon.value
    if (!pokemon) return
    if (type === 'macho') pokemon.machoActive = !pokemon.machoActive
    if (type === 'pokerus') pokemon.pokerusActive = !pokemon.pokerusActive
  }

  function setEvCap(cap) {
    const pokemon = activePokemon.value
    if (!pokemon) return
    pokemon.evCap = cap
    STAT_KEYS.forEach((s) => {
      if (pokemon.evs[s] > cap) pokemon.evs[s] = cap
    })
  }

  // ── Persistence ─────────────────────────────────
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        pokemonList: pokemonList.value,
        activeIndex: activeIndex.value,
      }))
    } catch {}
  }

  function load(fallbackName = 'My Pokémon') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw)
        pokemonList.value = data.pokemonList || []
        activeIndex.value = data.activeIndex || 0
        if (activeIndex.value >= pokemonList.value.length) activeIndex.value = 0
      }
    } catch {}
    if (pokemonList.value.length === 0) {
      addPokemon(null, fallbackName)
    }
  }

  function initPersistence(fallbackName = 'My Pokémon') {
    onMounted(() => load(fallbackName))
    watch([pokemonList, activeIndex], save, { deep: true })
  }

  return {
    pokemonList,
    activeIndex,
    activePokemon,
    totalEvs,
    evPercent,
    addPokemon,
    removePokemon,
    selectPokemon,
    getMultiplier,
    defeatPokemon,
    adjustEv,
    useVitamin,
    resetStats,
    toggleMultiplier,
    setEvCap,
    initPersistence,
  }
}
