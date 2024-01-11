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
  openCardAnimation();
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
