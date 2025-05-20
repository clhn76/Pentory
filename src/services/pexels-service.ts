import { createClient } from "pexels";

export class PexelsService {
  private client;

  constructor() {
    const apiKey = process.env.PEXELS_API_KEY;
    if (!apiKey) {
      throw new Error("PEXELS_API_KEY is not defined");
    }
    this.client = createClient(apiKey);
  }

  async searchSinglePhoto(query: string) {
    try {
      const response = await this.client.photos.search({
        query,
        per_page: 1,
      });

      if ("photos" in response && response.photos.length > 0) {
        const photo = response.photos[0];
        return photo.src.medium;
      }

      return null;
    } catch (error) {
      console.error("❌ Error searching Pexels:", error);
      return null;
    }
  }

  async searchPhotos(query: string, limit: number = 10) {
    try {
      const response = await this.client.photos.search({
        query,
        per_page: limit,
      });

      if ("photos" in response && response.photos.length > 0) {
        return response.photos.map((photo) => ({
          url: photo.src.medium,
          alt: photo.alt,
        }));
      }

      return null;
    } catch (error) {
      console.error("❌ Error searching Pexels:", error);
      return null;
    }
  }
}

export const pexelsService = new PexelsService();
