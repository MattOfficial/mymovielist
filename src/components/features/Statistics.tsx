import React from "react";
import { ListStats } from "../../types/user";

interface StatisticsProps {
  watchedStats: ListStats;
  plannedStats: ListStats;
  droppedStats: ListStats;
}

const Statistics: React.FC<StatisticsProps> = ({
  watchedStats,
  plannedStats,
  droppedStats,
}) => {
  return (
    <div className="statistics">
      <h2>Your Statistics</h2>
      <div className="stats-grid">
        <div className="stats-card watched">
          <h3>Watched</h3>
          <div className="stats-content">
            <p>Total: {watchedStats.totalItems}</p>
            <p>Movies: {watchedStats.moviesCount}</p>
            <p>TV Shows: {watchedStats.tvShowsCount}</p>
            <p>
              Average Rating: ★{" "}
              {typeof watchedStats.averageRating === "number"
                ? watchedStats.averageRating.toFixed(1)
                : watchedStats.averageRating}
            </p>
          </div>
        </div>

        <div className="stats-card planned">
          <h3>Plan to Watch</h3>
          <div className="stats-content">
            <p>Total: {plannedStats.totalItems}</p>
            <p>Movies: {plannedStats.moviesCount}</p>
            <p>TV Shows: {plannedStats.tvShowsCount}</p>
          </div>
        </div>

        <div className="stats-card dropped">
          <h3>Dropped</h3>
          <div className="stats-content">
            <p>Total: {droppedStats.totalItems}</p>
            <p>Movies: {droppedStats.moviesCount}</p>
            <p>TV Shows: {droppedStats.tvShowsCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
