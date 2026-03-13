"use client";
import { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  LineController,
  PointElement,
  Tooltip,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { format, parseISO, subDays } from "date-fns";
import { useAuth } from "@/hooks";
import { useOrderReports } from "@/hooks/useOrderReports";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Strong, Text } from "@/components/text";
import { Heading } from "@/components/heading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineController,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const numberFmt = new Intl.NumberFormat("en-US");

const quickRanges = [
  { label: "Today", days: 0 },
  { label: "Yesterday", days: 1 },
  { label: "7 days", days: 6 },
  { label: "14 days", days: 13 },
  { label: "30 days", days: 29 },
];

export default function SalesReportPage() {
  const today = new Date();
  const defaultStart = format(today, "yyyy-MM-dd");
  const defaultEnd = format(today, "yyyy-MM-dd");
  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(defaultEnd);

  const { data: reportData, isLoading } = useOrderReports(
    startDate,
    endDate,
    true,
  );
  const chartData: ChartData<"bar" | "line"> = {
    labels: reportData?.labels || [],
    datasets: [
      {
        label: "Website revenue",
        data: reportData?.datasets.websiteSeries || [],
        backgroundColor: "rgba(14, 165, 233, 0.65)",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(14, 165, 233, 0.95)",
      },
      {
        label: "In-store revenue",
        data: reportData?.datasets.inStoreSeries || [],
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(99, 102, 241, 0.9)",
      },
      {
        label: "Delivery revenue",
        data: reportData?.datasets.deliverySeries || [],
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(34, 197, 94, 0.9)",
      },
      {
        label: "Combined",
        data: reportData?.datasets.totals || [],
        type: "line" as const,
        borderColor: "#0ea5e9",
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 3,
        fill: false,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#0f172a",
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `${ctx.dataset.label}: ${currency.format(Number(ctx.raw ?? 0))}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#0f172a" },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#e2e8f0" },
        ticks: {
          color: "#0f172a",
          callback: (value: number | string) => currency.format(Number(value)),
        },
      },
    },
  };

  const bestDayLabel = reportData?.summary.bestDay?.dateKey
    ? format(parseISO(reportData.summary.bestDay.dateKey), "MMM dd")
    : "-";

  const summary = reportData?.summary || {
    websiteTotal: 0,
    inStoreTotal: 0,
    deliveryTotal: 0,
    combined: 0,
    websiteCount: 0,
    inStoreCount: 0,
    deliveryCount: 0,
    websiteAverage: 0,
    inStoreAverage: 0,
    deliveryAverage: 0,
    bestDay: { dateKey: "", total: 0 },
  };

  const daysCount = reportData?.labels.length || 0;

  return (
    <div className="flex flex-col gap-6 p-2 lg:p-4  from-slate-50 via-white to-slate-100 min-h-[calc(100vh-80px)]">
      <div className="rounded-2xl   flex flex-col gap-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold leading-tight">Orders Report</h1>
            <p className="text-sm">
              Track revenue and order metrics with daily trends and analysis.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {quickRanges.map((range) => {
              const rangeStart = format(
                subDays(today, range.days),
                "yyyy-MM-dd",
              );
              const rangeEnd =
                range.days === 0 || range.days === 1 ? rangeStart : defaultEnd;
              const isActive = startDate === rangeStart && endDate === rangeEnd;

              return (
                <Button
                  key={range.label}
                  color={isActive ? "blue" : "dark/zinc"}
                  onClick={() => {
                    setStartDate(rangeStart);
                    setEndDate(rangeEnd);
                  }}
                >
                  {range.label}
                </Button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 bg-zinc-100 border-zinc-200 dark:bg-white/10 border mt-6 dark:border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 text-sm">
            <Text className="text-white/80">From</Text>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Text className="text-white/80">To</Text>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Revenue"
          value={currency.format(summary.combined)}
          sub={`${daysCount} days • ${bestDayLabel} peak`}
        />
        <SummaryCard
          title="Website Orders"
          value={numberFmt.format(summary.websiteCount)}
          sub={currency.format(summary.websiteTotal)}
        />
        <SummaryCard
          title="In-Store Orders"
          value={numberFmt.format(summary.inStoreCount)}
          sub={currency.format(summary.inStoreTotal)}
        />
        <SummaryCard
          title="Delivery Orders"
          value={numberFmt.format(summary.deliveryCount)}
          sub={currency.format(summary.deliveryTotal)}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3 ">
        <div className="xl:col-span-2 rounded-2xl  shadow-sm border border-slate-200 p-4 min-h-[420px]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <Heading className="text-lg font-semibold ">
                Daily Order Revenue
              </Heading>
              <Text className="text-sm ">
                Orders and revenue trends with daily breakdown.
              </Text>
            </div>
          </div>
          <div className="h-[360px] dark:bg-white rounded-md p-2">
            {isLoading ? (
              <div className="h-full w-full animate-pulse  rounded-xl bg-gray-200" />
            ) : (
              <Bar data={chartData as any} options={chartOptions as any} />
            )}
          </div>
        </div>

        <div className="rounded-2xl  overflow-auto shadow-sm border border-slate-200 p-4 flex flex-col gap-4">
          <Heading className="text-lg font-semibold ">Range snapshot</Heading>
          <div className="grid grid-cols-2 gap-3">
            <StatLine
              label="Website avg/day"
              value={currency.format(summary.websiteAverage)}
            />
            <StatLine
              label="In-store avg/day"
              value={currency.format(summary.inStoreAverage)}
            />
            <StatLine
              label="Delivery avg/day"
              value={currency.format(summary.deliveryAverage)}
            />
            <StatLine
              label="Website share"
              value={`${ratio(summary.websiteTotal, summary.combined)}%`}
            />
            <StatLine
              label="In-store share"
              value={`${ratio(summary.inStoreTotal, summary.combined)}%`}
            />
            <StatLine
              label="Delivery share"
              value={`${ratio(summary.deliveryTotal, summary.combined)}%`}
            />
            <StatLine label="Peak day" value={bestDayLabel} />
            <StatLine
              label="Peak revenue"
              value={currency.format(summary.bestDay.total)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ratio(value: number, total: number) {
  if (!total) return "0.0";
  return ((value / total) * 100).toFixed(1);
}

function SummaryCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col gap-2">
      <Text className="text-sm ">{title}</Text>
      <Strong className="text-2xl text-slate-900">{value}</Strong>
      {sub && <Text className="text-xs text-slate-500">{sub}</Text>}
    </div>
  );
}

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col rounded-lg border border-slate-100  px-3 py-2">
      <Text className="text-xs ">{label}</Text>
      <Strong className="text-sm ">{value}</Strong>
    </div>
  );
}
