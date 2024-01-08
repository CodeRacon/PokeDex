const allPokemons = document.getElementById('poke-container');
const typeColors = [
  'var(--fire)',
  'var(--grass)',
  'var(--electric)',
  'var(--water)',
  'var(--ground)',
  'var(--rock)',
  'var(--fairy)',
  'var(--poison)',
  'var(--bug)',
  'var(--dragon)',
  'var(--psychic)',
  'var(--flying)',
  'var(--fighting)',
  'var(--normal)',
];
let id = 2;
let pokemonData = [];

async function init() {
  for (let i = 1; i <= 24; i++) {
    await fetchPokeData(id + i);
  }
  renderPokemonCard(pokemonData);
}

async function fetchPokeData(id) {
  let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  let response = await fetch(url);
  let fetchedPokeData = await response.json();

  let pokeID = fetchedPokeData['id'].toString().padStart(4, '0');

  let pokeName = capFirstLetter(fetchedPokeData['species']['name']);

  let pokeTypes = fetchedPokeData['types'].map((type) =>
    capFirstLetter(type.type.name)
  );

  let pokeAbilities = fetchedPokeData['abilities'].map((ability) =>
    capFirstLetter(ability.ability.name)
  );

  let pokeSprite =
    fetchedPokeData['sprites']['other']['official-artwork']['front_default'];

  let currentPokemon = {
    id: pokeID,
    name: pokeName,
    types: pokeTypes,
    abilities: pokeAbilities,
    sprite: pokeSprite,
  };

  pokemonData.push(currentPokemon);
}

function capFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
function renderPokemonCard(pokemonData) {
  for (let i = 0; i <= pokemonData.length; i++) {
    const pokemon = pokemonData[i];

    const typeBadges = pokemon.types
      .map((type) => {
        return `<button class="type">${type}</button>`;
      })
      .join('');

    allPokemons.innerHTML += /*html*/ `
    <div class="pokemon-tile" id="pokemon-tile">
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
}
