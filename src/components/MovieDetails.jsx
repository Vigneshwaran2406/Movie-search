import { useEffect, useState } from 'react';
import './MovieDetails.css'; 

const API_KEY = "7b1c4817"; 

export default function MovieDetails({ imdbID, onBack }) {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.Response === "False") {
          throw new Error(data.Error);
        }
        setMovie(data);
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
        setError("Failed to load movie details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (imdbID) {
      fetchMovieDetails();
    }
  }, [imdbID]);

  if (isLoading) {
    return (
      <div className="movie-details-loading-error">
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-details-loading-error error-message">
        <p>{error}</p>
        <button onClick={onBack} className="back-button">← Back to Search</button>
      </div>
    );
  }

  if (!movie) {
    return null; 
  }

  return (
    <div className="movie-details">
      <button onClick={onBack} className="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" className="back-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414L6.586 9H14a1 1 0 110 2H6.586l2.707 2.707a1 1 0 001.414-1.414L8.414 10l2.293-2.293z" clipRule="evenodd" />
        </svg>
        <span>Back to Search</span>
      </button>
      <div className="movie-details-content">
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : `https://placehold.co/300x450/e0e0e0/555555?text=${encodeURIComponent(movie.Title)}`}
          alt={movie.Title}
          className="movie-poster"
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x450/e0e0e0/555555?text=${encodeURIComponent(movie.Title)}`; }}
        />
        <div className="movie-details-info">
          <h2>{movie.Title}</h2>
          <p><strong>Year:</strong> {movie.Year}</p>
          <p><strong>Rating:</strong> ⭐ {movie.imdbRating} / 10</p>
          <p><strong>Genre:</strong> {movie.Genre}</p>
          <p><strong>Director:</strong> {movie.Director}</p>
          <p><strong>Actors:</strong> {movie.Actors}</p>
          <p><strong>Runtime:</strong> {movie.Runtime}</p>
          <p className="movie-plot"><strong>Plot:</strong> {movie.Plot}</p>
        </div>
      </div>
    </div>
  );
}
