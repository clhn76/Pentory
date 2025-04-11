import { Suspense } from "react";
import { SpacesGrid, SpacesGridSkeleton } from "./spaces-grid";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export const MySpaces = () => {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="title">내 스페이스</h2>
        <Link href="/dashboard/spaces/new">
          <Button size="lg">
            <PlusIcon className="w-4 h-4" />새 스페이스 만들기
          </Button>
        </Link>
      </div>

      <div className="mt-4">
        <Suspense fallback={<SpacesGridSkeleton />}>
          <SpacesGrid />
        </Suspense>
      </div>
    </section>
  );
};
