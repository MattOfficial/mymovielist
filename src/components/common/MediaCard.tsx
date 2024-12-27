import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import tmdbApi from "../../services/tmdbApi";
import type { MediaItem } from "../../types/shows";
import "../../styles/_mediaCard.scss";

interface MediaCardProps {
  item: MediaItem;
  origin: "dashboard" | "profile";
}

const MediaCard: React.FC<MediaCardProps> = ({ item, origin }) => {
  const [itemDetails, setItemDetails] = useState<MediaItem | null>(null);

  const placeholderPoster =
    "https://incakoala.github.io/top9movie/film-poster-placeholder.png";

  useEffect(() => {
    if (origin === "dashboard") {
      setItemDetails(item);
    } else {
      const fetchItemDetails = async () => {
        const data = await tmdbApi.getDetails(item.media_id!, item.media_type);
        setItemDetails({ ...data, media_type: item.media_type });
      };

      fetchItemDetails();
    }
  }, [origin, item]);

  const title = itemDetails
    ? "title" in itemDetails
      ? itemDetails.title
      : itemDetails.name
    : "";
  const releaseDate = itemDetails
    ? "release_date" in itemDetails
      ? itemDetails.release_date
      : itemDetails.first_air_date
    : new Date().toISOString();

  return itemDetails ? (
    <div className="media-card">
      <Link to={`/${itemDetails.media_type}/${itemDetails.id}`}>
        <div className="media-poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${itemDetails.poster_path}`}
            alt={title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = placeholderPoster;
            }}
          />
        </div>
        <div className="media-info">
          <h3>{title}</h3>
          <p>{new Date(releaseDate).getFullYear()}</p>
          <div className="rating">
            {itemDetails.vote_average && (
              <span>★ {itemDetails.vote_average.toFixed(1) || "NA"}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  ) : (
    <div className="media-card">
      <div className="media-poster">
        <img src={placeholderPoster} alt="Placeholder" />
      </div>
      <div className="media-info">
        <h3>Loading...</h3>
      </div>
    </div>
  );
};

export default MediaCard;
