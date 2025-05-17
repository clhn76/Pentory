import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

interface LambdaResponse {
  statusCode: number;
  headers: { "Content-Type": "application/json" };
  body: string;
}

interface SummaryUrlResponse {
  thumbnailUrl: string;
  result: string;
}

class AWSManager {
  private static instance: AWSManager;
  private lambdaClient: LambdaClient;

  constructor() {
    this.lambdaClient = new LambdaClient({
      region: "ap-northeast-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });
  }

  public static getInstance(): AWSManager {
    if (!AWSManager.instance) {
      AWSManager.instance = new AWSManager();
    }
    return AWSManager.instance;
  }

  public async runLambdaSpaceSummary(spaceId: string) {
    try {
      const command = new InvokeCommand({
        FunctionName: process.env.LAMBDA_FUNCTION_NAME || "",
        InvocationType: "Event", // 비동기 실행을 위해 Event로 설정
        Payload: JSON.stringify({ type: "SUMMARY_SPACE", body: { spaceId } }),
      });

      await this.lambdaClient.send(command);
    } catch (error) {
      console.error("Lambda 실행 중 오류 발생:", error);
      throw error;
    }
  }

  public async runLambdaSummaryUrl(url: string) {
    try {
      const command = new InvokeCommand({
        FunctionName: process.env.LAMBDA_FUNCTION_NAME || "",
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({ type: "SUMMARY_URL", body: { url } }),
      });

      const response = await this.lambdaClient.send(command);
      const responsePayload = new TextDecoder().decode(response.Payload);
      const parsedResponse = JSON.parse(responsePayload) as LambdaResponse;

      return JSON.parse(parsedResponse.body) as SummaryUrlResponse;
    } catch (error) {
      console.error("Lambda 실행 중 오류 발생:", error);
      throw error;
    }
  }
}

export const awsManager = AWSManager.getInstance();
