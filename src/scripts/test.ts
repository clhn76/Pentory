import { htmlParsingService } from "@/services/html-parsing-service";

const test = async () => {
  const keyword = "디자인 잘하는 법";
  const result = await htmlParsingService.getTopNaverBlogContents(keyword);
  console.dir(result, { depth: null });
};

test();
