import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/tmdb`;

const tmdbApi = {
  getTrending: async (
    mediaType: "all" | "movie" | "tv" = "all",
    timeWindow: "day" | "week" = "week"
  ) => {
    const response = await axios.get(
      `${API_BASE_URL}/trending?mediaType=${mediaType}&timeWindow=${timeWindow}`
    );
    return response.data;
  },

  search: async (query: string, page: number = 1) => {
    const response = await axios.get(
      `${API_BASE_URL}/search?query=${query}&page=${page}`
    );
    return response.data;
  },

  getDetails: async (id: number, mediaType: "movie" | "tv") => {
    const response = await axios.get(`${API_BASE_URL}/${mediaType}/${id}`);
    return response.data;
  },

  getPopular: async (mediaType: "movie" | "tv", page: number = 1) => {
    const response = await axios.get(
      `${API_BASE_URL}/${mediaType}/popular?page=${page}`
    );
    return response.data;
  },
};

export default tmdbApi;
