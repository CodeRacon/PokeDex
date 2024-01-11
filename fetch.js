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

  let urlTwo = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

  let respTwo = await fetch(urlTwo);
  let fetchedDetail = await respTwo.json();

  let pokeGenus = fetchedDetail['genera'][7].genus;
  let pokeAbout = fetchedDetail['flavor_text_entries'][1].flavor_text;

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
  };
  pokemonData.push(currentPokemon);
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
