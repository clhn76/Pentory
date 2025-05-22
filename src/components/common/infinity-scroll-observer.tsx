import { useEffect, useRef } from "react";
import { LoaderIcon } from "../icons/loader-icon";

interface InfinityScrollObserverProps {
  onIntersect: () => void;
  isFetching?: boolean;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export const InfinityScrollObserver = ({
  onIntersect,
  isFetching = false,
  threshold = 0.1,
  rootMargin = "0px",
  enabled = true,
}: InfinityScrollObserverProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current = observer;

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [onIntersect, threshold, rootMargin, enabled]);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-20 w-full">
        <LoaderIcon className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  return <div ref={targetRef} className="h-20 w-full" />;
};
