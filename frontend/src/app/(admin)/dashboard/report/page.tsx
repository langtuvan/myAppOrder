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
import { useLanguageStore } from "@/store/language";

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

export default function SalesReportPage() {
  const { locale } = useLanguageStore();

  const currency = useMemo(
    () =>
      new Intl.NumberFormat(locale === "en" ? "en-US" : "vi-VN", {
        style: "currency",
        currency: locale === "en" ? "USD" : "VND",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const numberFmt = useMemo(
    () => new Intl.NumberFormat(locale === "en" ? "en-US" : "vi-VN"),
    [locale],
  );

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

  const quickRanges = [
    { label: locale === "en" ? "Today" : "Hôm nay", days: 0 },
    { label: locale === "en" ? "Yesterday" : "Hôm qua", days: 1 },
    { label: locale === "en" ? "7 days" : "7 ngày", days: 6 },
    { label: locale === "en" ? "14 days" : "14 ngày", days: 13 },
    { label: locale === "en" ? "30 days" : "30 ngày", days: 29 },
  ];
  const chartData: ChartData<"bar" | "line"> = {
    labels: reportData?.labels || [],
    datasets: [
      {
        label: { en: "Website revenue", vi: "Doanh thu website" }[locale],
        data: reportData?.datasets.websiteSeries || [],
        backgroundColor: "rgba(14, 165, 233, 0.65)",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(14, 165, 233, 0.95)",
      },
      {
        label: { en: "In-store revenue", vi: "Doanh thu tại cửa hàng" }[locale],
        data: reportData?.datasets.inStoreSeries || [],
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(99, 102, 241, 0.9)",
      },
      {
        label: { en: "Delivery revenue", vi: "Doanh thu giao hàng" }[locale],
        data: reportData?.datasets.deliverySeries || [],
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(34, 197, 94, 0.9)",
      },
      {
        label: { en: "Combined", vi: "Tổng hợp" }[locale],
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
            <h1 className="text-2xl font-bold leading-tight">
              {locale === "en" ? "Orders Report" : "Báo cáo đơn hàng"}
            </h1>
            <p className="text-sm">
              {locale === "en"
                ? "Track revenue and order metrics with daily trends and analysis."
                : "Theo dõi doanh thu và các chỉ số đơn hàng với xu hướng và phân tích hàng ngày."}
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
            <Text className="text-white/80">
              {locale === "en" ? "From" : "Từ"}
            </Text>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Text className="text-white/80">
              {locale === "en" ? "To" : "Đến"}
            </Text>
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
          title={locale === "en" ? "Total Revenue" : "Tổng doanh thu"}
          value={currency.format(summary.combined)}
          sub={`${daysCount} ${locale === "en" ? "days" : "ngày"} • ${bestDayLabel} ${locale === "en" ? "peak" : "đỉnh"}`}
        />
        <SummaryCard
          title={locale === "en" ? "Website Orders" : "Đơn hàng website"}
          value={numberFmt.format(summary.websiteCount)}
          sub={currency.format(summary.websiteTotal)}
        />
        <SummaryCard
          title={locale === "en" ? "In-Store Orders" : "Đơn hàng tại cửa hàng"}
          value={numberFmt.format(summary.inStoreCount)}
          sub={currency.format(summary.inStoreTotal)}
        />
        <SummaryCard
          title={locale === "en" ? "Delivery Orders" : "Đơn hàng giao hàng"}
          value={numberFmt.format(summary.deliveryCount)}
          sub={currency.format(summary.deliveryTotal)}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3 ">
        <div className="xl:col-span-2 rounded-2xl  shadow-sm border border-slate-200 p-4 min-h-[420px]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <Heading className="text-lg font-semibold ">
                {locale === "en"
                  ? "Daily Order Revenue"
                  : "Doanh thu đơn hàng hàng ngày"}
              </Heading>
              <Text className="text-sm ">
                {locale === "en"
                  ? "Orders and revenue trends with daily breakdown."
                  : "Xu hướng đơn hàng và doanh thu với phân tích hàng ngày."}
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
          <Heading className="text-lg font-semibold ">
            {locale === "en" ? "Range snapshot" : "Tóm tắt phạm vi"}
          </Heading>
          <div className="grid grid-cols-2 gap-3">
            <StatLine
              label={
                locale === "en" ? "Website avg/day" : "Trung bình website/ngày"
              }
              value={currency.format(summary.websiteAverage)}
            />
            <StatLine
              label={
                locale === "en"
                  ? "In-store avg/day"
                  : "Trung bình cửa hàng/ngày"
              }
              value={currency.format(summary.inStoreAverage)}
            />
            <StatLine
              label={
                locale === "en"
                  ? "Delivery avg/day"
                  : "Trung bình giao hàng/ngày"
              }
              value={currency.format(summary.deliveryAverage)}
            />
            <StatLine
              label={locale === "en" ? "Website share" : "Chia sẻ website"}
              value={`${ratio(summary.websiteTotal, summary.combined)}%`}
            />
            <StatLine
              label={locale === "en" ? "In-store share" : "Chia sẻ cửa hàng"}
              value={`${ratio(summary.inStoreTotal, summary.combined)}%`}
            />
            <StatLine
              label={locale === "en" ? "Delivery share" : "Chia sẻ giao hàng"}
              value={`${ratio(summary.deliveryTotal, summary.combined)}%`}
            />
            <StatLine
              label={locale === "en" ? "Peak day" : "Ngày cao điểm"}
              value={bestDayLabel}
            />
            <StatLine
              label={locale === "en" ? "Peak revenue" : "Doanh thu cao điểm"}
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
