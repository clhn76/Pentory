import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const lambdaClient = new LambdaClient({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Lambda에 요약 요청
export const runLambdaSpaceSummary = async (spaceId: string) => {
  try {
    const command = new InvokeCommand({
      FunctionName: process.env.LAMBDA_FUNCTION_NAME || "",
      InvocationType: "Event", // 비동기 실행을 위해 Event로 설정
      Payload: JSON.stringify({ type: "SUMMARY_SPACE", body: { spaceId } }),
    });

    await lambdaClient.send(command);
  } catch (error) {
    console.error("Lambda 실행 중 오류 발생:", error);
    throw error;
  }
};
