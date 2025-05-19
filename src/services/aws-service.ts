/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";

class AwsService {
  private static instance: AwsService;
  private readonly REGION = "ap-northeast-2";
  private readonly LAMBDA_FUNCTION_NAME = "Pentory";
  private lambdaClient: LambdaClient;

  private constructor() {
    this.lambdaClient = new LambdaClient({
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
    payload: { type: string; body: Record<string, any> },
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
}

export const awsService = AwsService.getInstance();
