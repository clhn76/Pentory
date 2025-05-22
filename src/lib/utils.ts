import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 마크다운 문자열에서 최상위 제목과 순수 본문을 분리하여 추출합니다.
 * @param markdown 마크다운 형식의 문자열
 * @returns 최상위 제목과 순수 본문을 포함한 객체
 */
export const extractMarkdownContent = (
  markdown: string
): { title: string; content: string } => {
  // 최상위 제목(#) 추출
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : "";

  // 모든 제목(#, ##, ### 등) 제거
  const contentWithoutAllTitles = markdown.replace(/^#+\s.*$/gm, "");

  // 순수 본문 내용 추출 (앞뒤 공백 제거 및 연속된 빈 줄 정리)
  const content = contentWithoutAllTitles
    .trim()
    .replace(/\n\s*\n\s*\n/g, "\n\n");

  return { title, content };
};
