import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchTrending, fetchPopular } from "../store/slices/movieSlice";
import MediaCard from "../components/common/MediaCard";
import SearchBar from "../components/features/SearchBar";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { trending, popular, searchResults, loading, error, searchQuery } =
    useAppSelector((state) => state.movies);
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");

  useEffect(() => {
    dispatch(fetchTrending("all"));
    dispatch(fetchPopular({ mediaType, page: 1 }));
  }, [dispatch, mediaType]);

  return (
    <div className="dashboard">
      <SearchBar />

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          {searchQuery ? (
            <section className="search-results">
              <h2>Search Results</h2>
              <div className="media-grid">
                {searchResults.map((item) => (
                  <MediaCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ) : (
            <>
              <section className="trending">
                <h2>Trending Now</h2>
                <div className="media-grid">
                  {trending.map((item) => (
                    <MediaCard key={item.id} item={item} />
                  ))}
                </div>
              </section>

              <section className="popular">
                <div className="section-header">
                  <h2>Popular</h2>
                  <div className="media-type-toggle">
                    <button
                      className={mediaType === "movie" ? "active" : ""}
                      onClick={() => setMediaType("movie")}
                    >
                      Movies
                    </button>
                    <button
                      className={mediaType === "tv" ? "active" : ""}
                      onClick={() => setMediaType("tv")}
                    >
                      TV Shows
                    </button>
                  </div>
                </div>
                <div className="media-grid">
                  {popular.map((item) => (
                    <MediaCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
