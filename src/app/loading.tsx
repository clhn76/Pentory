import { Loader2Icon } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-full h-[100dvh] flex items-center justify-center">
      <Loader2Icon className="size-6 animate-spin" />
    </div>
  );
};

export default Loading;
