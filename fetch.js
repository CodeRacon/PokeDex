//
let baseDataURL;
let detailDataURL;
//
/**
 * fetches base data and detail data for a Pokemon using the PokeAPI,
 * creates a Pokemon object, and adds it to an array
 * @param identifier - used to identify a specific Pokemon, it can be
 * either a number representing the Pokemon's Pokedex ID
 * or a string representing the Pokemon's name
 */
async function fetchAllData(identifier) {
  if (Number.isInteger(identifier)) {
    baseDataURL = `https://pokeapi.co/api/v2/pokemon/${identifier}`;
    detailDataURL = `https://pokeapi.co/api/v2/pokemon-species/${identifier}`;
  } else {
    baseDataURL = `https://pokeapi.co/api/v2/pokemon/${identifier.toLowerCase()}`;
    detailDataURL = `https://pokeapi.co/api/v2/pokemon-species/${identifier.toLowerCase()}`;
  }

  await fetchBaseData(baseDataURL, identifier);
  await fetchDetailData(detailDataURL, identifier);

  let baseData = await fetchBaseData(baseDataURL);
  let detailData = await fetchDetailData(detailDataURL);

  let currentPokemon = createPokemonObject(
    collectBaseData(baseData),
    collectStats(baseData),
    await collectDetailData(detailData)
  );

  pokemonData.push(currentPokemon);
}

/**
 * fetches data from a specified URL and returns it as a JSON object
 * @param baseDataURL - string that represents the URL of the base data to fetch
 * @returns a promise that resolves to the JSON data fetched from the specified URL
 */
async function fetchBaseData(baseDataURL) {
  let response = await fetch(baseDataURL);
  return await response.json();
}

/**
 * fetches data from a specified URL and returns it as a JSON object
 * @param detailDataURL - string that represents the URL of the API endpoint from which to fetch the detail data
 * @returns a promise that resolves to the JSON data fetched from the detailDataURL
 */
async function fetchDetailData(detailDataURL) {
  let response = await fetch(detailDataURL);
  return await response.json();
}

/**
 * creates a Pokemon object by collecting base data + stats, and detail data
 * @param baseData - object that contains basic information about a Pokemon, such as name, type, and abilities
 * @param detailData - object that contains additional information, such as evolutution-chain data
 */
function createPokemonObject(baseData, detailData) {
  collectBaseData(baseData);
  collectStats(baseData);
  collectDetailData(detailData);
}

/**
 * collects and transforms base data of a Pokemon into a more readable format
 * @param baseData - object that contains basic information about a Pokmon
 * @returns an object with the basic-data keys and their content
 */
function collectBaseData(baseData) {
  return {
    shortID: baseData['id'],
    longID: baseData['id'].toString().padStart(4, '0'),
    capName: capFirstLetter(baseData['species']['name']),
    height: baseData['height'] / 10,
    weight: baseData['weight'] / 10,
    sprite: baseData['sprites']['other']['official-artwork']['front_default'],
    types: baseData['types'].map((type) => capFirstLetter(type.type.name)),
    abilities: baseData['abilities'].map((ability) =>
      capFirstLetter(ability.ability.name)
    ),
  };
}

/**
 * takes in a baseData object and returns an object containing various stats and the 15 best moves
 * @param baseData - an object that contains information about a Pokemon
 * @returns an object that contains the all the stat-keys and there particular content
 */
function collectStats(baseData) {
  const statHP = baseData['stats'][0].base_stat;
  const statAttack = baseData['stats'][1].base_stat;
  const statDefense = baseData['stats'][2].base_stat;
  const statSpAttack = baseData['stats'][3].base_stat;
  const statSpDefense = baseData['stats'][4].base_stat;
  const statSpeed = baseData['stats'][5].base_stat;
  const statTotal =
    statHP +
    statAttack +
    statDefense +
    statSpAttack +
    statSpDefense +
    statSpeed;
  const bestMoves = baseData['moves']
    .map((move) => capTwoWords(move.move.name))
    .slice(0, 15);

  return {
    statHP,
    statAttack,
    statDefense,
    statSpAttack,
    statSpDefense,
    statSpeed,
    statTotal,
    bestMoves,
  };
}

