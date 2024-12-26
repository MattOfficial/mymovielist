import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axios";
import { MediaItem } from "../../services/tmdbApi";

export type ListType = "watching" | "plan_to_watch" | "dropped" | "completed";

export type MediaPayloadItem = MediaItem & { listType: ListType };

interface ListState {
  completed: MediaItem[];
  planToWatch: MediaItem[];
  dropped: MediaItem[];
  watching: MediaItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ListState = {
  completed: [],
  planToWatch: [],
  dropped: [],
  watching: [],
  loading: false,
  error: null,
};

export const fetchUserLists = createAsyncThunk(
  "lists/fetchUserLists",
  async () => {
    const response = await api.get("/lists");
    return response.data;
  }
);

export const addToList = createAsyncThunk(
  "lists/addToList",
  async ({
    mediaItem,
    listType,
    rating = 0,
  }: {
    mediaItem: MediaItem;
    listType: ListType;
    rating?: number;
  }) => {
    console.log("mediaItem", mediaItem);
    const response = await api.post("/lists", {
      mediaId: mediaItem.id,
      mediaType: mediaItem.media_type || "movie",
      listType,
      rating,
    });
    return { mediaItem, listType, response: response.data };
  }
);

export const removeFromList = createAsyncThunk(
  "lists/removeFromList",
  async ({ mediaId, listType }: { mediaId: number; listType: ListType }) => {
    await api.delete(`/lists/${mediaId}`);
    return { mediaId, listType };
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
        action.payload.forEach((item: MediaPayloadItem) => {
          switch (item.listType) {
            case "completed":
              state.completed.push(item);
              break;
            case "watching":
              state.watching.push(item);
              break;
            case "plan_to_watch":
              state.planToWatch.push(item);
              break;
            case "dropped":
              state.dropped.push(item);
              break;
          }
        });
      })
      .addCase(fetchUserLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch lists";
      })
      .addCase(addToList.fulfilled, (state, action) => {
        const { mediaItem, listType } = action.payload;
        switch (listType) {
          case "completed":
            state.completed.push(mediaItem);
            break;
          case "watching":
            state.watching.push(mediaItem);
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
          case "completed":
            state.completed = state.completed.filter(
              (item) => item.id !== mediaId
            );
            break;
          case "plan_to_watch":
            state.planToWatch = state.planToWatch.filter(
              (item) => item.id !== mediaId
            );
            break;
          case "watching":
            state.watching = state.watching.filter(
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
