import { caller } from "@/trpc/server";
import * as PortOne from "@portone/server-sdk";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const rawBody = await request.text();

    // 웹훅 검증
    const webhook = await PortOne.Webhook.verify(
      process.env.PORTONE_WEBHOOK_SECRET!,
      rawBody,
      Object.fromEntries(request.headers)
    );

    // 결제 검증 처리
    if ("data" in webhook && "paymentId" in webhook.data) {
      await caller.paymentRouter.processWebhookVerification({
        paymentId: webhook.data.paymentId,
      });
    }

    return NextResponse.json({
      success: true,
      message: "결제 검증 처리 완료",
    });
  } catch (error) {
    console.error(`❌ /api/webhook/portone error:`, error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 }
    );
  }
};