/**
 * collects various details from a given data object, including genus, flavor text, evolution chain
 * @param detailData - an object that contains detailed information about the Pokemon
 * @returns an object with the special keys to the detail data
 */
async function collectDetailData(detailData) {
  let genus = detailData['genera'][7].genus;
  let about = detailData['flavor_text_entries'][1].flavor_text;

  const evoChainUrl = detailData.evolution_chain.url;
  const evoChainResponse = await fetch(evoChainUrl);
  const evoChainData = await evoChainResponse.json();
  const evoChain = [];

  extractStageNames(evoChainData.chain, evoChain);

  const shortStageIDs = await getChainIDs(evoChain);

  return {
    genus,
    about,
    evolution: evoChain,
    shortStageIDs,
  };
}

/**
 * creates a Pokemon object using collected data
 * @param collectedBaseData - object containing the collected  * base data of a Pokemon
 * @param collectedStats - object that contains the collected statistic values
 * @param collectedDetailData - object containing collected detail-data about the Pokemon
 * @returns an object with 'ALL' collected properties related to a Pokemon
 */
function createPokemonObject(
  collectedBaseData,
  collectedStats,
  collectedDetailData
) {
  return {
    id: collectedBaseData.shortID,
    ID: collectedBaseData.longID,
    name: collectedBaseData.capName,
    types: collectedBaseData.types,
    abilities: collectedBaseData.abilities,
    sprite: collectedBaseData.sprite,
    species: collectedDetailData.genus,
    about: collectedDetailData.about,
    height: collectedBaseData.height,
    weight: collectedBaseData.weight,
    hp: collectedStats.statHP,
    attack: collectedStats.statAttack,
    defense: collectedStats.statDefense,
    sp_attack: collectedStats.statSpAttack,
    sp_defense: collectedStats.statSpDefense,
    speed: collectedStats.statSpeed,
    total: collectedStats.statTotal,
    moves: collectedStats.bestMoves,
    evolution: collectedDetailData.evolution,
    shortStageIDs: collectedDetailData.shortStageIDs,
    isLiked: 'false',
  };
}

/**
 * extracts the names of each evolution stage-pokemon and adds them to an array
 * @param chain - object that represents the evolution chain of a Pokmon.
 * @param evoChain - array that stores the names of the different stages in a Pokemon evolution chain.
 */
function extractStageNames(chain, evoChain) {
  if (chain && chain.species && chain.species.name) {
    evoChain.push(capFirstLetter(chain.species.name));

    if (chain.evolves_to && chain.evolves_to.length > 0) {
      chain.evolves_to.forEach((evolution) => {
        extractStageNames(evolution, evoChain);
      });
    }
  }
}

/**
 * retrieves the IDs of Pokemon in an evolution chain using the PokeAPI
 * @param evoChain - array of strings representing the names of Pokemon in an evolution chain
 * @returns an array of shortened stage IDs
 */
async function getChainIDs(evoChain) {
  const shortStageIDs = [];

  for (const evoElement of evoChain) {
    const url = `https://pokeapi.co/api/v2/pokemon/${evoElement.toLowerCase()}`;
    const resp = await fetch(url);
    const fetchedData = await resp.json();
    const id = fetchedData['id'];
    shortStageIDs.push(id);
  }

  return shortStageIDs;
}

/**
 * takes a word as input and returns the word with the first letter capitalized
 * @param word - string that represents a word
 * @returns the word with the first letter capitalized
 */
function capFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * takes a [-] -separated string and capitalizes the first letter of each word
 * @param string - [-] -separated stringseparated string of two words
 * @returns a string where each word is capitalized
 */
function capTwoWords(string) {
  let words = string.split('-');

  let capTwoWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  let result = capTwoWords.join('-');

  return result;
}

/**
 * returns the color associated with a given type, based on the `typeColors` array
 * @param type - The `type` parameter is a string representing a type of color
 * @returns the color associated with the given type (fire, water, grass...)
 */
function getTypeColor(type) {
  const typeIndex = typeColors.indexOf(`var(--${type.toLowerCase()})`);
  if (typeIndex !== -1) {
    return typeColors[typeIndex];
  }
}
