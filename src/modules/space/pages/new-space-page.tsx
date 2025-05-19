import { BackButton } from "@/components/common/back-button";
import { SpaceForm } from "../components/space-form";
import { SPACE_HREF_PREFIX } from "../config";

export const NewSpacePage = () => {
  return (
    <div className="container max-w-screen-md mx-auto space-y-6">
      <div className="space-y-3">
        <BackButton href={SPACE_HREF_PREFIX.MY} />
        <h1 className="title">새 스페이스 만들기</h1>
      </div>

      <SpaceForm />
    </div>
  );
};
