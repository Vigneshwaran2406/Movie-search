import './Filters.css';

export default function Filters({ year, setYear, rating, setRating }) {
  return (
    <div className="filters">
      <label className="filter-label">
        <span>Released Year:</span>
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="e.g., 2023"
          className="filter-input"
        />
      </label>
      <label className="filter-label">
        <span>Min Rating:</span>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          step="0.1"
          min="0"
          max="10"
          className="filter-input"
        />
      </label>
    </div>
  );
}
