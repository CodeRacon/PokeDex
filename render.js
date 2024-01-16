/**
 * takes in {@link pokemonData}, renders a tile for each Pokemon,
 * and assigns an onclick event to each tile
 * - code is checking if .{@link pokemonData}.length is greater than 24
 * - if so:
 *  - slices array to only keep the last 24 elements
 *      ensures that only the most recent 24 Pokemon data
 *      will be used for rendering tiles
 */
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

    allPokemons.innerHTML += pokemonTileHTML(pokemon);
  }
  const tiles = document.querySelectorAll('.pokemon-tile');

  tiles.forEach((tile, index) => {
    tile.setAttribute('onclick', `renderPokeCard(${index})`);
  });
}

/**
 * responsible for rendering a Pokemon card with the given index and
 * displaying its information
 * @param index - index of the individual Pokemon in the {@link pokemonData} array and is
 * used to retrieve the specific Pokemon object from the array
 */
async function renderPokeCard(index) {
  const cardContainer = document.getElementById('card-container');
  console.log(index);
  pokemon = pokemonData[index];

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
    index,
    pokemon,
    typeColor,
    typeBadges,
    abilitiesList,
    likeSymbol
  );

  renderHeart(pokemon);
  renderInfoTab(pokemon, abilitiesList);
  openCardAnimation();

  if (index === 0) {
    const prevBtn = document.getElementById('prev');
    prevBtn.classList.toggle('hidden');
  }
}

function renderHeart(pokemon) {
  const heartSymbol = document.getElementById('heart-symbol');

  if (pokemon.isLiked === 'true') {
    likeSymbol = /*html*/ `
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24">
      <path
        fill="#f5f7fb"
        d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.387 2.25t-1.363 2.412q-.975 1.313-2.625 2.963T13.45 19.7z" />
    </svg>
`;
  } else if (pokemon.isLiked === 'false') {
    likeSymbol = /*html*/ `
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24">
        <path
          fill="#f5f7fb"
          d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.387 2.25t-1.363 2.412q-.975 1.313-2.625 2.963T13.45 19.7zm0-2.7q2.4-2.15 3.95-3.687t2.45-2.675q.9-1.138 1.25-2.026T20 8.15q0-1.5-1-2.5t-2.5-1q-1.175 0-2.175.662T12.95 7h-1.9q-.375-1.025-1.375-1.687T7.5 4.65q-1.5 0-2.5 1t-1 2.5q0 .875.35 1.763t1.25 2.025q.9 1.137 2.45 2.675T12 18.3m0-6.825" />
      </svg>
    `;
  }

  heartSymbol.innerHTML = likeSymbol;
}

/**
 * updates the content of tabContainer with information about a Pokemon
 * and its abilities.
 * @param pokemon - short term for `pokemonData[i]`
 * @param abilitiesList - array of abilities for the given Pokemon
 */
function renderInfoTab(pokemon, abilitiesList) {
  const tabContainer = document.getElementById('tab-container');
  tabContainer.classList.toggle('fade-in');
  tabContainer.innerHTML = infoTabHTML(pokemon, abilitiesList);
  const currentCaller = document.getElementById('info-caller');
  const otherCallers = ['stats-caller', 'moves-caller', 'evo-caller'];
  markActiveTab(currentCaller, otherCallers);
}

/**
 * updates the content of tabContainer with the HTML for the stats tab of a given `pokemon`
 * calls {@link markActiveTab} to indicate current tab
 * @param pokemon - short term for `pokemonData[i]`
 */
function renderStatsTab(pokemon) {
  const tabContainer = document.getElementById('tab-container');
  tabContainer.classList.toggle('fade-in');
  tabContainer.innerHTML = statsTabHTML(pokemon);
  const currentCaller = document.getElementById('stats-caller');
  const otherCallers = ['info-caller', 'moves-caller', 'evo-caller'];
  markActiveTab(currentCaller, otherCallers);
}

/**
 * renders a tab container with a list of moves for a given pokemon
 * calls {@link markActiveTab} to indicate current tab
 * @param pokemon - short term for `pokemonData[i]`
 */
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

/**
 * renders the evolution tab for a given Pokemon,
 * including creating the HTML structure
 * calls {@link markActiveTab} to indicate current tab
 * @param pokemon - short term for `pokemonData[i]`
 * @param typeColor - background color, based on the fetched type-value of the Pokemon (grass, water, etc.)
 */
