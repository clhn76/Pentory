import * as cheerio from "cheerio";

export interface TopContent {
  title: string;
  description: string;
  thumbnailImage: string;
  author: {
    name: string;
    profileImage: string;
  };
  publishDate: string;
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

  public async getTopNaverBlogContents(keyword: string) {
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
        profileImage:
          $userInfo.find(".user_thumb .thumb_link img").attr("src") || "",
      };

      // 작성일자
      const publishDate = $userInfo.find(".sub").text().trim();

      blogs.push({
        title,
        description,
        thumbnailImage,
        author,
        publishDate,
      });
    });

    return {
      query: keyword,
      totalResults: blogs.length,
      topContents: blogs,
    };
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
