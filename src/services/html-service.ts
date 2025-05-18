import * as cheerio from "cheerio";

interface ContentResult {
  title: string;
  description: string;
  content: string;
  keywords: string[];
  thumbnailUrl: string;
}

class HtmlService {
  private static instance: HtmlService;

  private constructor() {}

  public static getInstance(): HtmlService {
    if (!HtmlService.instance) {
      HtmlService.instance = new HtmlService();
    }
    return HtmlService.instance;
  }

  public async getContentDataFromUrl(url: string): Promise<ContentResult> {
    // Naver Blog URL 형식 변환
    if (
      url.startsWith("https://blog.naver.com") ||
      url.startsWith("http://blog.naver.com")
    ) {
      url = url.replace("blog.naver.com", "m.blog.naver.com");
    }

    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove unnecessary elements
    $("script, style, meta, link, noscript, iframe, svg").remove();

    // Get meta information
    const title = $("title").text().trim() || "";
    const description =
      $('meta[name="description"]').attr("content")?.trim() || "";

    // Extract keywords from meta tags
    const keywords =
      $('meta[name="keywords"]')
        .attr("content")
        ?.split(",")
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0) || [];

    // Get thumbnail URL
    const thumbnailUrl =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      "";

    // Get main content
    const mainContent = $("body")
      .clone() // Clone to avoid modifying the original
      .find("script, style, meta, link, noscript, iframe, svg")
      .remove()
      .end()
      .text()
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/\n+/g, " ") // Replace newlines with space
      .trim();

    return {
      title,
      description,
      content: mainContent,
      keywords,
      thumbnailUrl,
    };
  }
}

export const htmlService = HtmlService.getInstance();
