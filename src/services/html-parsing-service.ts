import * as cheerio from "cheerio";

interface ContentResult {
  title: string;
  description: string;
  content: string;
  keywords: string[];
  thumbnailUrl: string;
}

class HtmlParsingService {
  private static instance: HtmlParsingService;

  private constructor() {}

  public static getInstance(): HtmlParsingService {
    if (!HtmlParsingService.instance) {
      HtmlParsingService.instance = new HtmlParsingService();
    }
    return HtmlParsingService.instance;
  }

  public async getContentDataFromUrl(url: string): Promise<ContentResult> {
    // Naver Blog URL 형식 변환
    if (
      url.startsWith("https://blog.naver.com") ||
      url.startsWith("http://blog.naver.com")
    ) {
      url = url.replace("blog.naver.com", "m.blog.naver.com");
    }

    const response = await this.fetcher(url);
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

  public async getLatestRssUrls(url: string) {
    const res = await this.fetcher(url);
    if (!res.ok) {
      return [];
    }
    const xml = await res.text();
    const $ = cheerio.load(xml, { xmlMode: true });
    const newLinks: string[] = [];
    $("link").each((_, element) => {
      let link = "";
      const href = $(element).attr("href");
      // href가 유효한 URL인 경우
      if (href && href.startsWith("http")) {
        link = href;
      } else {
        // href가 없는 경우, text() 메서드를 사용하여 텍스트 추출
        const textUrl = $(element).text().trim();
        if (textUrl && textUrl.startsWith("http")) {
          link = textUrl;
        }
      }
      // 도메인 뒤에 실제 경로가 있는 URL만 추가
      if (link && new URL(link).pathname.length > 1) {
        newLinks.push(link);
      }
    });
    return newLinks;
  }

  private async fetcher(url: string) {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Cache-Control": "max-age=0",
        DNT: "1",
        "Sec-Ch-Ua":
          '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
      },
      referrer: "https://www.google.com/",
      referrerPolicy: "strict-origin-when-cross-origin",
      mode: "cors",
      credentials: "omit",
      cache: "no-cache",
    });
    return res;
  }
}

export const htmlParsingService = HtmlParsingService.getInstance();
