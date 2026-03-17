import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

export interface OrderReportData {
  labels: string[];
  datasets: {
    websiteSeries: number[];
    inStoreSeries: number[];
    deliverySeries: number[];
    totals: number[];
  };
  summary: {
    websiteTotal: number;
    inStoreTotal: number;
    deliveryTotal: number;
    combined: number;
    websiteCount: number;
    inStoreCount: number;
    deliveryCount: number;
    websiteAverage: number;
    inStoreAverage: number;
    deliveryAverage: number;
    bestDay: {
      dateKey: string;
      total: number;
    };
  };
}

// Query Keys
export const reportKeys = {
  all: ["reports"] as const,
  lists: () => [...reportKeys.all, "list"] as const,
  range: (startDate: string, endDate: string) =>
    [...reportKeys.lists(), "range", startDate, endDate] as const,
};

/**
 * Fetch orders report for a date range
 */
export function useOrderReports(
  startDate: string,
  endDate: string,
  enabled = true,
) {
  return useQuery<OrderReportData>({
    queryKey: reportKeys.range(startDate, endDate),
    queryFn: async () => {
      const response = await axiosInstance.get("/orders/report/generate", {
        params: {
          startDate,
          endDate,
        },
      });
      return response.data;
    },
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
