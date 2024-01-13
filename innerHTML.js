function pokemonTileHTML() {
  return /*html*/ `
      <div class="pokemon-tile" id="pokemon-tile"  style="background: ${typeColor}">
        <span class="number">#${pokemon.id}</span>
        <div class="pokemon-content">
          <div class="info">
            <h3 class="name">${pokemon.name}</h3>
            ${typeBadges}
          </div>
          <div class="img-container">
            <img src="${pokemon.sprite}" alt="" />
          </div>
        </div>
      </div>
  `;
}

function pokeCardHTML(index, pokemon, typeColor, typeBadges) {
  return /*html*/ `
  <div class="overlay d-none" id="overlay" onclick="closeCardAnimation()"></div>
    <div class="pokemon-card d-none" id="poke-card" style="background: ${typeColor}" >
        <div class="card-header"></div>
        <div class="card-info">
          <span class="card-name">${pokemon.name}</span>
          <div class="card-number">#${pokemon.id}</div>
        </div>
        <div class="card-type-btn">
          ${typeBadges}
        </div>

        <div class="card-img-container">
          <img src="${pokemon.sprite}" alt="" />
        </div>

        <div class="poke-stats">
          <div class="stat-nav">
            <span>Info</span>
            <span>Stats</span>
            <span>Moves</span>
            <span>Evolution</span>
          </div>
          <div class="tab-container" id="tab-container">

            <!-- content dynamically generated by js! -->
            
          </div>      
          <div class="card-footer">
            <div class="card-btn" id="prev" onclick="prevCard(${index})" >
              <svg width="32" height="32" viewBox="0 0 24 24">
                <path
                  fill="#667eab"
                  d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c-.006 5.52-4.48 9.994-10 10Zm0-18a8 8 0 1 0 8 8.18v1.783V12a8.009 8.009 0 0 0-8-8Zm0 13l-5-5l5-5l1.41 1.41L10.83 11H17v2h-6.17l2.58 2.59L12 17Z" />
              </svg>
            </div>
            <div class="card-btn" id="close" onclick="closeCardAnimation()">
              <svg width="32" height="32" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="#667eab"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m9 9l3 3m0 0l3 3m-3-3l-3 3m3-3l3-3m-3 12a9 9 0 1 1 0-18a9 9 0 0 1 0 18" />
              </svg>
            </div>
            <div class="card-btn" id="next" onclick="nextCard(${index})" >
              <svg width="32" height="32" viewBox="0 0 24 24">
                <path
                  fill="#667eab"
                  d="M12 22c-5.52-.006-9.994-4.48-10-10v-.2C2.11 6.305 6.635 1.928 12.13 2c5.497.074 9.904 4.569 9.868 10.065C21.962 17.562 17.497 22 12 22Zm0-18a8 8 0 1 0 8 8a8.009 8.009 0 0 0-8-8Zm0 13l-1.41-1.41L13.17 13H7v-2h6.17l-2.58-2.59L12 7l5 5l-5 5Z" />
              </svg>
            </div>
          </div>
        </div>
        
      </div>
`;
}

function infoTabHTML(pokemon, abilitiesList) {
  return /*html*/ `
    <div class="info-tab">
      <table class="pokemon-info-tb">
        <tr>
          <td class="detail-label">Species</td>
          <td class="detail-value">${pokemon.species}</td>
        </tr>
        <tr>
          <td class="detail-label">Height</td>
          <td class="detail-value">${pokemon.height} m</td>
        </tr>
        <tr>
          <td class="detail-label">Weight</td>
          <td class="detail-value">${pokemon.weight} kg</td>
        </tr>
        <tr>
          <td class="detail-label">Abilities</td>
          <td class="detail-value">${abilitiesList}</td>
        </tr>
      </table>
      <div class="description">${pokemon.about}</div>
    </div>
  `;
}

function statsTabHTML(pokemon) {
  return /*html*/ `
    <div class="stats-tab">
      <div class="stat-line">
        <label for="hp">HP</label>
        <span class="stat-value">${pokemon.hp}</span>
        <progress id="hp" max="100" value="${pokemon.hp}"></progress>
      </div>

      <div class="stat-line">
        <label for="attack">Attack</label>
        <span class="stat-value">${pokemon.attack}</span>
        <progress id="attack" max="100" value="${pokemon.attack}"></progress>
      </div>

      <div class="stat-line">
        <label for="attack">Special Att.</label>
        <span class="stat-value">${pokemon.sp_attack}</span>
        <progress id="attack" max="100" value="${pokemon.sp_attack}"></progress>
      </div>

      <div class="stat-line">
        <label for="defense">Defense</label>
        <span class="stat-value">${pokemon.defense}</span>
        <progress id="defense" max="100" value="${pokemon.defense}"></progress>
      </div>

      <div class="stat-line">
        <label for="defense">Special Def.</label>
        <span class="stat-value">${pokemon.sp_defense}</span>
        <progress id="defense" max="100" value="${pokemon.sp_defense}"></progress>
      </div>

      <div class="stat-line">
        <label for="defense">Speed</label>
        <span class="stat-value">${pokemon.speed}</span>
        <progress id="defense" max="100" value="${pokemon.speed}"></progress>
      </div>
    </div>
  `;
}

function movesTabHTML() {
  return /*html*/ `
    
  `;
}

function evoTabHTML() {
  return /*html*/ `
    
  `;
}
