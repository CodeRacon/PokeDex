//
let baseDataURL;
let detailDataURL;
//
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

async function fetchBaseData(baseDataURL) {
  let response = await fetch(baseDataURL);
  return await response.json();
}

async function fetchDetailData(detailDataURL) {
  let response = await fetch(detailDataURL);
  return await response.json();
}

function createPokemonObject(baseData, detailData) {
  collectBaseData(baseData);
  collectStats(baseData);
  collectDetailData(detailData);
}

function collectBaseData(baseData) {
  return {
    shortID: baseData['id'],
    longID: baseData['id'].toString().padStart(4, '0'),
    capName: capFirstLetter(baseData['species']['name']),
    height: baseData['height'] / 10, // in meters
    weight: baseData['weight'] / 10, // in kilogramm
    sprite: baseData['sprites']['other']['official-artwork']['front_default'],
    types: baseData['types'].map((type) => capFirstLetter(type.type.name)),
    abilities: baseData['abilities'].map((ability) =>
      capFirstLetter(ability.ability.name)
    ),
  };
}

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

function extractStageNames(chain, evoChain) {
  if (chain && chain.species && chain.species.name) {
    evoChain.push(capFirstLetter(chain.species.name));

    if (chain.evolves_to && chain.evolves_to.length > 0) {
      chain.evolves_to.forEach((evolution) => {
        extractStageNames(evolution, evoChain); // Hier wurde das zweite Argument hinzugefügt
      });
    }
  }
}

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

function capFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function capTwoWords(string) {
  // Teile den String in Wörter
  let words = string.split('-');

  // Großbuchstaben für den Anfang jedes Wortes
  let capTwoWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  // Setze die Wörter wieder zusammen
  let result = capTwoWords.join('-');

  return result;
}

function getTypeColor(type) {
  const typeIndex = typeColors.indexOf(`var(--${type.toLowerCase()})`);
  if (typeIndex !== -1) {
    return typeColors[typeIndex];
  }
}
