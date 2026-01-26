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
import {
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  parseISO,
  subDays,
} from "date-fns";
import { useAuth } from "@/hooks";
import { useOrders, OrderType } from "@/hooks/useOrders";
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
  Filler
);

type NumericRecord = Record<string, number>;

type SalesBuckets = Record<
  string,
  {
    receptionAmount: number;
    bookingAmount: number;
    receptionCount: number;
    bookingCount: number;
    websiteAmount: number;
    inStoreAmount: number;
    deliveryAmount: number;
    websiteCount: number;
    inStoreCount: number;
    deliveryCount: number;
  }
>;

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

function parseDate(value?: string | Date) {
  if (!value) return null;
  const date = typeof value === "string" ? parseISO(value) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeRange(startInput: string, endInput: string) {
  const start = parseDate(startInput) || new Date();
  const end = parseDate(endInput) || start;
  if (isAfter(start, end)) {
    return { start: end, end: start };
  }
  return { start, end };
}

function orderAmount(order: any) {
  const totalAmount = Number(order?.totalAmount);
  if (!Number.isNaN(totalAmount) && totalAmount > 0) return totalAmount;

  const itemsTotal = (order?.items || []).reduce((sum: number, item: any) => {
    const price = Number(item?.price ?? 0);
    const qty = Number(item?.quantity ?? item?.qty ?? 1);
    return sum + price * qty;
  }, 0);

  const subTotal = Number(order?.subTotal);
  const taxes = Number(order?.taxes ?? 0);
  const deliveryPrice = Number(order?.deliveryPrice ?? 0);
  const discount = Number(order?.discount ?? 0);

  const base = !Number.isNaN(subTotal) && subTotal > 0 ? subTotal : itemsTotal;
  const computed = base + taxes + deliveryPrice - discount;
  return Math.max(0, computed);
}

function normalizeOrderType(value: any): OrderType {
  const key = (value ?? OrderType.IN_STORE).toString().toLowerCase().trim();
  if (["website", "web", "online"].includes(key)) return OrderType.WEBSITE;
  if (["delivery", "ship", "shipping"].includes(key)) return OrderType.DELIVERY;
  if (["in_store", "instore", "in-store", "store", "pos"].includes(key))
    return OrderType.IN_STORE;
  return OrderType.IN_STORE;
}

function buildBuckets(orders: any[], start: Date, end: Date) {
  const days = eachDayOfInterval({ start, end });
  const buckets: SalesBuckets = {};
  days.forEach((day) => {
    const key = format(day, "yyyy-MM-dd");
    buckets[key] = {
      receptionAmount: 0,
      bookingAmount: 0,
      receptionCount: 0,
      bookingCount: 0,
      websiteAmount: 0,
      inStoreAmount: 0,
      deliveryAmount: 0,
      websiteCount: 0,
      inStoreCount: 0,
      deliveryCount: 0,
    };
  });

  orders.forEach((order) => {
    const isPaid =
      (order?.paymentStatus ?? "").toString().toLowerCase() === "paid";

    if (!isPaid) return;
    const date: any = parseDate(order.createdAt);
    //if (!date || isBefore(date, start) || isAfter(date, end)) return;
    const key = format(date, "yyyy-MM-dd");
    const amount = orderAmount(order);
    const orderType = normalizeOrderType(order?.orderType);

    if (!buckets[key]) {
      buckets[key] = {
        receptionAmount: 0,
        bookingAmount: 0,
        receptionCount: 0,
        bookingCount: 0,
        websiteAmount: 0,
        inStoreAmount: 0,
        deliveryAmount: 0,
        websiteCount: 0,
        inStoreCount: 0,
        deliveryCount: 0,
      };
    }

    buckets[key].receptionAmount += amount;
    buckets[key].receptionCount += 1;

    // Track by order type
    if (orderType === OrderType.WEBSITE) {
      buckets[key].websiteAmount += amount;
      buckets[key].websiteCount += 1;
    } else if (orderType === OrderType.IN_STORE) {
      buckets[key].inStoreAmount += amount;
      buckets[key].inStoreCount += 1;
    } else if (orderType === OrderType.DELIVERY) {
      buckets[key].deliveryAmount += amount;
      buckets[key].deliveryCount += 1;
    }
  });

  return { buckets, days };
}

function aggregateSales(orders: any[], start: Date, end: Date) {
  const { buckets, days } = buildBuckets(orders, start, end);

  const labels: string[] = [];
  const websiteSeries: number[] = [];
  const inStoreSeries: number[] = [];
  const deliverySeries: number[] = [];
  const totals: number[] = [];
  let websiteTotal = 0;
  let inStoreTotal = 0;
  let deliveryTotal = 0;
  let websiteCount = 0;
  let inStoreCount = 0;
  let deliveryCount = 0;

  days.forEach((day) => {
    const key = format(day, "yyyy-MM-dd");

    const bucket = buckets[key] || {
      receptionAmount: 0,
      bookingAmount: 0,
      receptionCount: 0,
      bookingCount: 0,
      websiteAmount: 0,
      inStoreAmount: 0,
      deliveryAmount: 0,
      websiteCount: 0,
      inStoreCount: 0,
      deliveryCount: 0,
    };
    labels.push(format(day, "MMM dd"));
    websiteSeries.push(bucket.websiteAmount);
    inStoreSeries.push(bucket.inStoreAmount);
    deliverySeries.push(bucket.deliveryAmount);
    totals.push(
      bucket.websiteAmount + bucket.inStoreAmount + bucket.deliveryAmount
    );
    websiteTotal += bucket.websiteAmount;
    inStoreTotal += bucket.inStoreAmount;
    deliveryTotal += bucket.deliveryAmount;
    websiteCount += bucket.websiteCount;
    inStoreCount += bucket.inStoreCount;
    deliveryCount += bucket.deliveryCount;
  });

  const bestDay = Object.entries(buckets).reduce(
    (acc, [key, value]) => {
      const total =
        value.websiteAmount + value.inStoreAmount + value.deliveryAmount;
      if (total > acc.total) {
        return { dateKey: key, total };
      }
      return acc;
    },
    { dateKey: format(end, "yyyy-MM-dd"), total: 0 }
  );

  return {
    labels,
    datasets: {
      websiteSeries,
      inStoreSeries,
      deliverySeries,
      totals,
    },
    summary: {
      websiteTotal,
      inStoreTotal,
      deliveryTotal,
      combined: websiteTotal + inStoreTotal + deliveryTotal,
      websiteCount,
      inStoreCount,
      deliveryCount,
      bestDay,
    },
  };
}

export default function SalesReportPage() {
  const today = new Date();
  const defaultStart = format(subDays(today, 6), "yyyy-MM-dd");
  const defaultEnd = format(today, "yyyy-MM-dd");
  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(defaultEnd);

  const { user } = useAuth();
  const { data: ordersData = [], isLoading: loadingOrders } = useOrders();

  const { start, end } = useMemo(
    () => normalizeRange(startDate, endDate),
    [startDate, endDate]
  );

  const sales = useMemo(
    () => aggregateSales(ordersData, start, end),
    [ordersData, start, end]
  );

  const isLoading = loadingOrders;

  const chartData: ChartData<"bar" | "line"> = {
    labels: sales.labels,
    datasets: [
      {
        label: "Website revenue",
        data: sales.datasets.websiteSeries,
        backgroundColor: "rgba(14, 165, 233, 0.65)",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(14, 165, 233, 0.95)",
      },
      {
        label: "In-store revenue",
        data: sales.datasets.inStoreSeries,
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(99, 102, 241, 0.9)",
      },
      {
        label: "Delivery revenue",
        data: sales.datasets.deliverySeries,
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(34, 197, 94, 0.9)",
      },
      {
        label: "Combined",
        data: sales.datasets.totals,
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

  const bestDayLabel = sales.summary.bestDay?.dateKey
    ? format(parseISO(sales.summary.bestDay.dateKey), "MMM dd")
    : "-";

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
                "yyyy-MM-dd"
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
          value={currency.format(sales.summary.combined)}
          sub={`${sales.labels.length} days • ${bestDayLabel} peak`}
        />
        <SummaryCard
          title="Website Orders"
          value={numberFmt.format(sales.summary.websiteCount)}
          sub={currency.format(sales.summary.websiteTotal)}
        />
        <SummaryCard
          title="In-Store Orders"
          value={numberFmt.format(sales.summary.inStoreCount)}
          sub={currency.format(sales.summary.inStoreTotal)}
        />
        <SummaryCard
          title="Delivery Orders"
          value={numberFmt.format(sales.summary.deliveryCount)}
          sub={currency.format(sales.summary.deliveryTotal)}
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
              <div className="h-full w-full animate-pulse  rounded-xl" />
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
              value={currency.format(
                safeAverage(sales.summary.websiteTotal, sales.labels.length)
              )}
            />
            <StatLine
              label="In-store avg/day"
              value={currency.format(
                safeAverage(sales.summary.inStoreTotal, sales.labels.length)
              )}
            />
            <StatLine
              label="Delivery avg/day"
              value={currency.format(
                safeAverage(sales.summary.deliveryTotal, sales.labels.length)
              )}
            />
            <StatLine
              label="Website share"
              value={`${ratio(
                sales.summary.websiteTotal,
                sales.summary.combined
              )}%`}
            />
            <StatLine
              label="In-store share"
              value={`${ratio(
                sales.summary.inStoreTotal,
                sales.summary.combined
              )}%`}
            />
            <StatLine
              label="Delivery share"
              value={`${ratio(
                sales.summary.deliveryTotal,
                sales.summary.combined
              )}%`}
            />
            <StatLine label="Peak day" value={bestDayLabel} />
            <StatLine
              label="Peak revenue"
              value={currency.format(sales.summary.bestDay.total)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function safeAverage(total: number, days: number) {
  if (!days) return 0;
  return total / days;
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

// "use client";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function DashboardPage() {
//   const router = useRouter();
//   useEffect(() => {
//     router.replace("/dashboard/orders");
//   }, [router]);
//   return null;
// }
