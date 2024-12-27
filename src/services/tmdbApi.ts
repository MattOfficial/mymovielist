import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  media_type: "movie";
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  media_type: "tv";
}

export type MediaItem = (Movie | TVShow) & { media_id?: number };

const tmdbApi = {
  getTrending: async (
    mediaType: "all" | "movie" | "tv" = "all",
    timeWindow: "day" | "week" = "week"
  ) => {
    const response = await axios.get(
      `${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}`
    );
    return response.data.results;
  },

  search: async (query: string, page: number = 1) => {
    const response = await axios.get(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}&page=${page}`
    );
    return response.data;
  },

  getDetails: async (id: number, mediaType: "movie" | "tv") => {
    const response = await axios.get(
      `${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`
    );
    return response.data;
  },

  getPopular: async (mediaType: "movie" | "tv", page: number = 1) => {
    const response = await axios.get(
      `${BASE_URL}/${mediaType}/popular?api_key=${API_KEY}&page=${page}`
    );
    return response.data;
  },
};

export default tmdbApi;
