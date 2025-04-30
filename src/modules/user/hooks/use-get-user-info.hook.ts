import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetUserInfo = () => {
  const trpc = useTRPC();

  const { data: userInfo, isLoading } = useQuery(
    trpc.userRouter.getUserInfo.queryOptions()
  );

  const isUserSubscribedPlan =
    userInfo?.subscription && userInfo.subscription.status !== "CANCELLED";

  return { ...userInfo, isUserSubscribedPlan, isLoading };
};
