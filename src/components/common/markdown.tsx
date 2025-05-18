import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  children?: string | null;
}

export const Markdown = ({ children }: MarkdownProps) => {
  if (!children) return null;

  return (
    <div className="prose prose-invert w-full max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
};
