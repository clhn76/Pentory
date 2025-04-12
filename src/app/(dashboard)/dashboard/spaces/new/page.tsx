import { SpaceForm } from "@/components/space/space-form";

const NewSpacePage = () => {
  return (
    <div className="container max-w-screen-md mx-auto space-y-6">
      <h1 className="title">새 스페이스 만들기</h1>
      <SpaceForm />
    </div>
  );
};

export default NewSpacePage;
