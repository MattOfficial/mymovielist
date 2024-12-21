import React from "react";
import { MediaItem } from "../../services/tmdbApi";
import MediaCard from "../common/MediaCard";

interface MediaListProps {
  title: string;
  items: MediaItem[];
  onRemove?: (id: number) => void;
}

const MediaList: React.FC<MediaListProps> = ({ title, items, onRemove }) => {
  return (
    <div className="media-list">
      <h2>{title}</h2>
      {items.length === 0 ? (
        <p className="empty-list">No items in this list yet</p>
      ) : (
        <div className="media-grid">
          {items.map((item) => (
            <div key={item.id} className="media-item-wrapper">
              <MediaCard item={item} />
              {onRemove && (
                <button
                  className="remove-btn"
                  onClick={() => onRemove(item.id)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaList;
