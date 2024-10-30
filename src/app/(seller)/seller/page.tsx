"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/Dashboard/Overview";
import { useGetVendorRevenueQuery } from "@/services/apis";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import {
  currentMonthYear,
  currentYear,
  formatDateRange,
  formatMonth,
} from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
type ViewState = "month" | "year";
export default function DashboardPage() {
  const [orderView, setOrderView] = useState<ViewState>("month");
  const orderChartRef = useRef<ChartJS<"bar">>(null);
  const { data: orderData, isLoading: isOrderLoading } =
    useGetVendorRevenueQuery(
      orderView === "month"
        ? { month: currentMonthYear }
        : { year: currentYear }
    );
  const orders = orderData?.value || [];

  const getOrderChartData = () => ({
    labels: orders.map((item) =>
      orderView === "month"
        ? formatDateRange(item.startDate, item.endDate)
        : formatMonth(item.startDate)
    ),
    datasets: [
      {
        label: "Order Number",
        data: orders.map((item) => item.orderNumber),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
      {
        label: "Total Amount",
        data: orders.map((item) => item.totalAmount),
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 1,
      },
    ],
  });

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true } },
  };

  useEffect(() => {
    const handleResize = () => {
      orderChartRef.current?.resize();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="">
      <div className="">
        <Card className="bg-white shadow-lg rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Orders Overview
            </CardTitle>
            <ToggleGroup
              type="single"
              value={orderView}
              onValueChange={(value: ViewState) => value && setOrderView(value)}
              className="border rounded-md"
            >
              <ToggleGroupItem value="month" className="px-3 py-1 text-sm">
                Month
              </ToggleGroupItem>
              <ToggleGroupItem value="year" className="px-3 py-1 text-sm">
                Year
              </ToggleGroupItem>
            </ToggleGroup>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              {isOrderLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <Bar
                  ref={orderChartRef}
                  options={chartOptions}
                  data={getOrderChartData()}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
