import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

// s3 사용을 위한 클라이언트 생성
export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
