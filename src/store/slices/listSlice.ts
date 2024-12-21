import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { MediaItem } from "../../services/tmdbApi";

export type ListType = "watched" | "plan_to_watch" | "dropped";

export interface UserList {
  id: number;
  userId: number;
  mediaId: number;
  mediaType: "movie" | "tv";
  listType: ListType;
  rating?: number;
  addedAt: string;
}

interface ListState {
  watched: MediaItem[];
  planToWatch: MediaItem[];
  dropped: MediaItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ListState = {
  watched: [],
  planToWatch: [],
  dropped: [],
  loading: false,
  error: null,
};

export const addToList = createAsyncThunk(
  "lists/addToList",
  async ({
    mediaItem,
    listType,
    rating,
  }: {
    mediaItem: MediaItem;
    listType: ListType;
    rating?: number;
  }) => {
    const response = await axios.post("/api/lists", {
      mediaId: mediaItem.id,
      mediaType: mediaItem.media_type,
      listType,
      rating,
    });
    return { mediaItem, listType, response: response.data };
  }
);

export const removeFromList = createAsyncThunk(
  "lists/removeFromList",
  async ({ mediaId, listType }: { mediaId: number; listType: ListType }) => {
    await axios.delete(`/api/lists/${mediaId}`);
    return { mediaId, listType };
  }
);

export const fetchUserLists = createAsyncThunk(
  "lists/fetchUserLists",
  async () => {
    const response = await axios.get("/api/lists");
    return response.data;
  }
);

const listSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLists.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserLists.fulfilled, (state, action) => {
        state.loading = false;
        state.watched = action.payload.watched;
        state.planToWatch = action.payload.planToWatch;
        state.dropped = action.payload.dropped;
      })
      .addCase(fetchUserLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch lists";
      })
      .addCase(addToList.fulfilled, (state, action) => {
        const { mediaItem, listType } = action.payload;
        switch (listType) {
          case "watched":
            state.watched.push(mediaItem);
            break;
          case "plan_to_watch":
            state.planToWatch.push(mediaItem);
            break;
          case "dropped":
            state.dropped.push(mediaItem);
            break;
        }
      })
      .addCase(removeFromList.fulfilled, (state, action) => {
        const { mediaId, listType } = action.payload;
        switch (listType) {
          case "watched":
            state.watched = state.watched.filter((item) => item.id !== mediaId);
            break;
          case "plan_to_watch":
            state.planToWatch = state.planToWatch.filter(
              (item) => item.id !== mediaId
            );
            break;
          case "dropped":
            state.dropped = state.dropped.filter((item) => item.id !== mediaId);
            break;
        }
      });
  },
});

export default listSlice.reducer;
