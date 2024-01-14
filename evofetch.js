async function fetchEvoData(identifier) {
  let urlOne;
  let urlTwo;

  if (Number.isInteger(identifier)) {
    // Wenn identifier eine Zahl ist, verwenden Sie es als id
    urlOne = `https://pokeapi.co/api/v2/pokemon/${identifier}`;
    urlTwo = `https://pokeapi.co/api/v2/pokemon-species/${identifier}`;
  } else {
    // Andernfalls nehmen Sie es als Namen
    urlOne = `https://pokeapi.co/api/v2/pokemon/${identifier.toLowerCase()}`;
    urlTwo = `https://pokeapi.co/api/v2/pokemon-species/${identifier.toLowerCase()}`;
  }
  let respOne = await fetch(urlOne);
  let fetchedEvoData = await respOne.json();
  let ID = fetchedEvoData['id'];
  let pokeID = fetchedEvoData['id'].toString().padStart(4, '0');
  let pokeName = capFirstLetter(fetchedEvoData['species']['name']);
  let pokeHeight = fetchedEvoData['height'] / 10; // in meters
  let pokeWeight = fetchedEvoData['weight'] / 10; // in kilogramm
  let pokeTypes = fetchedEvoData['types'].map((type) =>
    capFirstLetter(type.type.name)
  );
  let pokeAbilities = fetchedEvoData['abilities'].map((ability) =>
    capFirstLetter(ability.ability.name)
  );
  let pokeSprite =
    fetchedEvoData['sprites']['other']['official-artwork']['front_default'];

  // stats:
  let statHP = fetchedEvoData['stats'][0].base_stat;
  let statAttack = fetchedEvoData['stats'][1].base_stat;
  let statDefense = fetchedEvoData['stats'][2].base_stat;
  let statSpAttack = fetchedEvoData['stats'][3].base_stat;
  let statSpDefense = fetchedEvoData['stats'][4].base_stat;
  let statSpeed = fetchedEvoData['stats'][5].base_stat;
  let statTotal =
    statHP +
    statAttack +
    statDefense +
    statSpAttack +
    statSpDefense +
    statSpeed;

  let bestMoves = fetchedEvoData['moves']
    .map((move) => capTwoWords(move.move.name))
    .slice(0, 15);

  // --------------------------------------------------------------

  // let urlTwo = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

  let respTwo = await fetch(urlTwo);
  let fetchedEvoDetail = await respTwo.json();

  let pokeGenus = fetchedEvoDetail['genera'][7].genus;
  let pokeAbout = fetchedEvoDetail['flavor_text_entries'][1].flavor_text;

  const evoChainUrl = fetchedEvoDetail.evolution_chain.url;
  const evoChainResponse = await fetch(evoChainUrl);
  const evoChainData = await evoChainResponse.json();

  const evoChain = [];

  extractEvoNames(evoChainData.chain, evoChain);

  const simpleIDs = await getChainIDs(evoChain);

  // console.log(fetchedEvoDetail['evolution_chain'].url);

  let currentPokemon = {
    ID: ID,
    id: pokeID,
    name: pokeName,
    types: pokeTypes,
    abilities: pokeAbilities,
    sprite: pokeSprite,
    species: pokeGenus,
    about: pokeAbout,
    height: pokeHeight,
    weight: pokeWeight,
    // stats:
    hp: statHP,
    attack: statAttack,
    defense: statDefense,
    sp_attack: statSpAttack,
    sp_defense: statSpDefense,
    speed: statSpeed,
    total: statTotal,
    moves: bestMoves,
    evolution: evoChain,
    simpleIDs: simpleIDs,
  };

  evoData.length = 0;
  evoData.push(currentPokemon);
  console.log(evoData);
}

function extractEvoNames(chain, evoChain) {
  if (chain && chain.species && chain.species.name) {
    evoChain.push(capFirstLetter(chain.species.name));

    if (chain.evolves_to && chain.evolves_to.length > 0) {
      chain.evolves_to.forEach((evolution) => {
        extractEvoNames(evolution, evoChain); // Hier wurde das zweite Argument hinzugefügt
      });
    }
  }
}

async function getChainIDs(evoChain) {
  const chainIDs = [];
  const simpleIDs = [];

  for (const evoElement of evoChain) {
    const url = `https://pokeapi.co/api/v2/pokemon/${evoElement.toLowerCase()}`;
    const resp = await fetch(url);
    const fetchedData = await resp.json();
    const id = fetchedData['id'];
    simpleIDs.push(id);
  }

  return simpleIDs;
}
