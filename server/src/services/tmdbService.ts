import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_BASE_URL;

class TMDBService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      params: {
        api_key: API_KEY,
      },
    });
  }

  async getTrending(
    mediaType: "all" | "movie" | "tv" = "all",
    timeWindow: "day" | "week" = "week"
  ) {
    try {
      const response = await this.api.get(
        `/trending/${mediaType}/${timeWindow}`
      );
      return response.data.results;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async search(query: string, page: number = 1) {
    try {
      const response = await this.api.get("/search/multi", {
        params: {
          query,
          page,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getDetails(id: number, mediaType: "movie" | "tv") {
    try {
      const response = await this.api.get(`/${mediaType}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPopular(mediaType: "movie" | "tv", page: number = 1) {
    try {
      const response = await this.api.get(`/${mediaType}/popular`, {
        params: {
          page,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
      return new Error(
        error.response?.data?.message || "An error occurred with the TMDB API"
      );
    }
    return new Error("An unexpected error occurred");
  }
}

export default new TMDBService();
