import { SpaceSummaryDialog } from "../components/space-summaries/space-summary-dialog";

interface SpaceLayoutProps {
  children: React.ReactNode;
}

export const SpaceLayout = ({ children }: SpaceLayoutProps) => {
  return (
    <div>
      {children}
      <SpaceSummaryDialog />
    </div>
  );
};
