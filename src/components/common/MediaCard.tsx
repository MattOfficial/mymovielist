import React from "react";
import { Link } from "react-router-dom";
import { MediaItem } from "../../services/tmdbApi";

interface MediaCardProps {
  item: MediaItem;
}

const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
  const title = "title" in item ? item.title : item.name;
  const releaseDate =
    "release_date" in item ? item.release_date : item.first_air_date;

  return (
    <div className="media-card">
      <Link to={`/${item.media_type}/${item.id}`}>
        <div className="media-poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-poster.png";
            }}
          />
        </div>
        <div className="media-info">
          <h3>{title}</h3>
          <p>{new Date(releaseDate).getFullYear()}</p>
          <div className="rating">
            <span>★ {item.vote_average.toFixed(1) || "NA"}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MediaCard;
