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
  indicateCaler(currentCaller, otherCallers);
}

function renderStatsTab(pokemon) {
  const tabContainer = document.getElementById('tab-container');
  tabContainer.classList.toggle('fade-in');
  tabContainer.innerHTML = statsTabHTML(pokemon);
  const currentCaller = document.getElementById('stats-caller');
  const otherCallers = ['info-caller', 'moves-caller', 'evo-caller'];
  indicateCaler(currentCaller, otherCallers);
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
    indicateCaler(currentCaller, otherCallers);
  }
}

function renderEvoTab(pokemon) {
  const tabContainer = document.getElementById('tab-container');
  tabContainer.classList.toggle('fade-in');
  tabContainer.innerHTML = evoTabHTML(pokemon);
  const currentCaller = document.getElementById('evo-caller');
  const otherCallers = ['info-caller', 'moves-caller', 'stats-caller'];
  indicateCaler(currentCaller, otherCallers);
}

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

// function openTab(sectionID) {
//   const caller = document.querySelectorAll('.caller');
//   const allSections = [
//     'info-section',
//     'stats-section',
//     'moves-section',
//     'evo-section',
//   ];

//   allSections.forEach((section) => {
//     const currentSection = document.getElementById(section);

//     if (currentSection) {
//       if (section === sectionID) {
//         currentSection.classList.remove('d-none');
//       } else {
//         currentSection.classList.add('d-none');
//       }
//     }
//   });
// }

function indicateCaler(currentCaller, otherCallers) {
  currentCaller.classList.add('active');
  otherCallers.forEach((elementId) => {
    const element = document.getElementById(elementId);
    element.classList.remove('active');
  });
}
