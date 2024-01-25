// ARRAYS + JSON-objects

/** main json-object for fetched data */
let pokemonData = [];

/** set of css-variables for linear-gradients */
const typeColors = [
  'var(--fire)',
  'var(--grass)',
  'var(--electric)',
  'var(--water)',
  'var(--ground)',
  'var(--rock)',
  'var(--steel)',
  'var(--fairy)',
  'var(--poison)',
  'var(--bug)',
  'var(--dragon)',
  'var(--psychic)',
  'var(--flying)',
  'var(--fighting)',
  'var(--ghost)',
  'var(--ice)',
  'var(--dark)',
  'var(--normal)',
];

// VARIABLES

/** parent-element for all tiles & cards */
const allPokemons = document.getElementById('poke-container');
/** short term for 'pokemonData[index]' */
let pokemon;

/**
 * likedPokemonsCount keeps track of the total number of pokemon that have been liked
 * It is initialized to 0 and incremented whenever the user likes a pokemon
 */
let likedPokemonsCount = 0;

/**
 * likeSymbol is a variable that will hold the SVG symbol for the
 * "like" action, to indicate if a Pokemon is liked or not by the user
 */
let likeSymbol;

/** background color, based on the fetched type-value of the Pokemon (grass, water, etc.) */
let typeColor;
/** short term for the html-element to be created */
let typeBadges;

/** Boolean indicating if pokemon data is currently being fetched and loaded */
let isLoading = false;

/** Boolean indicating if the current view is from the evolution tab */
let isFromEvoTab = false;

/** Boolean flag indicating if the current view is filtered */
let isFilteredView = false;

// ASSETS
/**
 * likedSVG contains the SVG markup for the "liked" icon
 * This is rendered when a Pokemon is liked by the user
 */
const likedSVG = `
    <svg
      width="32" 
      height="32"
      viewBox="0 0 24 24">
      <path
        fill="#f5f7fb"
        d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.387 2.25t-1.363 2.412q-.975 1.313-2.625 2.963T13.45 19.7z" />
    </svg>
  `;

/**
 * unlikedSVG contains the SVG markup for the "unliked" icon
 * This is rendered when a Pokemon has not been liked by the user
 */
const unlikedSVG = `
    <svg
      width="32" 
      height="32"
      viewBox="0 0 24 24">
      <path
        fill="#f5f7fb"
        d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.387 2.25t-1.363 2.412q-.975 1.313-2.625 2.963T13.45 19.7zm0-2.7q2.4-2.15 3.95-3.687t2.45-2.675q.9-1.138 1.25-2.026T20 8.15q0-1.5-1-2.5t-2.5-1q-1.175 0-2.175.662T12.95 7h-1.9q-.375-1.025-1.375-1.687T7.5 4.65q-1.5 0-2.5 1t-1 2.5q0 .875.35 1.763t1.25 2.025q.9 1.137 2.45 2.675T12 18.3m0-6.825" />
    </svg>
  `;

// FUNCTIONS

/** async initial onload-function
 * - calls and awaits {@link fetchAllData} within a for-loop 24 times
 * - handing over @param {number} i
 * - starts with i=1 since there is no pokemon with ID = 0
 * - calls {@link renderPokemonTile}
 * - handing over @param {string} pokemonData
 */
async function init() {
  isLoading = true;
  toggleSpinner(isLoading);
  for (let i = 1; i <= 24; i++) {
    await fetchAllData(i);
  }
  renderPokemonTile(pokemonData);
  isLoading = false;
  toggleSpinner(isLoading);
}

/** loads additional Pokemon data
 * - checks if data is currently being loaded
 * - if loading, returns early
 * - sets {@link isLoading} flag to true
 * - toggles loading-spinner based on {@link isLoading} status
 * - calculates next Pokemon-ID based on {@link pokemonData}-length
 * - fetches data for the next 24 Pokemon starting from nextId
 * - calls {@link fetchAllData} within a for-loop 24 times
 * - handing over @param {number} i
 * - calls {@link renderPokemonTile} with updated pokemonData
 * - toggles loading-spinner back off with {@link isLoading}=false after loading is complete
 */
async function loadMore() {
  if (isLoading) {
    return;
  }
  isLoading = true;
  toggleSpinner(isLoading);

  const nextId = pokemonData.length + 1;
  for (let i = 0; i < 24; i++) {
    await fetchAllData(nextId + i);
  }
  renderPokemonTile(pokemonData);
  isLoading = false;
  toggleSpinner(isLoading);
  addOnClicks();
}

/**
 * Toggles the visibility and spinning state of the spinner element
 *
 * @param {boolean} isLoading - Whether data is currently loading
 */
