export interface UserList {
  id: number;
  userId: number;
  mediaId: number;
  mediaType: "movie" | "tv";
  listType: "watched" | "plan_to_watch" | "dropped";
  rating?: number;
  createdAt: Date;
}
