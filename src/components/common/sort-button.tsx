"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SortButtonProps<T extends string> {
  active: boolean;
  label: string;
  value: T;
  onClick: (value: T) => void;
}

export const SortButton = <T extends string>({
  active,
  label,
  value,
  onClick,
}: SortButtonProps<T>) => {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      className={cn(
        "rounded-full transition-all border",
        active ? "text-primary-foreground" : "text-muted-foreground"
      )}
      onClick={() => onClick(value)}
    >
      {label}
    </Button>
  );
};
