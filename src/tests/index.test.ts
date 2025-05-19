import { htmlParsingService } from "@/services/html-parsing-service";
import { test, expect } from "vitest";

test("html-parser", async () => {
  const url =
    "https://engineering.fb.com/2025/05/15/developer-tools/introducing-pyrefly-a-new-type-checker-and-ide-experience-for-python/";

  const contentData = await htmlParsingService.getContentDataFromUrl(url);
  console.log(contentData);
  expect(contentData).toBeDefined();
});
