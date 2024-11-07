"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { DashboardAmount } from "@/types";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function SubscriptionBreakdownChart({
  totalData,
}: {
  totalData: DashboardAmount;
}) {
  const chartData = {
    labels: ["Free Subscriptions", "Paid Subscriptions"],
    datasets: [
      {
        data: [
          totalData?.totalFreeSubscription || 0,
          totalData?.totalBuySubscription || 0,
        ],
        backgroundColor: [
          "rgb(147, 155, 255)", // Soft purple for free
          "rgb(72, 199, 142)", // Soft green for paid
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 20,
      },
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 13,
            family: "Inter, sans-serif",
          },
        },
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        color: "#fff",
        font: {
          size: 13,
          family: "Inter, sans-serif",
          weight: "500",
        },
        formatter: (value: number, ctx: any) => {
          const dataset = ctx.chart.data.datasets[0];
          const total = dataset.data.reduce(
            (acc: number, data: number) => acc + data,
            0
          );
          const percentage = ((value / total) * 100).toFixed(1);
          return `${value}\n(${percentage}%)`;
        },
        textAlign: "center",
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
        borderRadius: 2,
      },
    },
    cutout: "0%",
  };

  return (
    <Card className="bg-white rounded-xl border-none shadow-sm">
      <CardContent>
        <div className="h-[300px] w-full">
          <Pie data={chartData} options={options as any} />
        </div>
      </CardContent>
    </Card>
  );
}