async function renderEvoTab(pokemon, typeColor) {
  const tabContainer = document.getElementById('tab-container');
  tabContainer.classList.toggle('fade-in');
  tabContainer.innerHTML = evoTabHTML(pokemon);

  const evoContainer = document.getElementById('evo-container');

  for (let i = 0; i < pokemon.evolution.length; i++) {
    // const evoElement = pokemon.evolution[i];
    // const evoId = pokemon.shortStageIDs[i].toString().padStart(4, '0');
    const evoStageContainer = createEvoStageContainer(pokemon, i, typeColor);

    evoContainer.appendChild(evoStageContainer);
  }

  const currentCaller = document.getElementById('evo-caller');
  const otherCallers = ['info-caller', 'moves-caller', 'stats-caller'];
  markActiveTab(currentCaller, otherCallers);
}

/**
 * creates a container element for each evolution stage with the provided evolution data,
 * index, and type color.
 * @param evo - json-object containing information about the evolution chain of a Pokemon
 * @param index - The `index` parameter is used to specify the index of the evolution stage within the
 * `evolution` array. It determines which evolution stage to create the container for.
 * @param typeColor - The `typeColor` parameter is a string representing the color associated with a
 * specific type.
 * @returns the evoStageContainer, which is a div element containing the evolution stage information
 * such as name, ID, and image.
 */
function createEvoStageContainer(evo, index, typeColor) {
  const evoElement = evo.evolution[index];
  const evoId = evo.shortStageIDs[index].toString().padStart(4, '0');

  const evoStageContainer = document.createElement('div');
  evoStageContainer.classList.add('evo-stage');
  typeColor = getTypeColor(evo.types[0]);
  evoStageContainer.style.background = `${typeColor}`;

  const evoName = createEvoHTML('span', 'evo-name', evoElement);
  const evoLongID = createEvoHTML('span', 'evo-id', `#${evoId}`);
  const evoImage = createEvoImage(evo.shortStageIDs[index]);

  evoStageContainer.appendChild(evoName);
  evoStageContainer.appendChild(evoImage);
  evoStageContainer.appendChild(evoLongID);

  return evoStageContainer;
}

/**
 * creates an HTML element with a specified tag, class name, and text content.
 * @param tag - represents the HTML-elemets tag name to be created
 * @param className - is used to specify the class name(s) to be added to the created element
 * @param textContent - text that will be displayed inside the created element
 * @returns a newly created HTML element with the specified tag, class name, and text content.
 */
function createEvoHTML(tag, className, textContent) {
  const element = document.createElement(tag);
  element.classList.add(className);
  element.textContent = textContent;
  return element;
}

/**
 * creates an image element with a source-URL based on the provided `shortStageID`
 * @param shortStageID - unique ID for each specific Pokemon,
 * it's used to generate the URL for the Pokemon's sprite.
 * @returns an HTML image element
 */
function createEvoImage(shortStageID) {
  const evoImage = document.createElement('img');
  evoImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shortStageID}.png`;
  return evoImage;
}

/**
 * used to render the next Pokemon card
 * if the current `index` is the last card,
 * it will call {@link loadMore} and then {@link renderPokeCard} afterwards
 * @param index - index of the individual Pokemon in the {@link pokemonData} array and is
 * used to retrieve the specific Pokemon object from the array
 */
async function nextCard(index) {
  // console.log(index);
  if (index === pokemonData.length - 1) {
    await loadMore();
    renderPokeCard(index + 1);
  } else {
    renderPokeCard(index + 1);
  }
}

/**
 *  calls {@link renderPokeCard} with the `index` decreased by 1
 * @param index - index of the individual Pokemon in the {@link pokemonData} array and is
 * used to retrieve the specific Pokemon object from the array
 */
function prevCard(index) {
  renderPokeCard(index - 1);
}

/**
 * marks the active tab by adding the class "active" to the current caller element and removes it
 * from the other caller elements.
 * @param currentCaller - element that triggered the function call and to be "active"
 * @param otherCallers - array of element IDs representing the other tabs that should be left "inactive"
 */
function markActiveTab(currentCaller, otherCallers) {
  currentCaller.classList.add('active');
  otherCallers.forEach((elementId) => {
    const element = document.getElementById(elementId);
    element.classList.remove('active');
  });
}

/**
 * takes `pokemonName` as input and returns the ID of the
 * corresponding Pokemon from the {@link pokemonData} array.
 * @param pokemonName - string that represents the name of a Pokemon (pokemonData[i].name)
 * @returns ID of the Pokemon with the given `pokemonName`
 */
function getPokemonIdByName(pokemonName) {
  for (let i = 0; i < pokemonData.length; i++) {
    if (pokemonData[i].name === pokemonName) {
      return pokemonData[i].ID;
    }
  }
}
