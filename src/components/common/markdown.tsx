import { marked } from "marked";

interface MarkdownProps {
  children?: string | null;
}

export const Markdown = ({ children }: MarkdownProps) => {
  if (!children) return null;

  // marked 설정 커스터마이징
  marked.setOptions({
    gfm: true,
    breaks: true,
    pedantic: false,
  });

  // 입력된 마크다운 텍스트에서 ** 주변 특수 문자를 처리하기 위한 로직
  const preprocessText = (text: string) => {
    // **' 또는 **" 패턴에서 따옴표 제거
    let processed = text.replace(/\*\*(['"])/g, "**");
    // '** 또는 "** 패턴에서 따옴표 제거
    processed = processed.replace(/(['"])\*\*/g, "**");
    return processed;
  };

  const html = marked(preprocessText(children));

  return (
    <div
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
