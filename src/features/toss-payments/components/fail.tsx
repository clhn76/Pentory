"use client";

import { useSearchParams } from "next/navigation";

export function FailPage() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">결제 실패</h2>
          <div className="space-y-2 text-left">
            <p className="text-gray-600">
              <span className="font-semibold">에러 코드:</span>{" "}
              <span className="text-red-500">{errorCode}</span>
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">실패 사유:</span>{" "}
              <span className="text-red-500">{errorMessage}</span>
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="이전 페이지로 돌아가기"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
