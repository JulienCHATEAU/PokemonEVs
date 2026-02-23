import { ref, computed } from 'vue'

const STORAGE_LANG_KEY = 'emerald-ev-lang'

const currentLang = ref(
  (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_LANG_KEY)) || 'en'
)

export function useI18n() {
  function setLang(lang) {
    currentLang.value = lang
    try { localStorage.setItem(STORAGE_LANG_KEY, lang) } catch {}
  }

  function toggleLang() {
    setLang(currentLang.value === 'en' ? 'fr' : 'en')
  }

  const lang = computed(() => currentLang.value)

  function t(key) {
    const keys = key.split('.')
    let val = translations[currentLang.value]
    for (const k of keys) {
      val = val?.[k]
    }
    return val ?? key
  }

  return { lang, setLang, toggleLang, t }
}

const translations = {
  en: {
    header: {
      title: 'Emerald EV Tracker',
      subtitle: 'Gen III · Pokémon Emerald',
    },
    pokemon: {
      select: 'Select',
      addFromDex: 'Add from Pokédex',
      remove: 'Remove',
      noPokemon: 'No Pokémon selected',
      noPokemonSub: 'Add a Pokémon from the Pokédex to start training.',
      openPokedex: 'Open Pokédex',
      myPokemon: 'My Pokémon',
    },
    pokedex: {
      title: 'Hoenn Regional Pokédex',
      search: 'Search by name, type, or dex number…',
      count: '{n} Pokémon',
      cancel: 'Cancel',
      noResults: 'No Pokémon found',
      noResultsSub: 'Try a different search term.',
    },
    modifiers: {
      title: 'Training Modifiers',
      machoBrace: 'Macho Brace',
      pokerus: 'Pokérus',
      active: 'active',
      cap: 'Per-stat cap',
    },
    farm: {
      title: 'Wild Pokémon',
      subtitle: 'Defeat to gain EVs',
      filterLabel: 'Filter by stat',
      filterAll: 'All',
    },
    vitamins: {
      title: 'Vitamins',
      subtitle: '+10 EVs (max 100)',
      hpUp: 'HP Up',
      protein: 'Protein',
      iron: 'Iron',
      calcium: 'Calcium',
      zinc: 'Zinc',
      carbos: 'Carbos',
    },
    stats: {
      title: 'EV Distribution',
      totalEvs: 'Total EVs',
      evComplete: 'EV Complete',
      boost: 'BOOST',
      max: 'MAX',
      hp: 'HP',
      atk: 'ATK',
      def: 'DEF',
      spa: 'SP.ATK',
      spd: 'SP.DEF',
      spe: 'SPEED',
    },
    actions: {
      reset: 'Reset',
      resetEvs: 'Reset EVs',
      confirmReset: 'Reset all EVs?',
      confirmResetMsg: 'This will set all EVs for {name} back to 0. This cannot be undone.',
      confirm: 'Yes, reset',
      cancelAction: 'Cancel',
    },
    locations: {
      'Rusturf Tunnel': 'Rusturf Tunnel',
      'Mt Pyre': 'Mt Pyre',
      'Fiery Path': 'Fiery Path',
      'Route 113': 'Route 113',
      'Surf': 'Surf',
      'Route 104': 'Route 104',
    },
    types: {
      Normal: 'Normal', Fire: 'Fire', Water: 'Water', Grass: 'Grass',
      Electric: 'Electric', Ice: 'Ice', Fighting: 'Fighting', Poison: 'Poison',
      Ground: 'Ground', Flying: 'Flying', Psychic: 'Psychic', Bug: 'Bug',
      Rock: 'Rock', Ghost: 'Ghost', Dragon: 'Dragon', Dark: 'Dark', Steel: 'Steel',
    },
  },
  fr: {
    header: {
      title: 'Suivi des EVs Émeraude',
      subtitle: 'Gen III · Pokémon Émeraude',
    },
    pokemon: {
      select: 'Choisir',
      addFromDex: 'Ajouter depuis le Pokédex',
      remove: 'Supprimer',
      noPokemon: 'Aucun Pokémon sélectionné',
      noPokemonSub: 'Ajoutez un Pokémon depuis le Pokédex pour commencer.',
      openPokedex: 'Ouvrir le Pokédex',
      myPokemon: 'Mon Pokémon',
    },
    pokedex: {
      title: 'Pokédex Régional de Hoenn',
      search: 'Chercher par nom, type ou numéro…',
      count: '{n} Pokémon',
      cancel: 'Annuler',
      noResults: 'Aucun Pokémon trouvé',
      noResultsSub: 'Essayez un autre terme de recherche.',
    },
    modifiers: {
      title: 'Modificateurs d\'entraînement',
      machoBrace: 'Bracelet Macho',
      pokerus: 'Pokérus',
      active: 'actif',
      cap: 'Cap par stat',
    },
    farm: {
      title: 'Pokémon Sauvages',
      subtitle: 'Vaincre pour gagner des EVs',
      filterLabel: 'Filtrer par stat',
      filterAll: 'Tout',
    },
    vitamins: {
      title: 'Vitamines',
      subtitle: '+10 EVs (max 100)',
      hpUp: 'PV Plus',
      protein: 'Protéine',
      iron: 'Fer',
      calcium: 'Calcium',
      zinc: 'Zinc',
      carbos: 'Carbone',
    },
    stats: {
      title: 'Répartition des EVs',
      totalEvs: 'Total des EVs',
      evComplete: 'EVs Terminés',
      boost: 'BOOST',
      max: 'MAX',
      hp: 'PV',
      atk: 'ATQ',
      def: 'DÉF',
      spa: 'ATQ.SP',
      spd: 'DÉF.SP',
      spe: 'VIT',
    },
    actions: {
      reset: 'Réinitialiser',
      resetEvs: 'Réinitialiser les EVs',
      confirmReset: 'Réinitialiser tous les EVs ?',
      confirmResetMsg: 'Cela remettra tous les EVs de {name} à 0. Cette action est irréversible.',
      confirm: 'Oui, réinitialiser',
      cancelAction: 'Annuler',
    },
    locations: {
      'Rusturf Tunnel': 'Tunnel Mérazon',
      'Mt Pyre': 'Mont Mémoria',
      'Fiery Path': 'Chemin Ardent',
      'Route 113': 'Route 113',
      'Surf': 'Surf',
      'Route 104': 'Route 104',
    },
    types: {
      Normal: 'Normal', Fire: 'Feu', Water: 'Eau', Grass: 'Plante',
      Electric: 'Électrik', Ice: 'Glace', Fighting: 'Combat', Poison: 'Poison',
      Ground: 'Sol', Flying: 'Vol', Psychic: 'Psy', Bug: 'Insecte',
      Rock: 'Roche', Ghost: 'Spectre', Dragon: 'Dragon', Dark: 'Ténèbres', Steel: 'Acier',
    },
  },
}
