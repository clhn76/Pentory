/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

class AwsService {
  private static instance: AwsService;
  private readonly REGION = "ap-northeast-2";
  private readonly LAMBDA_FUNCTION_NAME = "Pentory";
  private readonly S3_BUCKET_NAME = "pentory";
  private readonly S3_BUCKET_URL = `https://${this.S3_BUCKET_NAME}.s3.${this.REGION}.amazonaws.com`;
  private lambdaClient: LambdaClient;
  private s3Client: S3Client;

  private constructor() {
    this.lambdaClient = new LambdaClient({
      region: this.REGION,
    });
    this.s3Client = new S3Client({
      region: this.REGION,
    });
  }

  public static getInstance(): AwsService {
    if (!AwsService.instance) {
      AwsService.instance = new AwsService();
    }
    return AwsService.instance;
  }

  public async invokeLambdaFunction(
    payload: {
      type: "SUMMARY_SPACE" | "SUMMARY_ALL" | "SUMMARY_ITEM";
      body: Record<string, any>;
    },
    invocationType: "Event" | "RequestResponse" = "Event"
  ) {
    const command = new InvokeCommand({
      FunctionName: this.LAMBDA_FUNCTION_NAME,
      InvocationType: invocationType,
      Payload: JSON.stringify(payload),
    });
    await this.lambdaClient.send(command).catch((err) => {
      console.error("❌ Error:", err);
    });
  }

  public async uploadFileToS3(file: File, path: string = "uploads") {
    const timestamp = new Date().toISOString().split("T")[0].replace(/-/g, "/");
    const key = `${path}/${timestamp}/${file.name}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: this.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    try {
      await this.s3Client.send(command);
      return `${this.S3_BUCKET_URL}/${key}`;
    } catch (error) {
      console.error("❌ S3 업로드 에러:", error);
      throw error;
    }
  }
}

export const awsService = AwsService.getInstance();
