import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axios";
import type { MediaItem } from "../../types/shows";

export type ListType = "watching" | "plan_to_watch" | "dropped" | "completed";

export type MediaPayloadItem = MediaItem & { listType: ListType };

export interface ListState {
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
    const [completed, planToWatch, dropped, watching] = await Promise.all([
      api.get("/lists/completed"),
      api.get("/lists/plan_to_watch"),
      api.get("/lists/dropped"),
      api.get("/lists/watching"),
    ]);

    return {
      completed: completed.data,
      planToWatch: planToWatch.data,
      dropped: dropped.data,
      watching: watching.data,
    };
  }
);

export const addToList = createAsyncThunk(
  "lists/addToList",
  async ({
    mediaItem,
    listType,
    mediaType,
    rating = 0,
  }: {
    mediaItem: MediaItem;
    listType: ListType;
    rating?: number;
    mediaType: string;
  }) => {
    const response = await api.post("/lists", {
      mediaId: mediaItem.id,
      mediaType: mediaType,
      listType,
      rating,
    });
    return { mediaItem, listType, response: response.data };
  }
);

export const updateListItem = createAsyncThunk(
  "lists/updateListItem",
  async ({
    mediaId,
    listType,
    rating = 0,
  }: {
    mediaId: number;
    listType: ListType;
    rating?: number;
  }) => {
    const response = await api.put(`/lists/${mediaId}`, {
      listType,
      rating,
    });
    return {
      mediaId,
      listType,
      rating,
      response: response.data,
    };
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
        state.completed = action.payload.completed;
        state.planToWatch = action.payload.planToWatch;
        state.dropped = action.payload.dropped;
        state.watching = action.payload.watching;
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
      })
      .addCase(updateListItem.fulfilled, (state, action) => {
        const { mediaId, listType, rating } = action.payload;

        type ListKeys = Extract<
          keyof ListState,
          "completed" | "planToWatch" | "dropped" | "watching"
        >;
        const lists: ListKeys[] = [
          "completed",
          "planToWatch",
          "dropped",
          "watching",
        ];
        let updatedItem: MediaItem | undefined;

        lists.forEach((list) => {
          const foundItem = state[list].find((item) => item.id === mediaId);
          if (foundItem) {
            updatedItem = {
              ...foundItem,
              rating: rating,
            } as MediaItem;
            state[list] = state[list].filter((item) => item.id !== mediaId);
          }
        });

        if (updatedItem) {
          switch (listType) {
            case "completed":
              state.completed.push(updatedItem);
              break;
            case "watching":
              state.watching.push(updatedItem);
              break;
            case "plan_to_watch":
              state.planToWatch.push(updatedItem);
              break;
            case "dropped":
              state.dropped.push(updatedItem);
              break;
          }
        }
      })
      .addCase(updateListItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateListItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update item";
      });
  },
});

export default listSlice.reducer;
