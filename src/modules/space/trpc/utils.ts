// Lambda에 요약 요청
export const runLambdaSpaceSummary = (spaceId: string) => {
  fetch(`${process.env.LAMBDA_URL}/summary/space`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ spaceId }),
  });
};
