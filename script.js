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
let id = 0;
let isLoading = false;

async function init() {
  // for (let i = 1; i <= 24; i++) {
  //   await fetchPokeData(id + i);
  // }
  // renderPokemonTile(pokemonData);
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

async function fetchPokeData(id) {
  let url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  let response = await fetch(url);
  let fetchedData = await response.json();
  let pokeID = fetchedData['id'].toString().padStart(4, '0');
  let pokeName = capFirstLetter(fetchedData['species']['name']);
  let pokeHeight = fetchedData['height'] / 10; // in meters
  let pokeWeight = fetchedData['weight'] / 10; // in kilogramm

  let pokeTypes = fetchedData['types'].map((type) =>
    capFirstLetter(type.type.name)
  );
  let pokeAbilities = fetchedData['abilities'].map((ability) =>
    capFirstLetter(ability.ability.name)
  );
  let pokeSprite =
    fetchedData['sprites']['other']['official-artwork']['front_default'];
  let currentPokemon = {
    id: pokeID,
    name: pokeName,
    types: pokeTypes,
    abilities: pokeAbilities,
    sprite: pokeSprite,
  };
  pokemonData.push(currentPokemon);
}

async function fetchPokeDetails() {
  let url = `https://pokeapi.co/api/v2/pokemon-species/4/`;

  let response = await fetch(url);
  let fetchedDetail = await response.json();

  let pokeGenus = fetchedDetail['genera'][7].genus;

  let pokeAbout = fetchedDetail['flavor_text_entries'][0].flavor_text;

  console.log(pokeGenus);
  console.log(pokeAbout);

  let currentPkmnDetais = {};
  pokemonData.push(currentPkmnDetais);
}

function renderPokemonTile(pokemonData) {
  if (pokemonData.length > 24) {
    pokemonData = pokemonData.slice(pokemonData.length - 24);
  }
  for (let i = 0; i < pokemonData.length; i++) {
    const pokemon = pokemonData[i];
    const typeColor = getTypeColor(pokemon.types[0]);
    const typeBadges = pokemon.types
      .map((type) => {
        return `<button class="type">${type}</button>`;
      })
      .join('');

    allPokemons.innerHTML += pokemonTileHTML(pokemon, typeColor, typeBadges);
  }
}

function pokemonTileHTML(pokemon, typeColor, typeBadges) {
  return /*html*/ `
    <div class="pokemon-tile" id="pokemon-tile" style="background: ${typeColor} ">
        <span class="number">#${pokemon.id}</span>
        <div class="pokemon-content">
          <div class="info">
            <h3 class="name">${pokemon.name}</h3>
            ${typeBadges}
          </div>
          <div class="img-container">
            <img src="${pokemon.sprite}" alt="" />
          </div>
        </div>
      </div>
  `;
}

function capFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getTypeColor(type) {
  const typeIndex = typeColors.indexOf(`var(--${type.toLowerCase()})`);
  if (typeIndex !== -1) {
    return typeColors[typeIndex];
  }
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
