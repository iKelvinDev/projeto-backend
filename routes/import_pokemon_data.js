const fs = require('fs');
const con = require('./dbconnection'); // Importe a conexão com o banco de dados

// Função para inserir um Pokémon no banco de dados
async function inserirPokemon(pokemon) {
  const sql = 'INSERT INTO tabela_pokemon (base_attack, base_defense, base_stamina, form, pokemon_id, pokemon_name) VALUES (?, ?, ?, ?, ?, ?)';

  const values = [
    pokemon.base_attack,
    pokemon.base_defense,
    pokemon.base_stamina,
    pokemon.form,
    pokemon.pokemon_id,
    pokemon.pokemon_name,
  ];

  try {
    await con.query(sql, values);
    console.log(`Pokémon "${pokemon.pokemon_name}" inserido com sucesso!`);
  } catch (error) {
    console.error('Erro ao inserir Pokémon:', error.message);
  }
}

// Ler o arquivo JSON com os dados dos Pokémon
fs.readFile('pokemon_data.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Erro ao ler o arquivo JSON:', err.message);
    return;
  }

  try {
    const pokemons = JSON.parse(data);

    // Iterar sobre os Pokémon e inserir cada um no banco de dados
    pokemons.forEach((pokemon) => {
      inserirPokemon(pokemon);
    });
  } catch (error) {
    console.error('Erro ao processar o arquivo JSON:', error.message);
  }
});
