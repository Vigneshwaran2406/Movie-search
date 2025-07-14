import './MovieCard.css'; 


export default function MovieCard({ movie, onSelect }) {
  return (
    <div className="movie-card" onClick={onSelect}>
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : `https://placehold.co/200x300/e0e0e0/555555?text=${encodeURIComponent(movie.Title)}`}
        alt={movie.Title}
        className="movie-card-poster"
        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/200x300/e0e0e0/555555?text=${encodeURIComponent(movie.Title)}`; }}
      />
      <h3 className="movie-card-title">{movie.Title}</h3>
      <p className="movie-card-year">{movie.Year}</p>
      <p className="movie-card-rating">
        <span className="star-icon">⭐</span> {movie.imdbRating}
      </p>
    </div>
  );
}
