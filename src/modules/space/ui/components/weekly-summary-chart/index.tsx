"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import {
  eachDayOfInterval,
  format,
  isToday,
  parseISO,
  subDays,
} from "date-fns";
import { ko } from "date-fns/locale";
import { useCallback, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import { useCustomDayXAxisTick } from "./axis-ticks";
import { ChartDataItem, useDayTooltip } from "./chart-tooltips";
import { ControlPanel } from "./control-panel";

export const WeeklySummaryChart = () => {
  const trpc = useTRPC();
  const [searchTerm, setSearchTerm] = useState("");
  const [displayMode, setDisplayMode] = useState<"all" | "top">("top");
  const [topCount, setTopCount] = useState<number>(6);
  const [showOthers, setShowOthers] = useState<boolean>(true);
  const isMobile = useIsMobile();

  // 모바일 여부에 따라 데이터 기간 결정 (모바일: 7일, PC: 14일)
  const dataPeriod = useMemo(() => (isMobile ? 7 : 14), [isMobile]);

  // useQuery 옵션 메모이제이션 (불필요한 리렌더링 방지)
  const summaryQueryOptions = useMemo(
    () =>
      trpc.spaceRouter.getDailySummaryCounts.queryOptions({
        days: dataPeriod,
      }),
    [trpc.spaceRouter.getDailySummaryCounts, dataPeriod]
  );

  const spacesQueryOptions = useMemo(
    () => trpc.spaceRouter.getSpaces.queryOptions(),
    [trpc.spaceRouter.getSpaces]
  );

  // 쿼리 데이터 로딩 (일반 쿼리로 변경)
  const { data: summaries, isLoading: isSummariesLoading } =
    useQuery(summaryQueryOptions);
  const { data: spaces, isLoading: isSpacesLoading } =
    useQuery(spacesQueryOptions);

  // 로딩 상태 확인
  const isLoading =
    isSummariesLoading || isSpacesLoading || !summaries || !spaces;

  // 스페이스 ID와 이름 매핑
  const spaceMap = useMemo(() => {
    if (!spaces) return new Map();
    return new Map(spaces.map((space) => [space.id, space.name]));
  }, [spaces]);

  // 색상 배열 - 각 스페이스별로 다른 색상 적용
  const colors = useMemo(
    () => [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff7300",
      "#0088fe",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
      "#a4de6c",
      "#d0ed57",
    ],
    []
  );

  // 툴팁 훅 사용
  const DayTooltip = useDayTooltip({ spaceMap });

  // 범례 formatter 함수
  const legendFormatter = useCallback(
    (value: string) => {
      if (value === "others") return "기타";
      return spaceMap.get(value) || value;
    },
    [spaceMap]
  );

  // 차트 데이터 계산
  const chartData = useMemo(() => {
    if (!summaries || !spaces) return [];

    // 설정된 기간 기준일 계산
    const today = new Date();
    const startDate = subDays(today, dataPeriod);

    // 설정된 기간의 모든 날짜 생성
    const allDaysInPeriod = eachDayOfInterval({
      start: startDate,
      end: today,
    });

    // 모든 날짜에 대한 기본 데이터 맵 생성
    const dateCountMap = new Map<string, ChartDataItem>();

    // 날짜별 기본 객체 초기화
    allDaysInPeriod.forEach((date) => {
      const dateKey = format(date, "yyyy-MM-dd");

      // 기본 데이터 객체 생성
      const dataObj: ChartDataItem = {
        date,
        formattedDate: format(date, "MM.dd (EEE)", { locale: ko }),
        fullDate: format(date, "yyyy년 MM월 dd일 (EEE)", { locale: ko }),
        isToday: isToday(date),
        total: 0,
      };

      dateCountMap.set(dateKey, dataObj);
    });

    // 스페이스 ID 세트 (중복 연산 방지)
    const spaceIds = new Set(spaces.map((space) => space.id));

    // API에서 받은 데이터로 카운트 업데이트
    summaries.forEach((summary) => {
      // 데이터베이스에서 반환된 날짜 처리
      const summaryDate = parseISO(summary.day);

      const dateKey = format(summaryDate, "yyyy-MM-dd");
      const dateData = dateCountMap.get(dateKey);

      if (dateData && summary.spaceId && spaceIds.has(summary.spaceId)) {
        const count = Number(summary.count);

        // 해당 스페이스가 아직 초기화되지 않았으면 초기화
        if (dateData[summary.spaceId] === undefined) {
          dateData[summary.spaceId] = 0;
        }

        // 해당 스페이스의 카운트 업데이트
        dateData[summary.spaceId] = count;

        // 총계 업데이트
        dateData.total = (dateData.total as number) + count;
      }
    });

    // 맵을 배열로 변환하고 날짜순 정렬
    return Array.from(dateCountMap.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  }, [summaries, spaces, dataPeriod]);

  // 필터링된 스페이스 계산
  const filteredSpaces = useMemo(() => {
    if (!spaces) return [];
    if (!searchTerm) return spaces;

    return spaces.filter((space) =>
      space.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [spaces, searchTerm]);

  // 스페이스 활동 총합 계산 (상위 N개 선택용)
  const spaceActivityTotals = useMemo(() => {
    if (!summaries || !spaceMap) return [];

    const totals = new Map<string, number>();

    summaries.forEach((summary) => {
      const spaceId = summary.spaceId;
      const count = Number(summary.count);

      totals.set(spaceId, (totals.get(spaceId) || 0) + count);
    });

    return Array.from(totals.entries())
      .map(([id, total]) => ({ id, total, name: spaceMap.get(id) || id }))
      .sort((a, b) => b.total - a.total);
  }, [summaries, spaceMap]);

  // 차트에 표시할 스페이스 ID 선택
  const selectedSpaceIds = useMemo(() => {
    if (!filteredSpaces || !spaceActivityTotals) return [];

    if (displayMode === "all") {
      return filteredSpaces.map((space) => space.id);
    } else {
      // 상위 N개 스페이스 선택
      return spaceActivityTotals.slice(0, topCount).map((space) => space.id);
    }
  }, [displayMode, filteredSpaces, spaceActivityTotals, topCount]);

  // 기타 카테고리 계산 (일별 데이터)
  const processedChartData = useMemo(() => {
    if (!chartData || !spaces || !selectedSpaceIds) return [];

    if (!showOthers || displayMode === "all") {
      return chartData;
    }

    // 선택된 스페이스 ID 세트
    const selectedIds = new Set(selectedSpaceIds);

    // 각 날짜별로 '기타' 카테고리 계산
    return chartData.map((dayData) => {
      const newData = { ...dayData };
      let othersTotal = 0;

      // 모든 스페이스 ID를 순회하며 '기타' 카테고리에 추가할 값 계산
      spaces.forEach((space) => {
        if (!selectedIds.has(space.id)) {
          const value = Number(dayData[space.id] || 0);
          othersTotal += value;
          // 원래 값 제거 (메모리 최적화)
          delete newData[space.id];
        }
      });

      // '기타' 카테고리 추가
      if (othersTotal > 0) {
        newData["others"] = othersTotal;
      }

      return newData;
    });
  }, [chartData, selectedSpaceIds, spaces, showOthers, displayMode]);

  // 여기에 customDayXAxisTick 추가
  const customDayXAxisTick = useCustomDayXAxisTick({
    chartData: processedChartData,
  });

  // 차트에 표시할 요소 배열
  const chartElements = useMemo(() => {
    if (!selectedSpaceIds) return [];

    const elements = [...selectedSpaceIds];

    // 기타 카테고리 추가
    if (showOthers && displayMode === "top") {
      elements.push("others");
    }

    return elements;
  }, [selectedSpaceIds, showOthers, displayMode]);

  // 각 요소에 대한 색상 결정
  const getElementColor = useCallback(
    (elementId: string, index: number) => {
      if (elementId === "others") return "#999999";
      return colors[index % colors.length];
    },
    [colors]
  );

  // 차트 컴포넌트 메모이제이션
  const chartComponent = useMemo(() => {
    const isEmpty = !processedChartData || processedChartData.length === 0;

    if (isEmpty) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          일별 요약 데이터가 없습니다.
        </div>
      );
    }

    return (
      <BarChart data={processedChartData} barSize={20} barGap={1}>
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={true}
          vertical={false}
          stroke="rgba(127,127,127,0.2)"
        />
        <XAxis
          dataKey="formattedDate"
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
          tick={customDayXAxisTick}
        />
        <YAxis width={30} tick={{ fontSize: 12 }} />
        <Tooltip
          content={<DayTooltip />}
          cursor={{ fill: "rgba(0, 0, 0, 0.3)" }}
        />
        <Legend
          verticalAlign="bottom"
          formatter={legendFormatter}
          iconSize={8}
          iconType="circle"
        />
        {chartElements.map((elementId, index) => (
          <Bar
            key={elementId}
            dataKey={elementId}
            stackId="a"
            name={
              elementId === "others"
                ? "기타"
                : spaceMap.get(elementId) || elementId
            }
            fill={getElementColor(elementId, index)}
          />
        ))}
      </BarChart>
    );
  }, [
    processedChartData,
    customDayXAxisTick,
    DayTooltip,
    legendFormatter,
    chartElements,
    spaceMap,
    getElementColor,
  ]);

  // 로딩 중이면 스켈레톤 표시
  if (isLoading) {
    return <WeeklySummaryChartSkeleton />;
  }

  return (
    <Card className="gap-4 ">
      <CardHeader>
        <CardTitle className="text-base font-medium">신규 요약 통계</CardTitle>
        <CardDescription>
          최근 {dataPeriod}일간의 스페이스별 요약 생성 수
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ControlPanel
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          topCount={topCount}
          setTopCount={setTopCount}
          showOthers={showOthers}
          setShowOthers={setShowOthers}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <div className="w-full h-[280px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {chartComponent}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const WeeklySummaryChartSkeleton = () => {
  return (
    <Card className="gap-4 bg-card dark:bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          <Skeleton className="h-6 w-40 bg-zinc-200 dark:bg-zinc-800" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64 mt-1 bg-zinc-200 dark:bg-zinc-800" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* 컨트롤 패널 스켈레톤 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Skeleton className="h-9 w-28 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-9 w-36 bg-zinc-200 dark:bg-zinc-800" />
          <div className="ml-auto">
            <Skeleton className="h-9 w-28 bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>

        {/* 차트 스켈레톤 */}
        <div className="w-full h-[280px] mt-4 bg-zinc-100 dark:bg-zinc-900 relative">
          {/* 격자 라인 */}
          <div className="absolute inset-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-full border-t border-dashed border-zinc-200 dark:border-zinc-800"
                style={{ top: `${20 + i * 15}%` }}
              />
            ))}
          </div>

          {/* Y축 값 스켈레톤 */}
          <div className="absolute top-8 left-2 bottom-16 flex flex-col justify-between">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-4 w-8 bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>

          {/* 막대 그래프 스켈레톤 - 단일 색상으로 변경 */}
          <div className="absolute inset-0 px-12 pt-8 pb-16">
            <div className="h-full flex items-end justify-between">
              {/* 날짜별 막대 위치 생성 - 데스크탑에서는 더 많은 날짜 표시 */}
              {Array.from({ length: 20 }).map((_, i) => {
                // 랜덤 높이 생성
                const randomHeight = Math.random();
                // 더 많은 막대 표시 (약 70%의 막대 표시)
                const showBar =
                  i === 10 ||
                  i === 11 ||
                  i === 13 ||
                  i === 16 ||
                  i === 18 ||
                  Math.random() > 0.3;
                const barHeight =
                  i === 10
                    ? 180 // 특별히 큰 막대
                    : i === 16
                    ? 130 // 두 번째로 큰 막대
                    : i === 11
                    ? 80 // 중간 크기 막대
                    : i === 18
                    ? 60 // 중간 크기 막대
                    : i === 13
                    ? 40 // 작은 막대
                    : Math.floor(randomHeight * 50) + 5; // 나머지 랜덤 높이

                return (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-end h-full"
                    style={{ width: "3%" }}
                  >
                    {showBar && (
                      <Skeleton
                        className={`w-4/6 bg-zinc-300 dark:bg-zinc-700`}
                        style={{ height: `${barHeight}px` }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* X축 라벨 스켈레톤 */}
          <div className="absolute bottom-2 left-12 right-2 flex justify-between">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ width: "3%" }}>
                <Skeleton
                  className="h-3 w-10 origin-top-left -rotate-45 ml-1 bg-zinc-200 dark:bg-zinc-800"
                  style={{ transformOrigin: "left top" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 범례 스켈레톤 - 단일 항목으로 변경 */}
        <div className="mt-2 flex justify-center">
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <Skeleton className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