function toggleSpinner(isLoading) {
  const spinner = document.getElementById('spinner');
  const footer = document.getElementById('footer');

  if (isLoading) {
    spinner.classList.remove('no-spinning', 'd-none');
    spinner.classList.add('spinning');
    footer.classList.add('d-none');
  } else {
    spinner.classList.remove('spinning');
    spinner.classList.add('no-spinning');
    setTimeout(() => {
      spinner.classList.add('d-none');
      footer.classList.remove('d-none');
    }, 145);
  }
}

/**
 * Performs an animation to open the Pokemon card overlay
 * Hides the search input, fades in the card and overlay
 */
function openCardAnimation() {
  const pokeCard = document.getElementById('poke-card');
  const overlay = document.getElementById('overlay');

  searchInput.value = '';
  overlay.classList.toggle('d-none');
  pokeCard.classList.toggle('d-none');

  pokeCard.classList.toggle('fade-in');
  setTimeout(() => {
    pokeCard.classList.toggle('fade-in');
  }, 255);
}

/**
 * Performs an animation to close the Pokemon card overlay
 * Fades out the card and hides the overlay
 */
function closeCardAnimation() {
  const pokeCard = document.getElementById('poke-card');
  const overlay = document.getElementById('overlay');

  overlay.classList.toggle('d-none');

  pokeCard.classList.toggle('fade-out');
  setTimeout(() => {
    pokeCard.classList.toggle('fade-out');
    pokeCard.classList.toggle('d-none');
  }, 255);
}

/**
 * Gets reference to search input element
 * Adds input event listener that calls searchPokemon() on each input
 */
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', function () {
  searchPokemon();
});

/**
 * Searches for Pokemon based on user input and updates the UI
 *
 * Gets the search term from the search input element
 * Filters the Pokemon data array to find matches
 * Updates the search button style if there is a search term
 * Shows/hides the footer based on if there is a search term
 * Shows/hides Pokemon tiles based on search filter matches
 * Shows/hides no matches message based on number of matches
 */
function searchPokemon() {
  const searchTerm = searchInput.value.toLowerCase();
  const tiles = document.querySelectorAll('.pokemon-tile');
  const footer = document.getElementById('footer');
  const filteredPokemon = filterPokemon(searchTerm);

  updateSearchButton(searchTerm);
  updateFooterVisibility(searchTerm, footer);
  updatePokemonTileVisibility(tiles, filteredPokemon);
  updateNoMatchesMessage(filteredPokemon.length);
}

/**
 * Filters the pokemonData array to find pokemon matching the search term
 * Checks if search term is included in pokemon name or id
 * Returns array of matching pokemon
 */
function filterPokemon(searchTerm) {
  return pokemonData.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm) ||
      pokemon.id.toString().includes(searchTerm)
  );
}

/**
 * Updates the search button style based on if there is a search term
 * Adds the 'outlined' class if there is a search term, which changes the style
 * Removes the 'outlined' class if there is no search term
 */
function updateSearchButton(searchTerm) {
  const searchBtn = document.getElementById('search-btn');

  if (searchTerm !== '') {
    searchBtn.classList.add('outlined');
  } else {
    searchBtn.classList.remove('outlined');
  }
}

/**
 * Updates the footer element's visibility based on if there is a search term
 * Hides the footer if there is a search term
 * Shows the footer if there is no search term
 */
function updateFooterVisibility(searchTerm, footer) {
  if (searchTerm !== '') {
    footer.classList.add('d-none');
  } else {
    footer.classList.remove('d-none');
  }
}

/**
 * Updates the visibility of the pokemon tiles based on the filtered pokemon list
 * Loops through each tile and checks if the pokemon name in the tile matches any in the filtered list
 * If in filtered view, also checks if the pokemon is liked before showing
 * Toggles the 'd-none' class on the tile to show/hide it based on the matches
 */
function updatePokemonTileVisibility(tiles, filteredPokemon) {
  tiles.forEach((tile, index) => {
    const pokemon = pokemonData[index];
    const tileContent = tile.innerText.toLowerCase();
    const isMatch = filteredPokemon.some((matchedPokemon) =>
      tileContent.includes(matchedPokemon.name.toLowerCase())
    );

    if (isFilteredView) {
      const isLiked = pokemon.isLiked === 'true';
      tile.classList.toggle('d-none', !isMatch || !isLiked);
    } else {
      tile.classList.toggle('d-none', !isMatch);
    }
  });
}

/**
 * Updates the visibility of the 'no matches' message based on the match count.
 * Shows the 'no matches' message if there are no matches.
 * Hides the 'no matches' message if there are any matches.
 */
