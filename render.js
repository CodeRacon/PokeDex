function renderPokemonTile(pokemonData) {
  if (pokemonData.length > 24) {
    pokemonData = pokemonData.slice(pokemonData.length - 24);
  }

  for (let i = 0; i < pokemonData.length; i++) {
    pokemon = pokemonData[i];
    typeColor = getTypeColor(pokemon.types[0]);
    typeBadges = pokemon.types
      .map((type) => {
        return `<button>${type}</button>`;
      })
      .join('');

    allPokemons.innerHTML += pokemonTileHTML();
  }

  const tiles = document.querySelectorAll('.pokemon-tile');

  tiles.forEach((tile, index) => {
    tile.setAttribute('onclick', `renderPokeCard(${index})`);
  });
}

function renderPokeCard(index) {
  const cardContainer = document.getElementById('card-container');

  console.log(index);
  let j = index;
  pokemon = pokemonData[j];
  typeBadges = pokemon.types
    .map((type) => {
      return `<button>${type}</button>`;
    })
    .join('');
  let abilitiesList = pokemon.abilities
    .map((ability) => {
      return `${ability}`;
    })
    .join(', ');
  typeColor = getTypeColor(pokemon.types[0]);
  cardContainer.innerHTML = pokeCardHTML(
    j,
    pokemon,
    typeColor,
    typeBadges,
    abilitiesList
  );
  renderInfoTab(pokemon, abilitiesList);

  openCardAnimation();
}

function renderInfoTab(pokemon, abilitiesList) {
  const tabContainer = document.getElementById('tab-container');
  tabContainer.classList.toggle('fade-in');
  tabContainer.innerHTML = infoTabHTML(pokemon, abilitiesList);
  const currentCaller = document.getElementById('info-caller');
  const otherCallers = ['stats-caller', 'moves-caller', 'evo-caller'];
  markActiveTab(currentCaller, otherCallers);
}

function renderStatsTab(pokemon) {
  const tabContainer = document.getElementById('tab-container');
  tabContainer.classList.toggle('fade-in');
  tabContainer.innerHTML = statsTabHTML(pokemon);
  const currentCaller = document.getElementById('stats-caller');
  const otherCallers = ['info-caller', 'moves-caller', 'evo-caller'];
  markActiveTab(currentCaller, otherCallers);
}

function renderMovesTab(pokemon) {
  const tabContainer = document.getElementById('tab-container');
  tabContainer.classList.toggle('fade-in');

  tabContainer.innerHTML = /*html*/ `
    <div class="moves-container" id="moves-container">
      <span>The 15 best Moves of ${pokemon.name}</span>
    </div>  
`;
  for (let i = 0; i < pokemon.moves.length; i++) {
    const moveName = pokemon.moves[i];

    const moveBtn = document.createElement('button');
    moveBtn.textContent = moveName;

    const movesContainer = document.getElementById('moves-container');
    movesContainer.appendChild(moveBtn);

    const currentCaller = document.getElementById('moves-caller');
    const otherCallers = ['stats-caller', 'info-caller', 'evo-caller'];
    markActiveTab(currentCaller, otherCallers);
  }
}

async function renderEvoTab(pokemon, typeColor) {
  await fetchEvoData(pokemon.name);
  const evo = evoData[0];

  const tabContainer = document.getElementById('tab-container');
  tabContainer.classList.toggle('fade-in');

  tabContainer.innerHTML = evoTabHTML(evo);

  const evoContainer = document.getElementById('evo-container');

  for (let i = 0; i < evo.evolution.length; i++) {
    const evoElement = evo.evolution[i];
    const evoId = evo.simpleIDs[i].toString().padStart(4, '0');

    const evoStageContainer = document.createElement('div');
    evoStageContainer.classList.add('evo-stage');
    typeColor = getTypeColor(pokemon.types[0]);
    evoStageContainer.style.background = `${typeColor}`;
    // evoStageContainer.setAttribute(
    //   'onclick',
    //   `renderPokeCard(${evo.simpleIDs[i]})`
    // );

    const evoName = document.createElement('span');
    evoName.classList.add('evo-name');
    evoName.textContent = evoElement;

    const evoLongID = document.createElement('span');
    evoLongID.classList.add('evo-id');
    evoLongID.textContent = `#${evoId}`;

    const evoImage = document.createElement('img');
    evoImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.simpleIDs[i]}.png`;

    evoStageContainer.appendChild(evoName);
    evoStageContainer.appendChild(evoImage);
    evoStageContainer.appendChild(evoLongID);

    // Füge evoStageContainer zur gewünschten HTML-Element ein (z.B. ein Container mit der ID 'evo-container')
    evoContainer.appendChild(evoStageContainer);

    console.log(evoId);
  }

  const currentCaller = document.getElementById('evo-caller');
  const otherCallers = ['info-caller', 'moves-caller', 'stats-caller'];
  markActiveTab(currentCaller, otherCallers);
}

// evo-pokemon, die vie evotab neu ins array kamen, muessen wieder aus dem pokemonData-array raus!!!
// evtl. doch separate funktion zum fetch von evo-Pokemon hmmmmm!!!
async function nextCard(index) {
  // console.log(index);
  if (index === pokemonData.length - 1) {
    await loadMore();
    renderPokeCard(index + 1);
  } else {
    renderPokeCard(index + 1);
  }
}

function prevCard(index) {
  console.log(index);
  renderPokeCard(index - 1);
}

function markActiveTab(currentCaller, otherCallers) {
  currentCaller.classList.add('active');
  otherCallers.forEach((elementId) => {
    const element = document.getElementById(elementId);
    element.classList.remove('active');
  });
}

function getPokemonIdByName(pokemonName) {
  for (let i = 0; i < pokemonData.length; i++) {
    if (pokemonData[i].name === pokemonName) {
      return pokemonData[i].ID;
    }
  }
  console.log(pokemonName);
}
