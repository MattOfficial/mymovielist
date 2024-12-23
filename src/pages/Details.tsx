import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import tmdbApi, { MediaItem } from "../services/tmdbApi";
import Rating from "../components/common/Rating";
import { addToList, removeFromList, ListType } from "../store/slices/listSlice";
import "../styles/_details.scss";

const Details: React.FC = () => {
  const { id, mediaType } = useParams<{
    id: string;
    mediaType: "movie" | "tv";
  }>();
  const [details, setDetails] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { watched, planToWatch, dropped } = useAppSelector(
    (state) => state.lists
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await tmdbApi.getDetails(Number(id), mediaType!);
        setDetails(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch details");
      } finally {
        setLoading(false);
      }
    };

    if (id && mediaType) {
      fetchDetails();
    }
  }, [id, mediaType]);

  const handleAddToList = async (listType: ListType, rating?: number) => {
    if (!details) return;

    try {
      await dispatch(
        addToList({
          mediaItem: details,
          listType,
          rating,
        })
      ).unwrap();
    } catch (err) {
      console.error(err);
      setError("Failed to add to list");
    }
  };

  const handleRemoveFromList = async (listType: ListType) => {
    if (!details) return;

    try {
      await dispatch(
        removeFromList({
          mediaId: details.id,
          listType,
        })
      ).unwrap();
    } catch (err) {
      console.error(err);
      setError("Failed to remove from list");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!details) return <div>No details found</div>;

  const isInWatched = watched.some((item) => item.id === details.id);
  const isInPlanToWatch = planToWatch.some((item) => item.id === details.id);
  const isInDropped = dropped.some((item) => item.id === details.id);

  return (
    <div className="details-page">
      <div className="backdrop">
        <img
          src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
          alt="backdrop"
        />
      </div>

      <div className="content">
        <div className="poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
            alt={
              ("title" in details ? details.title : details.name) ||
              "Media image"
            }
          />
        </div>

        <div className="info">
          <h1>
            {("title" in details ? details.title : details.name) ||
              "Media Title"}
          </h1>
          <p className="overview">{details.overview}</p>

          <div className="metadata">
            <span>Rating: ★ {details.vote_average.toFixed(1)}</span>
            <span>
              Release Date:{" "}
              {new Date(
                ("release_date" in details
                  ? details.release_date
                  : details.first_air_date) || ""
              ).toLocaleDateString()}
            </span>
          </div>

          {isAuthenticated && (
            <div className="list-actions">
              {!isInWatched ? (
                <div>
                  <button onClick={() => handleAddToList("watched")}>
                    Add to Watched
                  </button>
                  <Rating
                    onRate={(rating) => handleAddToList("watched", rating)}
                  />
                </div>
              ) : (
                <button onClick={() => handleRemoveFromList("watched")}>
                  Remove from Watched
                </button>
              )}

              {!isInPlanToWatch && (
                <button onClick={() => handleAddToList("plan_to_watch")}>
                  Add to Plan to Watch
                </button>
              )}

              {!isInDropped && (
                <button onClick={() => handleAddToList("dropped")}>
                  Add to Dropped
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;
