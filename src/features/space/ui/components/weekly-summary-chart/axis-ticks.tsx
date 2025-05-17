import { useCallback } from "react";
import { AxisTickProps, ChartDataItem } from "./chart-tooltips";

interface AxisTickComponentProps {
  chartData: ChartDataItem[];
}

export const useCustomDayXAxisTick = ({
  chartData,
}: AxisTickComponentProps) => {
  console.log(
    "useCustomDayXAxisTick 호출됨, chartData 길이:",
    chartData?.length
  );

  return useCallback(
    (props: AxisTickProps) => {
      const { x, y, payload } = props;
      const isCurrentDay = chartData[payload.index]?.isToday;

      console.log("Axis tick props:", {
        index: payload.index,
        value: payload.value,
        isCurrentDay,
      });

      return (
        <g transform={`translate(${x},${y})`}>
          <text
            x={0}
            y={0}
            dy={16}
            textAnchor="end"
            fill={isCurrentDay ? "#8884d8" : "#666"}
            fontSize={11}
            fontWeight={isCurrentDay ? "bold" : "normal"}
            transform="rotate(-45)"
          >
            <tspan>{payload.value}</tspan>
          </text>
        </g>
      );
    },
    [chartData]
  );
};

export const useCustomWeekdayXAxisTick = () => {
  return useCallback((props: AxisTickProps) => {
    const { x, y, payload } = props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#666"
          fontSize={12}
          fontWeight="normal"
        >
          {payload.value}
        </text>
      </g>
    );
  }, []);
};
