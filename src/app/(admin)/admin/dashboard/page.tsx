"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  CreditCard,
  Package,
  ShoppingBag,
  UserCheck,
} from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ArcElement,
} from "chart.js";
import {
  useGetDashboardAmountQuery,
  useGetDashboardOrderQuery,
  useGetDashboardSubscriptionQuery,
} from "@/services/apis";
import { format } from "date-fns";
import {
  currentMonthYear,
  currentYear,
  formatDateRange,
  formatMoney,
  formatMonth,
  ViewState,
} from "@/utils";
import SubscriptionBreakdownChart from "@/components/Admin/Chart/SubscriptionBreakdownChart";
import { DashboardAmount } from "@/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  const [orderView, setOrderView] = useState<ViewState>("month");
  const [subscriptionView, setSubscriptionView] = useState<ViewState>("month");
  const orderChartRef = useRef<ChartJS<"bar">>(null);
  const subscriptionChartRef = useRef<ChartJS<"bar">>(null);
  const customerChartRef = useRef<ChartJS<"pie">>(null);

  const { data: totalData, isLoading: isTotalLoading } =
    useGetDashboardAmountQuery();
  const { data: orderData, isLoading: isOrderLoading } =
    useGetDashboardOrderQuery(
      orderView === "month"
        ? { month: currentMonthYear }
        : { year: currentYear }
    );
  const { data: subscriptionData, isLoading: isSubscriptionLoading } =
    useGetDashboardSubscriptionQuery(
      subscriptionView === "month"
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

  const aggregateSubscriptionData = (
    data: typeof subscriptionData,
    view: ViewState
  ) => {
    const labelsMap = new Map<string, { [key: string]: number }>();

    data?.value?.forEach((item) => {
      const label =
        view === "month"
          ? formatDateRange(item.startDate, item.endDate)
          : formatMonth(item.startDate);
      if (!labelsMap.has(label)) {
        labelsMap.set(label, { "Nông Dân": 0, "Sĩ Quan": 0, "Thương Gia": 0 });
      }
      labelsMap.get(label)![item.subscriptionName] += parseInt(
        item.subscriptionNumber
      );
    });

    const labels = Array.from(labelsMap.keys());
    const farmerData = labels.map((label) => labelsMap.get(label)!["Nông Dân"]);
    const officerData = labels.map((label) => labelsMap.get(label)!["Sĩ Quan"]);
    const merchantData = labels.map(
      (label) => labelsMap.get(label)!["Thương Gia"]
    );

    return { labels, farmerData, officerData, merchantData };
  };

  const { labels, farmerData, officerData, merchantData } =
    aggregateSubscriptionData(subscriptionData, subscriptionView);

  const subscriptionChartData = {
    labels,
    datasets: [
      {
        label: "Nông Dân",
        data: farmerData,
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 1,
      },
      {
        label: "Sĩ Quan",
        data: officerData,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
      {
        label: "Thương Gia",
        data: merchantData,
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true } },
  };

  const customerChartData = {
    labels: ["Free Subscriptions", "Paid Subscriptions"],
    datasets: [
      {
        data: [
          totalData?.value?.totalFreeSubscription || 0,
          totalData?.value?.totalBuySubscription || 0,
        ],
        backgroundColor: ["rgba(59, 130, 246, 0.5)", "rgba(16, 185, 129, 0.5)"],
        borderColor: ["rgb(59, 130, 246)", "rgb(16, 185, 129)"],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (acc: number, data: number) => acc + data,
              0
            );
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  useEffect(() => {
    const handleResize = () => {
      orderChartRef.current?.resize();
      subscriptionChartRef.current?.resize();
      customerChartRef.current?.resize();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const SummaryCard = ({
    title,
    value,
    icon: Icon,
    isLoading,
  }: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    isLoading: boolean;
  }) => (
    <Card className="bg-white shadow-lg rounded-lg hover:shadow-xl transition duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24 animate-pulse" />
        ) : (
          <div className="text-2xl font-bold pt-2 text-gray-800">{value}</div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="flex gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-8 w-[50%]">
          <SummaryCard
            title="Total Revenue"
            value={formatMoney(totalData?.value?.totalRevenue || 0) + " VNĐ"}
            icon={Package}
            isLoading={isTotalLoading}
          />
          <SummaryCard
            title="Total Premium Customers"
            value={totalData?.value?.totalTransaction || 0}
            icon={CreditCard}
            isLoading={isTotalLoading}
          />
          <SummaryCard
            title="Total Vendors"
            value={totalData?.value?.totalVendor || 0}
            icon={Users}
            isLoading={isTotalLoading}
          />
          <SummaryCard
            title="Total Customers"
            value={totalData?.value?.totalCustomer || 0}
            icon={UserCheck}
            isLoading={isTotalLoading}
          />
        </div>

        <div className="w-[50%] mb-8">
          <SubscriptionBreakdownChart
            totalData={totalData?.value as DashboardAmount}
          />
        </div>
      </div>
      {/* Orders & Subscriptions Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-lg rounded-lg hover:shadow-xl transition duration-300">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Orders
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
          <CardContent className="relative h-80">
            {isOrderLoading ? (
              <Skeleton className="h-full w-full animate-pulse" />
            ) : (
              <Bar
                ref={orderChartRef}
                data={getOrderChartData()}
                options={chartOptions}
              />
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg rounded-lg hover:shadow-xl transition duration-300">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Subscriptions
            </CardTitle>
            <ToggleGroup
              type="single"
              value={subscriptionView}
              onValueChange={(value: ViewState) =>
                value && setSubscriptionView(value)
              }
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
          <CardContent className="relative h-80">
            {isSubscriptionLoading ? (
              <Skeleton className="h-full w-full animate-pulse" />
            ) : (
              <Bar
                ref={subscriptionChartRef}
                data={subscriptionChartData}
                options={chartOptions}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
