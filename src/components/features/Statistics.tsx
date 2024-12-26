import { ListStats } from "../../types/user";
import "../../styles/_statistics.scss";

interface StatisticsProps {
  completedStats: ListStats;
  planToWatchStats: ListStats;
  droppedStats: ListStats;
  watchingStats: ListStats;
}

const Statistics: React.FC<StatisticsProps> = ({
  completedStats,
  planToWatchStats,
  droppedStats,
  watchingStats,
}) => {
  return (
    <div className="statistics">
      <h2>Your Statistics</h2>
      <div className="stats-grid">
        <div className="stats-card completed">
          <h3>Completed</h3>
          <div className="stats-content">
            <p>Total: {completedStats.totalItems}</p>
            <p>Movies: {completedStats.moviesCount}</p>
            <p>TV Shows: {completedStats.tvShowsCount}</p>
            <p>
              Average Rating: ★{" "}
              {typeof completedStats.averageRating === "number"
                ? completedStats.averageRating.toFixed(1)
                : completedStats.averageRating}
            </p>
          </div>
        </div>

        <div className="stats-card watching">
          <h3>Currently Watching</h3>
          <div className="stats-content">
            <p>Total: {watchingStats.totalItems}</p>
            <p>Movies: {watchingStats.moviesCount}</p>
            <p>TV Shows: {watchingStats.tvShowsCount}</p>
            <p>
              Average Rating: ★{" "}
              {typeof watchingStats.averageRating === "number"
                ? watchingStats.averageRating.toFixed(1)
                : watchingStats.averageRating}
            </p>
          </div>
        </div>

        <div className="stats-card plan-to-watch">
          <h3>Plan to Watch</h3>
          <div className="stats-content">
            <p>Total: {planToWatchStats.totalItems}</p>
            <p>Movies: {planToWatchStats.moviesCount}</p>
            <p>TV Shows: {planToWatchStats.tvShowsCount}</p>
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
