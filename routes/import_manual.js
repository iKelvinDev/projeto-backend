// import_manual.js
const fs = require('fs');
const axios = require('axios');

const apiUrl = 'https://pokemon-go1.p.rapidapi.com/pokemon_stats.json?rapidapi-key=19d7f85771msh205b0954ee20b54p1610dcjsna360290140be'; // Substitua pelo URL da API de Pokémon

async function fetchPokemonData() {
  try {
    const response = await axios.get(apiUrl);
    const pokemonData = response.data;

    fs.writeFile('pokemon_data.json', JSON.stringify(pokemonData), (err) => {
      if (err) throw err;
      console.log('Dados dos Pokémon foram baixados e salvos no arquivo pokemon_data.json');
    });
  } catch (error) {
    console.error('Erro ao obter dados dos Pokémon:', error.message);
  }
}

fetchPokemonData();