function updateNoMatchesMessage(matchCount) {
  const noMatchesMessage = document.getElementById('no-matches');

  if (matchCount === 0) {
    noMatchesMessage.classList.remove('d-none');
  } else {
    noMatchesMessage.classList.add('d-none');
  }
}

/**
 * Clears the search input field and runs  {@link searchPokemon} to reset the search
 */
function clearSearch() {
  searchInput.value = '';
  searchPokemon();
}

/**
 * Toggles the visibility of liked Pokemon
 * Calls toggleLikedPokemonFilter() to toggle the filter
 * Calls updatePokemonTiles() to show/hide Pokemon based on filter
 * Calls updateNoLikesMessage() to show/hide no likes message based on count
 */
function toggleLikedPokemonVisibility() {
  toggleLikedPokemonFilter();
  updatePokemonTiles();
  updateNoLikesMessage(likedPokemonsCount);
}

/**
 * toggles the filter for liked pokemons
 */
function toggleLikedPokemonFilter() {
  isFilteredView = !isFilteredView;
  updateControlIcons();
  clearSearch();
}

/**
 * updates the footer-appearance based on filter
 */
function updateControlIcons() {
  const footer = document.getElementById('footer');
  const loveBtn = document.getElementById('love-button');

  if (isFilteredView) {
    loveBtn.classList.add('outlined');
    footer.classList.add('d-none');
  } else {
    loveBtn.classList.remove('outlined');
    footer.classList.remove('d-none');
  }
}

/**
 * Updates the visibility of the Pokemon tiles based on
 * the filter for liked Pokemon
 * Hides tiles if filtered to liked only and the Pokemon is not liked
 * Shows all tiles if not filtering
 */
function updatePokemonTiles() {
  const tiles = document.querySelectorAll('.pokemon-tile');

  tiles.forEach((tile, index) => {
    const pokemon = pokemonData[index];
    tile.dataset.liked = pokemon.isLiked;

    if (isFilteredView) {
      const isLiked = pokemon.isLiked === 'true';
      tile.classList.toggle('d-none', !isLiked);
    } else {
      tile.classList.remove('d-none');
    }
  });
}

/**
 * toggles the like status of a Pokemon and updates the UI accordingly
 * @param index - represents the index of the Pokemon in the `pokemonData` array
 */
function toggleLike(index) {
  updatePokemonLikeStatus(index);
  updateTileLikeStatus(index);
  updateTileVisibility(index);
  updateNoLikesMessage(likedPokemonsCount);
}

/**
 * Updates the like status for the Pokemon at the given index in pokemonData
 * Toggles the isLiked property between 'true' and 'false'
 * Increments likedPokemonsCount if toggled to liked, decrements if toggled to unliked
 * Calls renderHeart() to update the UI heart for the Pokemon
 */
function updatePokemonLikeStatus(index) {
  let pokemon = pokemonData[index];

  if (pokemon.isLiked === 'true') {
    pokemon.isLiked = 'false';
    likedPokemonsCount--;
  } else {
    pokemon.isLiked = 'true';
    likedPokemonsCount++;
  }
  targetID = pokemonData[index].id;
  renderHeart(pokemon, targetID);
}

/**
 * Updates the "data-liked" attribute on each Pokemon tile
 * based on the isLiked property in the pokemonData array
 *
 * @param {number} index - The index of the Pokemon in pokemonData array
 */
function updateTileLikeStatus(index) {
  const tiles = document.querySelectorAll('.pokemon-tile');
  tiles.forEach((tile, index) => {
    tile.dataset.liked = pokemonData[index].isLiked;
  });
}

/**
 * Toggles the visibility of a Pokemon tile based on
 * whether the view is filtered and the Pokemon's like status
 *
 * @param {number} index - The index of the Pokemon in pokemonData
 */
function updateTileVisibility(index) {
  if (isFilteredView) {
    const currentTile = document.getElementById(`pokemon-tile-${pokemon.id}`);
    currentTile.classList.toggle('d-none');
  }
}

/**
 * updates the visibility of a message shown based on the
 * number of liked Pokemons and whether the view is filtered
 * @param likedPokemonsCount - represents the number of liked pokemons
 */
function updateNoLikesMessage(likedPokemonsCount) {
  const noLikesMessage = document.getElementById('no-likes');
  if (isFilteredView && likedPokemonsCount === 0) {
    noLikesMessage.classList.remove('d-none');
  } else {
    noLikesMessage.classList.add('d-none');
  }
}

/**
 * Scrolls the page to the top of the page
 */
function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
