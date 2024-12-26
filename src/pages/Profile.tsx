import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  fetchUserLists,
  ListType,
  removeFromList,
} from "../store/slices/listSlice";
import { fetchUserProfile } from "../store/slices/profileSlice";
import MediaList from "../components/features/MediaList";
import Statistics from "../components/features/Statistics";

const Profile = () => {
  const dispatch = useAppDispatch();
  const {
    completed,
    watching,
    planToWatch,
    dropped,
    loading: listsLoading,
  } = useAppSelector((state) => state.lists);
  const { profile, loading: profileLoading } = useAppSelector(
    (state) => state.profile
  );

  const [activeTab, setActiveTab] = useState<ListType>("completed");

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchUserLists());
  }, [dispatch]);

  const handleRemoveFromList = async (mediaId: number) => {
    try {
      await dispatch(removeFromList({ mediaId, listType: activeTab })).unwrap();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  if (profileLoading || listsLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      {profile && (
        <>
          <div className="profile-header">
            <div className="profile-info">
              <h1>{profile.username}'s Profile</h1>
              <p>
                Member since {new Date(profile.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Statistics
            completedStats={{
              totalItems: completed.length,
              moviesCount: completed.filter(
                (item) => item.media_type === "movie"
              ).length,
              tvShowsCount: completed.filter((item) => item.media_type === "tv")
                .length,
              averageRating: profile?.watchStats?.averageRating ?? 0,
            }}
            watchingStats={{
              totalItems: watching.length,
              moviesCount: watching.filter(
                (item) => item.media_type === "movie"
              ).length,
              tvShowsCount: watching.filter((item) => item.media_type === "tv")
                .length,
              averageRating: profile?.watchStats?.averageRating ?? 0,
            }}
            planToWatchStats={{
              totalItems: planToWatch.length,
              moviesCount: planToWatch.filter(
                (item) => item.media_type === "movie"
              ).length,
              tvShowsCount: planToWatch.filter(
                (item) => item.media_type === "tv"
              ).length,
              averageRating: 0,
            }}
            droppedStats={{
              totalItems: dropped.length,
              moviesCount: dropped.filter((item) => item.media_type === "movie")
                .length,
              tvShowsCount: dropped.filter((item) => item.media_type === "tv")
                .length,
              averageRating: 0,
            }}
          />

          <div className="lists-container">
            <div className="lists-tabs">
              <button
                className={`tab ${activeTab === "completed" ? "active" : ""}`}
                onClick={() => setActiveTab("completed")}
              >
                Completed
              </button>
              <button
                className={`tab ${activeTab === "watching" ? "active" : ""}`}
                onClick={() => setActiveTab("watching")}
              >
                Watching
              </button>
              <button
                className={`tab ${
                  activeTab === "plan_to_watch" ? "active" : ""
                }`}
                onClick={() => setActiveTab("plan_to_watch")}
              >
                Plan to Watch
              </button>
              <button
                className={`tab ${activeTab === "dropped" ? "active" : ""}`}
                onClick={() => setActiveTab("dropped")}
              >
                Dropped
              </button>
            </div>

            <div className="lists-content">
              {activeTab === "completed" && (
                <MediaList
                  title="Completed"
                  items={completed}
                  onRemove={handleRemoveFromList}
                />
              )}
              {activeTab === "watching" && (
                <MediaList
                  title="Watching"
                  items={watching}
                  onRemove={handleRemoveFromList}
                />
              )}
              {activeTab === "plan_to_watch" && (
                <MediaList
                  title="Plan to watch"
                  items={planToWatch}
                  onRemove={handleRemoveFromList}
                />
              )}
              {activeTab === "dropped" && (
                <MediaList
                  title="Dropped"
                  items={dropped}
                  onRemove={handleRemoveFromList}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
