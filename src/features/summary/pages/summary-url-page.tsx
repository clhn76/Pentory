"use client";

// import {
//   SummaryUrlForm,
//   SummaryUrlFormValues,
// } from "../components/summary-url-form";

export const SummaryUrlPage = () => {
  // const handleSubmit = async (values: SummaryUrlFormValues) => {
  //   const response = await fetch("/api/summary", {
  //     method: "POST",
  //     body: JSON.stringify(values),
  //   });

  //   // const reader = response.body?.getReader();
  // };

  return (
    <div className="container py-12 md:py-24 h-full flex flex-col items-center">
      <h1 className="text-2xl md:text-4xl font-bold mb-2">URL 요약</h1>
      <p className="text-center text-base md:text-lg text-muted-foreground mb-6 tracking-tight">
        유튜브, 블로그, 뉴스 등의 URL 주소만으로 콘텐츠의 핵심내용을 요약 정리해
        드립니다.
      </p>
      {/* <SummaryUrlForm onSubmit={handleSubmit} disabled={summaryUrl.isPending} /> */}
    </div>
  );
};
