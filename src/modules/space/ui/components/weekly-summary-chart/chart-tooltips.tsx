import { TooltipProps } from "recharts";
import { useCallback } from "react";

// 차트 데이터 인터페이스
export interface ChartDataItem {
  date: Date;
  formattedDate: string;
  fullDate: string;
  isToday: boolean;
  total: number;
  [spaceId: string]: string | number | boolean | Date;
}

// 요일별 데이터 인터페이스
export interface WeekdayDataItem {
  weekday: number;
  weekdayName: string;
  formattedDay: string;
  total: number;
  [spaceId: string]: string | number;
}

// 툴크 props 타입 정의
export type CustomTooltipProps = TooltipProps<number, string> & {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
    payload: ChartDataItem;
  }>;
};

// X축 tick 타입 정의
export interface AxisTickProps {
  x: number;
  y: number;
  payload: {
    value: string;
    index: number;
  };
}

interface TooltipComponentProps {
  spaceMap: Map<string, string>;
}

export const useDayTooltip = ({ spaceMap }: TooltipComponentProps) => {
  return useCallback(
    ({ active, payload }: CustomTooltipProps) => {
      if (!active || !payload || payload.length === 0) return null;

      const date = payload[0].payload.fullDate;
      const isCurrentDay = payload[0].payload.isToday;

      return (
        <div className="bg-background border rounded-md p-2 shadow-sm">
          <p className="font-medium text-sm">
            {date}
            {isCurrentDay && (
              <span className="ml-1 text-sm text-primary">(오늘)</span>
            )}
          </p>
          <div className="mt-1 max-h-[200px] overflow-y-auto">
            {payload.map((entry, index) => {
              // null 병합 연산자로 undefined 방지
              let spaceName = "알 수 없음";

              if (entry.dataKey === "others") {
                spaceName = "기타";
              } else if (typeof entry.dataKey === "string") {
                spaceName = spaceMap.get(entry.dataKey) || entry.dataKey;
              }

              return (
                <p key={index} className="text-xs py-0.5 flex items-center">
                  <span
                    className="inline-block w-2 h-2 mr-1"
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <span className="truncate max-w-[120px]">{spaceName}</span>
                  <span className="ml-auto font-medium">{entry.value}개</span>
                </p>
              );
            })}
          </div>
        </div>
      );
    },
    [spaceMap]
  );
};

export const useWeekdayTooltip = ({ spaceMap }: TooltipComponentProps) => {
  return useCallback(
    ({ active, payload }: CustomTooltipProps) => {
      if (!active || !payload || payload.length === 0) return null;

      const day = payload[0].payload.formattedDay;

      return (
        <div className="bg-background border rounded-md p-2 shadow-sm">
          <p className="font-medium text-sm">{day}</p>
          <div className="mt-1 max-h-[200px] overflow-y-auto">
            {payload.map((entry, index) => {
              if (
                entry.dataKey === "weekday" ||
                entry.dataKey === "weekdayName" ||
                entry.dataKey === "formattedDay" ||
                entry.dataKey === "total"
              ) {
                return null;
              }

              // null 병합 연산자로 undefined 방지
              let spaceName = "알 수 없음";

              if (entry.dataKey === "others") {
                spaceName = "기타";
              } else if (typeof entry.dataKey === "string") {
                spaceName = spaceMap.get(entry.dataKey) || entry.dataKey;
              }

              return (
                <p key={index} className="text-xs py-0.5 flex items-center">
                  <span
                    className="inline-block w-2 h-2 mr-1"
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <span className="truncate max-w-[120px]">{spaceName}</span>
                  <span className="ml-auto font-medium">{entry.value}개</span>
                </p>
              );
            })}
          </div>
        </div>
      );
    },
    [spaceMap]
  );
};
