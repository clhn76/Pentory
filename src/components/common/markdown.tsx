import { marked } from "marked";

interface MarkdownProps {
  children?: string | null;
}

export const Markdown = ({ children }: MarkdownProps) => {
  if (!children) return null;

  const html = marked(children);

  return (
    <div
      className="prose dark:prose-invert max-w-none  "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
