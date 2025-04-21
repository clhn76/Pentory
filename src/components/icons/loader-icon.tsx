import { cn } from "@/lib/utils";

interface LoaderIconProps {
  className?: string;
}

export const LoaderIcon = ({ className }: LoaderIconProps) => {
  return (
    <div
      className={cn(
        "w-6 h-6 border-t-2 border-r-2 border-primary rounded-full animate-spin",
        className
      )}
    ></div>
  );
};
