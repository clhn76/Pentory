import { aiService } from "@/services/ai-service";
import { awsService } from "@/services/aws-service";

const test = async () => {
  const prompt = "강아지 이미지랑, 고양이 이미지를 생성해주세요";

  const images = await aiService.generateImagesWithRetry({
    prompt,
  });

  if (!images) {
    return [];
  }

  // 이미지 업로드
  const uploadedImages = await Promise.all(
    images.map(async (image) => {
      // base64 문자열에서 실제 데이터 부분만 추출
      const base64Data = image.base64.includes(";base64,")
        ? image.base64.split(";base64,")[1]
        : image.base64;

      const buffer = Buffer.from(base64Data, "base64");
      const file = new File([buffer], `image-${Date.now()}.webp`, {
        type: "image/webp",
      });

      return awsService.uploadFileToS3(file);
    })
  );

  console.log(uploadedImages);
};

test();
