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
  for (let i = 1; i <= 24; i++) {
    await fetchPokeData(id + i);
    await fetchPokeDetails(id + i);
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

  let currentPokeDetais = {
    species: pokeGenus,
    about: pokeAbout,
  };
  pokemonData.push(currentPokeDetais);
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
        return `<button>${type}</button>`;
      })
      .join('');

    allPokemons.innerHTML += pokemonTileHTML(pokemon, typeColor, typeBadges);
  }

  const tiles = document.querySelectorAll('.pokemon-tile');

  tiles.forEach((tile, index) => {
    tile.addEventListener('click', () => {
      renderPokeCard(index); // Rufe renderPokeCard mit dem Index auf
    });
  });
}

function renderPokeCard(index) {
  console.log(index);
}

// function renderPokemonTile(pokemonData) {
//   if (pokemonData.length > 24) {
//     pokemonData = pokemonData.slice(pokemonData.length - 24);
//   }

//   for (let i = 0; i < pokemonData.length; i++) {
//     const pokemon = pokemonData[i];
//     const typeColor = getTypeColor(pokemon.types[0]);
//     const typeBadges = pokemon.types
//       .map((type) => {
//         return `<button>${type}</button>`;
//       })
//       .join('');

//     allPokemons.innerHTML += pokemonTileHTML(pokemon, typeColor, typeBadges);

//   }
// }

function pokemonTileHTML(pokemon, typeColor, typeBadges) {
  return /*html*/ `
    <div class="pokemon-tile" id="pokemon-tile" style="background: ${typeColor}" onclick="renderPokeCard()">
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

function pokeCardHTML(pokemon, typeColor, typeBadges) {
  return /*html*/ `
  <div class="pokemon-card" id="poke-card" style="background: ${typeColor}" >
        <div class="card-header"></div>
        <div class="card-info">
          <span class="card-name">${pokemon.name}</span>
          <div class="card-number">#${pokemon.id}</div>
        </div>
        <div class="card-type-btn">
          ${typeBadges}
        </div>

        <div class="card-img-container">
          <img src="${pokemon.sprite}" alt="" />
        </div>

        <div class="poke-stats">
          <div class="stat-nav">
            <span>Info</span>
            <span>Stats</span>
            <span>Moves</span>
            <span>Evolution</span>
          </div>

          <div class="info-tab">
            <table class="pokemon-info-tb">
              <tr>
                <td class="detail-label">Species</td>
                <td class="detail-value">Grass Pokemon</td>
              </tr>
              <tr>
                <td class="detail-label">Height</td>
                <td class="detail-value">0.7 m</td>
              </tr>
              <tr>
                <td class="detail-label">Weight</td>
                <td class="detail-value">6.9 kg</td>
              </tr>
              <tr>
                <td class="detail-label">Abilities</td>
                <td class="detail-value">
                  Overgrow <br />
                  Chlorophyll
                </td>
              </tr>
            </table>
            <div class="description">
              Obviously prefers hot places. When it rains, steam is said to
              spout from the tip of its tail.
            </div>
          </div>
          <div class="base d-none"></div>
          <div class="evolution d-none"></div>
          <div class="moves d-none"></div>
          <div class="card-footer">
            <div class="card-btn" id="prev">
              <svg width="32" height="32" viewBox="0 0 24 24">
                <path
                  fill="#667eab"
                  d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c-.006 5.52-4.48 9.994-10 10Zm0-18a8 8 0 1 0 8 8.18v1.783V12a8.009 8.009 0 0 0-8-8Zm0 13l-5-5l5-5l1.41 1.41L10.83 11H17v2h-6.17l2.58 2.59L12 17Z" />
              </svg>
            </div>
            <div class="card-btn" id="close">
              <svg width="32" height="32" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="#667eab"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m9 9l3 3m0 0l3 3m-3-3l-3 3m3-3l3-3m-3 12a9 9 0 1 1 0-18a9 9 0 0 1 0 18" />
              </svg>
            </div>
            <div class="card-btn" id="next">
              <svg width="32" height="32" viewBox="0 0 24 24">
                <path
                  fill="#667eab"
                  d="M12 22c-5.52-.006-9.994-4.48-10-10v-.2C2.11 6.305 6.635 1.928 12.13 2c5.497.074 9.904 4.569 9.868 10.065C21.962 17.562 17.497 22 12 22Zm0-18a8 8 0 1 0 8 8a8.009 8.009 0 0 0-8-8Zm0 13l-1.41-1.41L13.17 13H7v-2h6.17l-2.58-2.59L12 7l5 5l-5 5Z" />
              </svg>
            </div>
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
