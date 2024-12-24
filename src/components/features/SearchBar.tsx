import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { searchMedia, clearSearchResults } from "../../store/slices/movieSlice";
import { MediaItem } from "../../services/tmdbApi";
import useDebounce from "../../hooks/useDebounce";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { searchResults, loading } = useAppSelector((state) => state.movies);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      dispatch(searchMedia({ query: debouncedSearch, page: 1 }));
      setIsOpen(true);
    } else {
      dispatch(clearSearchResults());
      setIsOpen(false);
    }
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleResultClick = (item: MediaItem) => {
    setIsOpen(false);
    setSearchTerm("");
    navigate(`/${item.media_type}/${item.id}`);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search movies & TV shows..."
          className="search-input"
        />
        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => {
              setSearchTerm("");
              dispatch(clearSearchResults());
            }}
          >
            ×
          </button>
        )}
      </div>

      {isOpen && searchResults.length > 0 && (
        <div className="search-results">
          {loading ? (
            <div className="search-loading">Searching...</div>
          ) : (
            searchResults.slice(0, 6).map((item: MediaItem) => (
              <div
                key={`${item.media_type}-${item.id}`}
                className="search-result-item"
                onClick={() => handleResultClick(item)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                  alt={"title" in item ? item.title : item.name}
                  className="result-poster"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/placeholder-poster.png";
                  }}
                />
                <div className="result-info">
                  <h4>{"title" in item ? item.title : item.name}</h4>
                  <p>
                    {item.media_type === "movie" ? "Movie" : "TV Show"} •{" "}
                    {new Date(
                      "release_date" in item
                        ? item.release_date
                        : item.first_air_date
                    ).getFullYear()}
                  </p>
                </div>
              </div>
            ))
          )}
          {searchResults.length > 6 && (
            <div
              className="view-all-results"
              onClick={() => navigate(`/search?q=${searchTerm}`)}
            >
              View all results
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
