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
/** short term for 'pokemonData[i]' */
let pokemon;

let likeSymbol;

/** background color, based on the fetched type-value of the Pokemon (grass, water, etc.) */
let typeColor;
/** short term for the html-element to be created */
let typeBadges;

/**  @param {boolean} isLoading boolean flag to indicate loading status */
let isLoading = false;
/**  @param {boolean} isFromEvoTab boolean flag to indicate if called from evolution tab in card-view */
let isFromEvoTab = false;

// FUNCTIONS

/** async initial onload-function
 * - calls and awaits {@link fetchAllData} within a for-loop 24 times
 * - handing over @param {number} i
 * - starts with i=1 since there is no pokemon with ID = 0
 * - calls {@link renderPokemonTile}
 * - handing over @param {string} pokemonData
 */
async function init() {
  for (let i = 1; i <= 24; i++) {
    await fetchAllData(i);
  }
  renderPokemonTile(pokemonData);
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
}

/** toggles the visibility, appearance and state of the spinner element based on {@link isLoading} - state
 * * ---
 * receives: @param {boolean} isLoading
 */
function toggleSpinner(isLoading) {
  const spinner = document.getElementById('spinner');

  if (isLoading) {
    spinner.classList.remove('no-spinning', 'd-none');
    spinner.classList.add('spinning');
  } else {
    spinner.classList.remove('spinning');
    spinner.classList.add('no-spinning');
    setTimeout(() => {
      spinner.classList.add('d-none');
    }, 145);
  }
}

/** performs a decent animation to open a Pokemon card */
function openCardAnimation() {
  const pokeCard = document.getElementById('poke-card');
  const overlay = document.getElementById('overlay');

  overlay.classList.toggle('d-none');
  pokeCard.classList.toggle('d-none');

  pokeCard.classList.toggle('fade-in');
  setTimeout(() => {
    pokeCard.classList.toggle('fade-in');
  }, 255);
}

/** performs a decent animation to close a Pokemon card */
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

function toggleLike(pokemon) {
  if (pokemon.isLiked === 'true') {
    pokemon.isLiked = 'false';
  } else {
    pokemon.isLiked = 'true';
  }
  renderHeart(pokemon);

  // save();
}
