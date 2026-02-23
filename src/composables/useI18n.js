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
      myPokemons: 'My Pokémons',
    },
    sidebar: {
      team: 'Team',
      addPokemon: 'Add Pokémon',
      confirmDelete: 'Click again to confirm deletion',
      deleteTitle: 'Delete {name}?',
      deleteMsg: 'Are you sure you want to delete this Pokémon? All its EV data will be lost.',
      deleteBtn: 'Delete',
      cancelBtn: 'Cancel',
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
      minus1: '-1 EV',
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
    data: {
      title: 'Data Management',
      backup: 'Backup Data',
      import: 'Import Data',
      clearAll: 'Clear All Data',
      confirmImport: 'Replace all data?',
      confirmImportMsg: 'This will replace all your current Pokémon with the imported data. Continue?',
      confirmClear: 'Delete all data?',
      confirmClearMsg: 'This will permanently delete all your Pokémon and reset the app. This cannot be undone.',
      confirmClearBtn: 'Yes, delete everything',
      confirmImportBtn: 'Yes, import',
      cancel: 'Cancel',
      importSuccess: 'Data imported successfully! Reloading…',
      importError: 'The selected file is not a valid backup.',
      noData: 'No data to export.',
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
      myPokemons: 'Mes Pokémons',
    },
    sidebar: {
      team: 'Équipe',
      addPokemon: 'Ajouter un Pokémon',
      confirmDelete: 'Cliquez à nouveau pour confirmer',
      deleteTitle: 'Supprimer {name} ?',
      deleteMsg: 'Êtes-vous sûr de vouloir supprimer ce Pokémon ? Toutes ses données d\'EVs seront perdues.',
      deleteBtn: 'Supprimer',
      cancelBtn: 'Annuler',
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
      minus1: '-1 EV',
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
    data: {
      title: 'Gestion des données',
      backup: 'Sauvegarder',
      import: 'Importer',
      clearAll: 'Tout supprimer',
      confirmImport: 'Remplacer toutes les données ?',
      confirmImportMsg: 'Cela remplacera tous vos Pokémon actuels par les données importées. Continuer ?',
      confirmClear: 'Supprimer toutes les données ?',
      confirmClearMsg: 'Cela supprimera définitivement tous vos Pokémon et réinitialisera l\'application. Cette action est irréversible.',
      confirmClearBtn: 'Oui, tout supprimer',
      confirmImportBtn: 'Oui, importer',
      cancel: 'Annuler',
      importSuccess: 'Données importées avec succès ! Rechargement…',
      importError: 'Le fichier sélectionné n\'est pas une sauvegarde valide.',
      noData: 'Aucune donnée à exporter.',
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
