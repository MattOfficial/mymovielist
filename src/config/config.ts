export const config = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  TMDB_API_KEY: import.meta.env.VITE_TMDB_API_KEY,
  TMDB_BASE_URL: "https://api.themoviedb.org/3",
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
};
