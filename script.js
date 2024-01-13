const allPokemons = document.getElementById('poke-container');
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
let pokemonData = [];
let pokemon;
let typeColor;
let typeBadges;
let id = 0;

let isLoading = false;

async function init() {
  for (let i = 1; i <= 24; i++) {
    await fetchPokeData(id + i);
  }
  renderPokemonTile(pokemonData);
}

async function loadMore() {
  if (isLoading) {
    return;
  }
  isLoading = true;
  toggleSpinner(isLoading);

  const nextId = pokemonData.length + 1;
  for (let i = 0; i < 24; i++) {
    await fetchPokeData(nextId + i);
  }
  renderPokemonTile(pokemonData);
  isLoading = false;
  toggleSpinner(isLoading);
}

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

function openCardAnimation() {
  const pokeCard = document.getElementById('poke-card');
  // const pokeTiles = document.querySelectorAll('.pokemon-tile');
  const overlay = document.getElementById('overlay');
  // const loadBtn = document.getElementById('load-btn');

  overlay.classList.toggle('d-none');
  pokeCard.classList.toggle('d-none');

  pokeCard.classList.toggle('fade-in');
  setTimeout(() => {
    pokeCard.classList.toggle('fade-in');
  }, 255);
}

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
