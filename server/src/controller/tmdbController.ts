import { Request, Response } from "express";
import tmdbService from "../services/tmdbService";

export const getTrending = async (req: Request, res: Response) => {
  try {
    const { mediaType = "all", timeWindow = "week" } = req.query;
    const results = await tmdbService.getTrending(
      mediaType as "all" | "movie" | "tv",
      timeWindow as "day" | "week"
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const search = async (req: Request, res: Response) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }
    const results = await tmdbService.search(query as string, Number(page));
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getDetails = async (req: Request, res: Response) => {
  try {
    const { id, mediaType } = req.params;
    if (!id || !mediaType) {
      return res.status(400).json({ error: "ID and media type are required" });
    }
    const results = await tmdbService.getDetails(
      Number(id),
      mediaType as "movie" | "tv"
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getPopular = async (req: Request, res: Response) => {
  try {
    const { mediaType } = req.params;
    const { page = 1 } = req.query;
    if (!mediaType) {
      return res.status(400).json({ error: "Media type is required" });
    }
    const results = await tmdbService.getPopular(
      mediaType as "movie" | "tv",
      Number(page)
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
