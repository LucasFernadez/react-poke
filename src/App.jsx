import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect para buscar Pokémon cada vez que se escribe
  useEffect(() => {
    if (searchTerm === '') {
      setPokemonData(null);
      setError(null);
      return;
    }

    const fetchPokemon = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
        if (!res.ok) {
          throw new Error('Pokémon no encontrado');
        }
        const data = await res.json();
        setPokemonData(data);
      } catch (err) {
        setPokemonData(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchPokemon, 500); // debounce simple
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="App">
      <h1>Buscador de Pokémon</h1>
      <input
        type="text"
        placeholder="Busca un Pokémon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {pokemonData && (
        <div className="pokemon-card">
          <h2>{pokemonData.name.toUpperCase()}</h2>
          <img
            src={pokemonData.sprites.front_default}
            alt={pokemonData.name}
          />
          <p><strong>Altura:</strong> {pokemonData.height}</p>
          <p><strong>Peso:</strong> {pokemonData.weight}</p>
        </div>
      )}
    </div>
  );
}

export default App;
