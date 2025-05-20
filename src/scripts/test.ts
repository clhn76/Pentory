import { pexelsService } from "@/services/pexels-service";

const test = async () => {
  const images = await pexelsService.searchPhoto("dog");
  console.log(images);
};

test();
