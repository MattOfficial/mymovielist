import { useState, useEffect } from "react";
import debounce from "lodash/debounce";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { searchMedia, setSearchQuery } from "../../store/slices/movieSlice";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();

  const debouncedSearch = debounce((query: string) => {
    if (query) {
      dispatch(searchMedia({ query, page: 1 }));
      dispatch(setSearchQuery(query));
    }
  }, 500);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search movies and TV shows..."
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
