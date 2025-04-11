import { TRPCError } from "@trpc/server";

// 메서드 데코레이터 함수
export const tRPCErrorHandler = (errorInfo: string) => {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // 원본 메서드 저장
    const originalMethod = descriptor.value;

    // 새로운 메서드 정의
    descriptor.value = async function (...args: unknown[]) {
      try {
        // 원본 메서드 실행
        return await originalMethod.apply(this, args);
      } catch (error) {
        console.error(`❌ ${errorInfo} error:`, error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "알 수 없는 오류",
        });
      }
    };

    return descriptor;
  };
};
