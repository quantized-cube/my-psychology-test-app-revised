'use client'

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
};

export { Bar, Radar, Scatter };

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
}: BarChartDataParams) {
  return {
    labels: [...labels],
    datasets: [
      {
        label,
        data: [...data],
        borderColor,
        backgroundColor,
        borderWidth,
        hoverBackgroundColor,
        hoverBorderColor,
      },
    ],
  };
}
