import { Innertube, YTNodes } from "youtubei.js";
import { TopContent } from "./types";

class YoutubeService {
  private static instance: YoutubeService;

  private constructor() {}

  public static getInstance(): YoutubeService {
    if (!YoutubeService.instance) {
      YoutubeService.instance = new YoutubeService();
    }
    return YoutubeService.instance;
  }

  public async getContentDataFromUrl(url: string) {
    const videoId = this.getVideoIdFromUrl(url);
    const innertube = await Innertube.create();
    const video = await innertube.getInfo(videoId);
    const transcript = await video.getTranscript();
    const fullScript = transcript.transcript.content?.body?.initial_segments
      .map((segment) => segment.snippet.text)
      .join(" ");
    const title = video.basic_info.title || "";
    const description = video.basic_info.short_description || "";
    const keywords = video.basic_info.keywords || [];
    const thumbnailUrl = this.getThumbnailUrl(url);
    return {
      title,
      description,
      content: fullScript || "",
      keywords,
      thumbnailUrl,
    };
  }

  public async searchVideos(keyword: string, limit: number = 10) {
    const innertube = await Innertube.create({
      location: "KR",
    });
    const searchResults = await innertube.search(keyword, { type: "video" });
    const videos = searchResults.videos
      .filter((video) => video.is(YTNodes.Video))
      .slice(0, limit);
    return videos;
  }

  public async getTopYoutubeContents(keyword: string, limit: number = 10) {
    const innertube = await Innertube.create();
    const searchResults = await innertube.search(keyword, { type: "video" });
    const videos = searchResults.videos
      .filter(
        (video) => video.is(YTNodes.Video) && video.duration.seconds > 180 // 3분이상
      )
      .slice(0, limit) as YTNodes.Video[];

    const videoPromises = videos.map(async (video) => {
      const topContent: TopContent = {
        title: video.title.text || "",
        description: video.description || "",
        thumbnailImage: this.getThumbnailUrl(
          this.getUrlFromVideoId(video.video_id)
        ),
        author: {
          name: video.author.name || "",
          profileImage: video.author.thumbnails[0].url || "",
        },
        publishDate: video.published?.toString() || "",
        url: this.getUrlFromVideoId(video.video_id),
      } as TopContent;

      return topContent;
    });

    return Promise.all(videoPromises);
  }

  public async getLatestChannelVideoUrls(
    youtubeChannelId: string
  ): Promise<string[]> {
    const innertube = await Innertube.create();
    const channel = await innertube.getChannel(youtubeChannelId);
    const latestVideos = (await channel.getVideos()).videos;
    return latestVideos
      .filter((video) => video.is(YTNodes.Video))
      .map((video) => this.getUrlFromVideoId(video.video_id));
  }

  public checkIsYoutubeUrl(url: string) {
    const youtubePattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    const isYoutubeUrl = youtubePattern.test(url.toString());
    return isYoutubeUrl;
  }

  public getThumbnailUrl(url: string): string {
    const videoId = this.getVideoIdFromUrl(url);
    return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
  }

  private getUrlFromVideoId(videoId: string): string {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    return url;
  }

  private getVideoIdFromUrl(url: string): string {
    // youtu.be 형식의 URL 처리
    if (url.includes("youtu.be")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return videoId || "";
    }

    // youtube.com 형식의 URL 처리
    const vParam = url.split("v=")[1];
    if (!vParam) return "";
    const videoId = vParam.split(/[&#]/)[0];
    return videoId;
  }
}

export const youtubeService = YoutubeService.getInstance();
