"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  format,
  parse,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
} from "date-fns";
import { Bar } from "react-chartjs-2";
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
  ChartData,
} from "chart.js";
import { Users, CreditCard, Package, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetDashboardAmountQuery,
  useGetDashboardOrderQuery,
  useGetDashboardSubscriptionQuery,
} from "@/services/apis";
import { formatDateRange, formatMoney } from "@/utils";
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

// Move outside to avoid recreation
const getCurrentDateSelection = (): DateSelection => ({
  type: "month",
  value: format(new Date(), "MM-yyyy"),
});

// Add type safety for date selection
const DATE_TYPES = {
  MONTH: "month",
  YEAR: "year",
} as const;

type DateType = (typeof DATE_TYPES)[keyof typeof DATE_TYPES];

interface DateSelection {
  type: DateType;
  value: string;
}

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

const DateSelector = ({
  dateSelection,
  setDateSelection,
  label,
}: {
  dateSelection: DateSelection;
  setDateSelection: (selection: DateSelection) => void;
  label: string;
}) => {
  // Memoize options to prevent recalculation
  const { years, months } = useMemo(() => generateDateOptions(), []);

  const handleTypeChange = useCallback(
    (value: DateType) => {
      const currentDate = new Date();
      const newValue =
        value === DATE_TYPES.YEAR
          ? currentDate.getFullYear().toString()
          : format(currentDate, "MM-yyyy");

      setDateSelection({ type: value, value: newValue });
    },
    [setDateSelection]
  );

  const handleValueChange = useCallback(
    (value: string) => {
      setDateSelection({ type: dateSelection.type, value });
    },
    [dateSelection.type, setDateSelection]
  );

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">{label}:</span>
      <Select value={dateSelection.type} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select view" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={DATE_TYPES.MONTH}>Month</SelectItem>
          <SelectItem value={DATE_TYPES.YEAR}>Year</SelectItem>
        </SelectContent>
      </Select>
      <Select value={dateSelection.value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select date" />
        </SelectTrigger>
        <SelectContent>
          {dateSelection.type === DATE_TYPES.MONTH
            ? months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))
            : years.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const ChartCard = ({
  title,
  dateSelection,
  setDateSelection,
  chartData,
  isLoading,
  chartRef,
}: {
  title: string;
  dateSelection: DateSelection;
  setDateSelection: (selection: DateSelection) => void;
  chartData: ChartData<"bar">;
  isLoading: boolean;
  chartRef: React.RefObject<ChartJS<"bar">>;
}) => (
  <Card className="bg-white shadow-lg rounded-lg hover:shadow-xl transition duration-300 mb-6">
    <CardHeader className="flex justify-between items-center">
      <CardTitle className="text-xl font-semibold text-gray-800">
        {title}
      </CardTitle>
      <DateSelector
        dateSelection={dateSelection}
        setDateSelection={setDateSelection}
        label="View"
      />
    </CardHeader>
    <CardContent className="relative h-80">
      {isLoading ? (
        <Skeleton className="h-full w-full animate-pulse" />
      ) : (
        <Bar
          ref={chartRef}
          data={chartData as ChartData<"bar">}
          options={chartOptions}
        />
      )}
    </CardContent>
  </Card>
);

const generateDateOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const months = eachMonthOfInterval({
    start: startOfYear(new Date(currentYear, 0, 1)),
    end: endOfYear(new Date(currentYear, 0, 1)),
  });

  return {
    years: years.map((year) => ({
      value: year.toString(),
      label: year.toString(),
    })),
    months: months.map((month) => ({
      value: format(month, "MM-yyyy"),
      label: format(month, "MM-yyyy"),
    })),
  };
};

const chartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "top" } },
  scales: { y: { beginAtZero: true } },
};

const formatMonth = (date: string) => {
  return format(parse(date, "yyyy-MM-dd", new Date()), "MM-yyyy");
};

export default function AdminDashboard() {
  const [orderDateSelection, setOrderDateSelection] = useState<DateSelection>(
    getCurrentDateSelection()
  );
  const [subscriptionDateSelection, setSubscriptionDateSelection] =
    useState<DateSelection>(getCurrentDateSelection());
  const orderChartRef = useRef<ChartJS<"bar">>(null);
  const subscriptionChartRef = useRef<ChartJS<"bar">>(null);

  const { data: totalData, isLoading: isTotalLoading } =
    useGetDashboardAmountQuery();
  const { data: orderData, isLoading: isOrderLoading } =
    useGetDashboardOrderQuery(
      orderDateSelection.type === "month"
        ? { month: orderDateSelection.value }
        : { year: orderDateSelection.value }
    );
  const { data: subscriptionData, isLoading: isSubscriptionLoading } =
    useGetDashboardSubscriptionQuery(
      subscriptionDateSelection.type === "month"
        ? { month: subscriptionDateSelection.value }
        : { year: subscriptionDateSelection.value }
    );

  const orders = orderData?.value || [];

  const getOrderChartData = (): ChartData<"bar"> => ({
    labels: orders.map((item) =>
      orderDateSelection.type === "month"
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
    dateSelection: DateSelection
  ) => {
    const labelsMap = new Map<string, { [key: string]: number }>();

    data?.value?.forEach((item) => {
      const label =
        dateSelection.type === "month"
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

  const getSubscriptionChartData = (): ChartData<"bar"> => {
    const { labels, farmerData, officerData, merchantData } =
      aggregateSubscriptionData(subscriptionData, subscriptionDateSelection);

    return {
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
  };

  useEffect(() => {
    const handleResize = () => {
      orderChartRef.current?.resize();
      subscriptionChartRef.current?.resize();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="grid grid-cols-2 gap-6">
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
            title="Total Active Vendors"
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
        <Card className="bg-white shadow-lg rounded-lg hover:shadow-xl transition duration-300">
          <CardHeader>
            <CardTitle className="text-xl mx-auto font-semibold text-gray-800">
              Subscription Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionBreakdownChart
              totalData={totalData?.value as DashboardAmount}
            />
          </CardContent>
        </Card>
      </div>

      <ChartCard
        title="Subscriptions"
        dateSelection={subscriptionDateSelection}
        setDateSelection={setSubscriptionDateSelection}
        chartData={getSubscriptionChartData()}
        isLoading={isSubscriptionLoading}
        chartRef={subscriptionChartRef}
      />

      <ChartCard
        title="Orders"
        dateSelection={orderDateSelection}
        setDateSelection={setOrderDateSelection}
        chartData={getOrderChartData()}
        isLoading={isOrderLoading}
        chartRef={orderChartRef}
      />
    </div>
  );
}
