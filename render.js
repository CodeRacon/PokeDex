/**
 * takes in {@link pokemonData}, renders a tile for each Pokemon,
 * and assigns an onclick event to each tile
 * code is checking if pokemonData.length is greater than 24
 * if so:
 * slices array to only keep the last 24 elements
 * ensures that only the most recent 24 Pokemon data
 * will be used for rendering tiles
 * assigns click handlers to each tile
 */
async function renderPokemonTile(pokemonData) {
  if (pokemonData.length > 24) {
    pokemonData = pokemonData.slice(pokemonData.length - 24);
  }

  for (let i = 0; i < pokemonData.length; i++) {
    pokemon = pokemonData[i];
    typeColor = getTypeColor(pokemon.types[0]);
    typeBadges = getTypeBadges(pokemon);

    allPokemons.innerHTML += pokemonTileHTML(pokemon, typeBadges, typeColor);
  }
  addOnClicks();
}

/**
 * Returns HTML string of badge buttons for the Pokemon's types
 *
 * @param {Object} pokemon - Pokemon object
 * @returns {string} HTML string of badge buttons
 */
function getTypeBadges(pokemon) {
  return pokemon.types.map((type) => `<button>${type}</button>`).join('');
}

/**
 * Returns a comma-separated string of the Pokemon's abilities
 *
 * @param {Object} pokemon - The Pokemon object
 * @returns {string} The comma-separated string of abilities
 */
function getAbilitiesList(pokemon) {
  return pokemon.abilities.map((ability) => `${ability}`).join(', ');
}

/**
 * Renders a Pokemon card with information for the Pokemon at the given index
 * Gets the Pokemon data, abilities list, type badges, and type color
 * Updates the card container innerHTML with the rendered card
 * Renders the heart symbol and info tab for the Pokemon
 * Shows the open card animation
 * Hides the previous button if on the first Pokemon
 * @param {number} index - The index of the Pokemon in the data array
 */
async function renderPokeCard(index) {
  const cardContainer = document.getElementById('card');
  pokemon = pokemonData[index];
  let targetID = pokemonData[index].id;
  const abilitiesList = getAbilitiesList(pokemon);
  typeBadges = getTypeBadges(pokemon);
  typeColor = getTypeColor(pokemon.types[0]);
  cardContainer.innerHTML = pokeCardHTML(index, pokemon, typeColor, typeBadges);
  renderHeart(pokemon, targetID);
  renderInfoTab(pokemon, abilitiesList);
  openCardAnimation();

  if (index === 0) {
    const prevBtn = document.getElementById('prev');
    prevBtn.classList.toggle('hidden');
  }
}

/**
 * Renders a heart symbol on the card and tile for the given Pokemon
 * based on its `isLiked` property.
 *
 * Checks if `isLiked` is 'true' or 'false' and sets the `likeSymbol`
 * variable to the appropriate SVG.
 *
 * Updates the `innerHTML` of the card and tile elements with IDs
 * containing the Pokemon's ID to display the likeSymbol.
 *
 * @param {Object} pokemon - The Pokemon object
 * @param {number} targetID - The ID of the Pokemon
 */
function renderHeart(pokemon, targetID) {
  let targetCard, targetTile;
  targetCard = document.getElementById(`heart-symbol-card-${targetID}`);
  targetTile = document.getElementById(`heart-symbol-tile-${targetID}`);

  if (pokemon.isLiked === 'true') {
    likeSymbol = likedSVG;
  } else if (pokemon.isLiked === 'false') {
    likeSymbol = unlikedSVG;
  }
  if (targetCard) {
    targetCard.innerHTML = likeSymbol;
  }
  if (targetTile) {
    targetTile.innerHTML = likeSymbol;
  }
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

  for (let i = 0; i < pokemon.evolution.length; i++) {
    const evoContainer = document.getElementById('evo-container');
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
 * @param pokemon - short term for 'pokemonData[index]'
 * @param index - The `index` parameter is used to specify the index of the evolution stage within the
 * `evolution` array. It determines which evolution stage to create the container for.
 * @param typeColor - The `typeColor` parameter is a string representing the color associated with a
 * specific type.
 * @returns the evoStageContainer, which is a div element containing the evolution stage information
 * such as name, ID, and image.
 */
function createEvoStageContainer(pokemon, index, typeColor) {
  const evoElement = pokemon.evolution[index];
  const evoId = pokemon.shortStageIDs[index].toString().padStart(4, '0');

  const evoStageContainer = document.createElement('div');
  evoStageContainer.classList.add('evo-stage');
  typeColor = getTypeColor(pokemon.types[0]);
  evoStageContainer.style.background = `${typeColor}`;

  const evoName = createEvoHTML('span', 'evo-name', evoElement);
  const evoLongID = createEvoHTML('span', 'evo-id', `#${evoId}`);
  const evoImage = createEvoImage(pokemon.shortStageIDs[index]);

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
  if (index === pokemonData.length - 1) {
    await loadMore();
    renderPokeCard(index + 1);
  } else {
    renderPokeCard(index + 1);
  }
}

/**
 * calls {@link renderPokeCard} with the `index` decreased by 1
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

/**
 * adds click event listeners to each pokemon tile and renders a heart icon
 * based on the pokemon's liked status
 */
function addOnClicks() {
  const tiles = document.querySelectorAll('.pokemon-tile');

  tiles.forEach((tile, index) => {
    const pokemon = pokemonData[index];

    tile.dataset.liked = pokemon.isLiked;
    let targetID = pokemonData[index].id;

    renderHeart(pokemon, targetID);
  });
}
