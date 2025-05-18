import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonalIcon } from "lucide-react";

export const ContentEnginePage = () => {
  return (
    <div className="h-full container flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <h1>키워드 하나로 경쟁 콘텐츠 분석부터 생성까지</h1>
        <div className="w-full relative">
          <Input className="rounded-full h-11" />
          <Button
            size="icon"
            disabled
            className="rounded-full absolute right-1 top-1/2 -translate-y-1/2"
          >
            <SendHorizonalIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};
