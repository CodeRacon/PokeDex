async function fetchPokeData(id) {
  let urlOne = `https://pokeapi.co/api/v2/pokemon/${id}`;

  let respOne = await fetch(urlOne);
  let fetchedData = await respOne.json();
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

  // stats:
  let statHP = fetchedData['stats'][0].base_stat;
  let statAttack = fetchedData['stats'][1].base_stat;
  let statDefense = fetchedData['stats'][2].base_stat;
  let statSpAttack = fetchedData['stats'][3].base_stat;
  let statSpDefense = fetchedData['stats'][4].base_stat;
  let statSpeed = fetchedData['stats'][5].base_stat;

  let bestMoves = fetchedData['moves']
    .map((move) => capTwoWords(move.move.name))
    .slice(0, 15);

  // console.log(fetchedData['moves']);
  // console.log(bestMoves);
  // console.log(pokeName);
  // console.log('HP:' + statHP);
  // console.log('Attack:' + statAttack);
  // console.log('Defense:' + statDefense);
  // console.log('Special-Attack:' + statSpAttack);
  // console.log('Special-Defense:' + statSpDefense);
  // console.log('Speed:' + statSpeed);

  // --------------------------------------------------------------

  let urlTwo = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

  let respTwo = await fetch(urlTwo);
  let fetchedDetail = await respTwo.json();

  let pokeGenus = fetchedDetail['genera'][7].genus;
  let pokeAbout = fetchedDetail['flavor_text_entries'][1].flavor_text;

  const evoChainUrl = fetchedDetail.evolution_chain.url;
  const evoChainResponse = await fetch(evoChainUrl);
  const evoChainData = await evoChainResponse.json();

  const evoChain = [];

  extractNames(evoChainData.chain, evoChain);

  console.log(fetchedDetail['evolution_chain'].url);

  let currentPokemon = {
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
    evolution: evoChain,
  };
  pokemonData.push(currentPokemon);

  console.log(evoChain);
}

function extractNames(chain, evoChain) {
  if (chain && chain.species && chain.species.name) {
    evoChain.push(capFirstLetter(chain.species.name));

    if (chain.evolves_to && chain.evolves_to.length > 0) {
      chain.evolves_to.forEach((evolution) => {
        extractNames(evolution, evoChain); // Hier wurde das zweite Argument hinzugefügt
      });
    }
  }
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
