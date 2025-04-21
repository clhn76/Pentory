import { Logo } from "@/components/common/logo";
import { LoaderIcon } from "@/components/icons/loader-icon";

const Loading = () => {
  return (
    <div className="w-full h-[100dvh] flex flex-col items-center justify-center gap-6">
      <Logo disabled />
      <LoaderIcon />
    </div>
  );
};

export default Loading;
