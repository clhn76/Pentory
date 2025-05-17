export type SpaceSummaryStyle = "DEFAULT" | "CUSTOM";

export interface Space {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
  userId?: string;
  user?: {
    name: string | null;
    image: string | null;
  } | null;
  summaryStyle?: SpaceSummaryStyle | null;
  customPrompt?: string | null;
  sources?: { length: number }[];
  summaries?: { length: number }[];
  sourceCount?: number;
  summaryCount?: number;
  isPublic?: boolean;
}
