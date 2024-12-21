import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tmdbApi, { MediaItem } from "../../services/tmdbApi";

interface MovieState {
  trending: MediaItem[];
  searchResults: MediaItem[];
  popular: MediaItem[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
}

const initialState: MovieState = {
  trending: [],
  searchResults: [],
  popular: [],
  loading: false,
  error: null,
  searchQuery: "",
  currentPage: 1,
  totalPages: 1,
};

export const fetchTrending = createAsyncThunk(
  "movies/fetchTrending",
  async (mediaType: "all" | "movie" | "tv" = "all") => {
    return await tmdbApi.getTrending(mediaType);
  }
);

export const searchMedia = createAsyncThunk(
  "movies/searchMedia",
  async ({ query, page }: { query: string; page: number }) => {
    return await tmdbApi.search(query, page);
  }
);

export const fetchPopular = createAsyncThunk(
  "movies/fetchPopular",
  async ({ mediaType, page }: { mediaType: "movie" | "tv"; page: number }) => {
    return await tmdbApi.getPopular(mediaType, page);
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrending.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload;
        state.error = null;
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch trending";
      })
      .addCase(searchMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.results;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.total_pages;
        state.error = null;
      })
      .addCase(searchMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Search failed";
      })
      .addCase(fetchPopular.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPopular.fulfilled, (state, action) => {
        state.loading = false;
        state.popular = action.payload.results;
        state.error = null;
      })
      .addCase(fetchPopular.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch popular";
      });
  },
});

export const { setSearchQuery, clearSearchResults } = movieSlice.actions;
export default movieSlice.reducer;
