'use client'

import { useState } from 'react';
import annotationPlugin from 'chartjs-plugin-annotation';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  PolarAreaController,
  RadialLinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar, Radar, Scatter } from 'react-chartjs-2';
import { sortLabeledScores } from '@/app/lib/scoring';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PolarAreaController,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
);

type LineWidth = number | ((context: any) => number);
type ChartColor = string | string[] | ((context: any) => string);

type HorizontalBarOptionsParams = {
  title: string;
  xMax: number;
  xStepSize: number;
  xMin?: number;
  xGridLineWidth?: LineWidth;
};

type SingleValueBarOptionsParams = {
  title: string;
  yMax: number;
  yStepSize: number;
  yMin?: number;
  yGridLineWidth?: LineWidth;
};

type BarChartDataParams = {
  labels: readonly string[];
  data: readonly number[];
  label?: string;
  backgroundColor?: ChartColor;
  borderColor?: ChartColor;
  borderWidth?: number;
  hoverBackgroundColor?: ChartColor;
  hoverBorderColor?: ChartColor;
  withHoverColors?: boolean;
};

type SortDirection = 'asc' | 'desc';

type UseSortedLabeledScoresParams = {
  labels: readonly string[];
  scores: readonly number[];
  direction: SortDirection;
};

type SortButtonProps = {
  isSorted: boolean;
  onToggle: () => void;
  defaultLabel: string;
  sortedLabel: string;
};

type BarChartProps = {
  data: ReturnType<typeof barChartData>;
  options: ReturnType<typeof horizontalBarOptions> | ReturnType<typeof singleValueBarOptions>;
  height: number;
};

export { Radar, Scatter };

export function useSortedLabeledScores({
  labels,
  scores,
  direction,
}: UseSortedLabeledScoresParams) {
  const [isSorted, setIsSorted] = useState(false);
  const sortedScores = sortLabeledScores(labels, scores, direction);
  const displayedLabels = isSorted ? sortedScores.map((score) => score.label) : [...labels];
  const displayedScores = isSorted ? sortedScores.map((score) => score.value) : [...scores];

  return {
    isSorted,
    displayedLabels,
    displayedScores,
    toggleSort: () => setIsSorted((current) => !current),
  };
}

export function SortButton({
  isSorted,
  onToggle,
  defaultLabel,
  sortedLabel,
}: SortButtonProps) {
  return (
    <button onClick={onToggle}>{isSorted ? defaultLabel : sortedLabel}</button>
  );
}

export function BarChart({
  data,
  height,
  options,
}: BarChartProps) {
  return (
    <div className="mx-auto max-w-min">
      <Bar
        data={data}
        height={height}
        options={options}
      />
    </div>
  );
}

export function horizontalBarOptions({
  title,
  xMax,
  xStepSize,
  xMin = 0,
  xGridLineWidth,
}: HorizontalBarOptionsParams) {
  return {
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 5,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        min: xMin,
        max: xMax,
        ticks: {
          stepSize: xStepSize,
        },
        ...(xGridLineWidth === undefined ? {} : {
          grid: {
            lineWidth: xGridLineWidth,
          },
        }),
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };
}

export function singleValueBarOptions({
  title,
  yMax,
  yStepSize,
  yMin = 0,
  yGridLineWidth = 2,
}: SingleValueBarOptionsParams) {
  return {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        min: yMin,
        max: yMax,
        ticks: {
          stepSize: yStepSize,
        },
        grid: {
          lineWidth: yGridLineWidth,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };
}

export function barChartData({
  labels,
  data,
  label = 'スコア',
  backgroundColor = 'rgba(255, 99, 132, 0.4)',
  borderColor = 'rgb(255, 99, 132)',
  borderWidth = 3,
  hoverBackgroundColor = 'rgba(80, 200, 200, 0.8)',
  hoverBorderColor = 'rgba(75, 192, 192, 1)',
  withHoverColors = true,
}: BarChartDataParams) {
  const dataset = {
    label,
    data: [...data],
    borderColor,
    backgroundColor,
    borderWidth,
    ...(withHoverColors ? {
      hoverBackgroundColor,
      hoverBorderColor,
    } : {}),
  };

  return {
    labels: [...labels],
    datasets: [dataset],
  };
}
