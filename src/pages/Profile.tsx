import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchUserProfile } from "../store/slices/profileSlice";
import {
  fetchUserLists,
  ListType,
  removeFromList,
} from "../store/slices/listSlice";
import Statistics from "../components/features/Statistics";
import MediaList from "../components/features/MediaList";
import "../styles/_profile.scss";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading: profileLoading } = useAppSelector(
    (state) => state.profile
  );
  const {
    watched,
    planToWatch,
    dropped,
    loading: listsLoading,
  } = useAppSelector((state) => state.lists);
  const [activeTab, setActiveTab] = useState<ListType>("watched");

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchUserLists());
  }, [dispatch]);

  const handleRemoveFromList = async (mediaId: number) => {
    try {
      await dispatch(removeFromList({ mediaId, listType: activeTab })).unwrap();
    } catch (err) {
      console.error("Failed to remove item from list:", err);
    }
  };

  if (profileLoading || listsLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      {profile && (
        <div className="profile-header">
          <h1>Welcome, {profile.username}!</h1>
          <p>Member since: {new Date(profile.joinDate).toLocaleDateString()}</p>
        </div>
      )}

      <Statistics
        watchedStats={{
          moviesCount: watched.filter((item) => item.media_type === "movie")
            .length,
          tvShowsCount: watched.filter((item) => item.media_type === "tv")
            .length,
          averageRating: profile?.watchStats.averageRating || 0,
          totalItems: watched.length,
        }}
        plannedStats={{
          moviesCount: planToWatch.filter((item) => item.media_type === "movie")
            .length,
          tvShowsCount: planToWatch.filter((item) => item.media_type === "tv")
            .length,
          averageRating: 0,
          totalItems: planToWatch.length,
        }}
        droppedStats={{
          moviesCount: dropped.filter((item) => item.media_type === "movie")
            .length,
          tvShowsCount: dropped.filter((item) => item.media_type === "tv")
            .length,
          averageRating: 0,
          totalItems: dropped.length,
        }}
      />

      <div className="lists-section">
        <div className="tabs">
          <button
            className={activeTab === "watched" ? "active" : ""}
            onClick={() => setActiveTab("watched")}
          >
            Watched
          </button>
          <button
            className={activeTab === "plan_to_watch" ? "active" : ""}
            onClick={() => setActiveTab("plan_to_watch")}
          >
            Plan to Watch
          </button>
          <button
            className={activeTab === "dropped" ? "active" : ""}
            onClick={() => setActiveTab("dropped")}
          >
            Dropped
          </button>
        </div>

        <div className="list-content">
          {activeTab === "watched" && (
            <MediaList
              title="Watched"
              items={watched}
              onRemove={handleRemoveFromList}
            />
          )}
          {activeTab === "plan_to_watch" && (
            <MediaList
              title="Plan to Watch"
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
    </div>
  );
};

export default Profile;
