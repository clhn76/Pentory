import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useGetUserInfo = () => {
  const trpc = useTRPC();

  const { data: userInfo } = useSuspenseQuery(
    trpc.userRouter.getUserInfo.queryOptions()
  );

  return userInfo;
};
