import { useSession } from "next-auth/react";

export const useGetUser = () => {
  const { data: session } = useSession();

  return session?.user;
};
