export interface UserProfile {
  id: number;
  username: string;
  email: string;
  joinDate: string;
  watchStats: {
    totalWatched: number;
    totalPlanned: number;
    totalDropped: number;
    averageRating: number;
  };
}

export interface ListStats {
  moviesCount: number;
  tvShowsCount: number;
  averageRating: number;
  totalItems: number;
}
