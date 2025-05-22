interface SpaceLayoutProps {
  summary: React.ReactNode;
  children: React.ReactNode;
}

export const SpaceLayout = ({ summary, children }: SpaceLayoutProps) => {
  return (
    <div>
      {children}
      {summary}
    </div>
  );
};
