import { useState } from 'react';
import Filters from './components/Filters.jsx';
import MovieCard from './components/MovieCard.jsx';
import MovieDetails from './components/MovieDetails.jsx';

const API_KEY = "7b1c4817"; 

export default function App() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState(0);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (search.trim().length < 1) {
      setError("Please enter a movie title to search.");
      setMovies([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setMovies([]); 
    setSelectedMovie(null); 

    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(search)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.Response === "True" && data.Search) {
        
        const detailsPromises = data.Search.map(m =>
          fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${m.imdbID}`)
            .then(res => {
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              return res.json();
            })
            .then(detailData => {
              if (detailData.Response === "False") throw new Error(detailData.Error);
              return detailData;
            })
        );
        const movieDetails = await Promise.all(detailsPromises);
        setMovies(movieDetails);
      } else {
        setMovies([]);
        setError(data.Error || "No movies found for your search.");
      }
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      setError(`Search failed: ${err.message}. Please check your API key or try again.`);
    } finally {
      setIsLoading(false);
    }
  };


  const filteredMovies = movies.filter(m => {
    const matchYear = year ? m.Year === String(year) : true;
   
    const movieRating = parseFloat(m.imdbRating);
    const matchRating = !isNaN(movieRating) && movieRating >= rating;
    return matchYear && matchRating;
  });

  return (
    <div className="app">
      <h1 className="app-title">
        🎬 Movie Search App
      </h1>

      {selectedMovie ? (
        
        <MovieDetails imdbID={selectedMovie} onBack={() => setSelectedMovie(null)} />
      ) : (
    
        <>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search movies by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="search-input"
            />
            <button
              onClick={handleSearch}
              className="search-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="search-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <span>Search</span>
            </button>
          </div>

          <Filters year={year} setYear={setYear} rating={rating} setRating={setRating} />

          {isLoading && (
            <div className="message-box loading-message">
              <p>Fetching movies...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="message-box error-message">
              <p className="message-title">Oops! Something went wrong.</p>
              <p>{error}</p>
              <p className="message-subtitle">Please try a different search or check your internet connection.</p>
            </div>
          )}

          {!isLoading && !error && filteredMovies.length === 0 && search.trim().length > 0 && (
            <div className="message-box warning-message">
              <p className="message-title">No results found.</p>
              <p>Try searching for a different movie title or adjust your filters.</p>
            </div>
          )}

          {!isLoading && !error && filteredMovies.length > 0 && (
            <div className="movie-list">
              {filteredMovies.map(movie => (
                <MovieCard key={movie.imdbID} movie={movie} onSelect={() => setSelectedMovie(movie.imdbID)} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
