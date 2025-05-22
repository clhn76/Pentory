import * as cheerio from "cheerio";
import { TopContent } from "./types";
import { youtubeService } from "./youtube-service";

class HtmlParsingService {
  private static instance: HtmlParsingService;

  private constructor() {}

  public static getInstance(): HtmlParsingService {
    if (!HtmlParsingService.instance) {
      HtmlParsingService.instance = new HtmlParsingService();
    }
    return HtmlParsingService.instance;
  }

  public async getContentDataFromUrl(url: string) {
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
    const mainContent = ($("article").text() || $("body").text())
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

  public async getTopNaverBlogContents(keyword: string, limit: number = 10) {
    const res = await this.fetcher(
      `https://search.naver.com/search.naver?ssc=tab.blog.all&sm=tab_jum&query=${encodeURIComponent(
        keyword
      )}`
    );
    const htmlContent = await res.text();
    const $ = cheerio.load(htmlContent);
    const blogs: TopContent[] = [];

    // 블로그 검색 결과 리스트 아이템들을 선택
    $(".lst_view > li.bx").each((index, element) => {
      // 10개까지만 결과를 수집
      if (blogs.length >= limit) {
        return false;
      }

      const $item = $(element);

      // 함께 볼만한 검색어 섹션은 제외
      if ($item.hasClass("type_join")) {
        return;
      }

      // 제목
      const title = $item.find(".title_link").text().trim();

      // 설명
      const description = $item.find(".dsc_link").text().trim();

      // 대표 이미지 (첫 번째 썸네일)
      const thumbnailImage =
        $item.find(".mod_ugc_thumb_area img").attr("src") || "";

      // 작성자 정보
      const $userInfo = $item.find(".user_box_inner");
      const author = {
        name: $userInfo.find(".name").text().trim(),
        profileImage: $userInfo.find(".user_box_inner img").attr("src") || "",
      };

      // 작성일자
      const publishDate = $userInfo.find(".sub").text().trim();

      // 링크
      const url = $item.find(".title_link").attr("href") || "";

      blogs.push({
        title,
        description,
        thumbnailImage,
        author,
        publishDate,
        url,
      });
    });
    return blogs;
  }

  public async validateYoutubeChannelUrl(url: string): Promise<{
    isValid: boolean;
    channelId?: string;
    channelName?: string;
    error?: string;
  }> {
    try {
      // YouTube 채널 URL 패턴 검사
      const isYoutubeUrl = youtubeService.checkIsYoutubeUrl(url);
      if (!isYoutubeUrl) {
        return {
          isValid: false,
          error: "유효한 YouTube 채널 URL이 아닙니다.",
        };
      }

      const response = await this.fetcher(url);
      const htmlContent = await response.text();

      // 채널 ID 추출
      const channelId = htmlContent.match(/"externalId":"([^"]+)"/)?.[1];
      // 채널 이름 추출
      let channelName = htmlContent.match(
        /<title>(.*?)(?:\s*-\s*YouTube)?<\/title>/
      )?.[1];
      if (channelName) {
        channelName = this.decodeHtmlEntities(channelName);
      }

      if (!channelId || !channelName) {
        return {
          isValid: false,
          error: "YouTube 채널 정보를 가져올 수 없습니다.",
        };
      }

      return {
        isValid: true,
        channelId,
        channelName: channelName || "",
      };
    } catch (error) {
      console.error(error);
      return {
        isValid: false,
        error: "YouTube 채널 URL 검증 중 오류가 발생했습니다.",
      };
    }
  }

  public async validateRssUrl(url: string): Promise<{
    isValid: boolean;
    feedTitle?: string;
    error?: string;
  }> {
    try {
      const response = await this.fetcher(url);
      const xmlData = await response.text();

      // RSS 형식 검증
      const isRss =
        typeof xmlData === "string" &&
        (xmlData.includes("<rss") ||
          xmlData.includes("<feed") ||
          xmlData.includes("<channel>") ||
          (xmlData.includes("<?xml") &&
            (xmlData.includes("<rss") || xmlData.includes("<feed"))));

      if (!isRss) {
        return {
          isValid: false,
          error: "유효한 RSS 피드가 아닙니다.",
        };
      }

      // 피드 제목 추출
      let title = xmlData.match(/<title(?:\s+[^>]*)?>(.*?)<\/title>/)?.[1];
      // CDATA 처리
      if (title && title.includes("<![CDATA[")) {
        title = title.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1");
      }
      // HTML 엔티티 디코딩
      if (title) {
        title = this.decodeHtmlEntities(title);
      }

      if (!title) {
        return {
          isValid: false,
          error: "RSS 피드 제목을 찾을 수 없습니다.",
        };
      }

      return {
        isValid: true,
        feedTitle: title || "",
      };
    } catch (error) {
      console.error(error);
      return {
        isValid: false,
        error: "RSS URL 검증 중 오류가 발생했습니다.",
      };
    }
  }

  private decodeHtmlEntities(text: string): string {
    const entities: { [key: string]: string } = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
      "&#x2F;": "/",
      "&#x60;": "`",
      "&#x3D;": "=",
    };
    return text.replace(/&[^;]+;/g, (entity) => entities[entity] || entity);
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
