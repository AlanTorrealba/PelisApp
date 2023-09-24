import "./App.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { Movies } from "./components/Movies.jsx";
import { useMovies } from "./hooks/useMovies";
import debounce from "just-debounce-it";

function useSearch() {
  const [search, updateSearch] = useState("");
  const [error, setError] = useState(null);
  const isFirstInput = useRef(true);

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === "";
      return;
    }

    if (search.match(/^\d+$/)) {
      setError("no se puede buscar una pelicula con solo numero");
      return;
    }
    if (search === "") {
      setError("no se puede buscar una pelicula vacia");
      return;
    }
    if (search.length < 3) {
      setError("La busqueda debe tener almenos 3 caracteres");
      return;
    }

    setError(null);
  }, [search]);

  return { search, updateSearch, error };
}

function App() {
  // const { movies } = useMovies();
  const [sort, setSort] = useState(false);
  const { search, updateSearch, error } = useSearch();
  const { movies, loading, getMovies } = useMovies({ search, sort });

  const debouncedGetMovies = useCallback(
    debounce((search) => {
      console.log("search");
      getMovies({ search });
    }, 500),
    [getMovies]
  );

  const handleSort = () => {
    setSort(!sort);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    getMovies({ search });
  };
  const handleChange = (event) => {
    const newSearch = event.target.value;
    updateSearch(newSearch);
    debouncedGetMovies(newSearch);
  };

  return (
    <div className="page">
      <h1>Buscador de peliculas</h1>
      <div>
        <form className="form" onSubmit={handleSubmit} action="">
          <input
            onChange={handleChange}
            value={search}
            name="search"
            type="text"
            placeholder="Buscar"
          />
          <button type="submit">Buscar</button>
          <input
            type="checkbox"
            name="Sort"
            onChange={handleSort}
            checked={sort}
          />
        </form>
        {error && (
          <p style={{ color: "red" }} className="error">
            {error}
          </p>
        )}
        <main>
          {loading ? <p> Cargando...</p> : <Movies movies={movies} />}
        </main>
      </div>
    </div>
  );
}

export default App;
