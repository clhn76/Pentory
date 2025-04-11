import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { MySpaces } from "./_components/my-spaces";

export const dynamic = "force-dynamic";

const DashboardPage = async () => {
  prefetch(trpc.spaceRouter.getSpaces.queryOptions());

  return (
    <HydrateClient>
      <div className="container">
        <MySpaces />
      </div>
    </HydrateClient>
  );
};

export default DashboardPage;
