import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { TableCell, TableRow, TableHeader as THeader } from "./table";

export function TableRowSkeleton({
  row = 3,
  col = 3,
}: {
  row?: number;
  col?: number;
}) {

  return Array.from({ length: row }).map((_, index) => (
    <TableRow key={index}>
      {Array.from({ length: col }).map((_, cellIndex) => (
        <TableCell className="text-center py-4 text-gray-500" key={cellIndex}>
          <div className="space-y-2">
            <div className="h-2 rounded bg-gray-200"></div>
            <div className="h-2 rounded bg-gray-200"></div>
          </div>
        </TableCell>
      ))}
    </TableRow>
  ));
}

export function TableRowNoData({
  cellLabel = "No data available",
  col = 3,
}: {
  cellLabel?: string;
  col?: number;
}) {
  return (
    <TableRow>
      <TableCell colSpan={col} className="text-center py-4">
        {cellLabel}
      </TableCell>
    </TableRow>
  );
}

export function GlobalFilterRowCount({
  rowCount,
  cellLabel = "Found {rowCount} result(s)",
}: {
  rowCount: number;
  cellLabel?: string;
}) {
  return (
    <div className="text-sm text-gray-600">
      {cellLabel.replace("{rowCount}", rowCount.toString())}
    </div>
  );
}

export function HeaderSortIcon({ sorted }: { sorted?: "desc" | "asc" }) {
  return (
    <span className="text-xs">
      {sorted === "desc" ? (
        <ChevronDownIcon className="w-4 h-4" />
      ) : (
        <ChevronUpIcon className="w-4 h-4" />
      )}
    </span>
  );
}
