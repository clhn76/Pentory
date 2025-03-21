import { HydrateClient, prefetch, trpc } from "@/server/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { UserInfo, UserInfoSkeleton } from "../_components/user-info";

export const dynamic = "force-dynamic";

const ProtectedPage = async () => {
  prefetch(trpc.sampleRouter.getUser.queryOptions());

  return (
    <HydrateClient>
      <div className="h-screen flex items-center justify-center text-muted-foreground">
        Protected Page
      </div>
      <ErrorBoundary fallback={<p>Error</p>}>
        <Suspense fallback={<UserInfoSkeleton />}>
          <UserInfo />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default ProtectedPage;
