import { processSubscriptionSchedules } from "@/services/subscription-service";
import { NextResponse } from "next/server";

// 구독 스케쥴 처리 cron job
export async function GET() {
  try {
    await processSubscriptionSchedules();

    return NextResponse.json(
      {
        success: true,
        message: "구독 스케쥴 처리 완료",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(`❌ 구독 스케쥴 처리 실패: `, error);
    return NextResponse.json(
      {
        success: false,
        message: "구독 스케쥴 처리 실패",
      },
      { status: 500 }
    );
  }
}
