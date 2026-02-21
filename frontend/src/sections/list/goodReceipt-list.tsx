"use client";
import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/badge";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  ColumnSizingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import {
  GlobalFilterRowCount,
  HeaderSortIcon,
  TableRowNoData,
  TableRowSkeleton,
} from "@/components/table-component";
import paths from "@/router/path";
import { type GoodsReceipt as Type } from "@/types/goodReceipt";
import { Input } from "@/components/input";

type ColumnVisibilityState = Record<keyof Type, boolean>;

const defaultVisibilityState: ColumnVisibilityState = {
  _id: false,
  code: false,
  note: false,
  status: false,
  createdAt: false,
  createdBy: false,
  invoiceDate: false,
  invoiceNumber: false,
  updatedAt: false,
  items: false,
  supplier: false,
};

const mergeVisibilityState = (
  state?: Partial<ColumnVisibilityState>,
): ColumnVisibilityState => ({
  ...defaultVisibilityState,
  ...(state ?? {}),
});

type Props = {
  isLoading?: boolean;
  data: Type[];
  visibilityState?: Partial<ColumnVisibilityState>;
};

export default function GoodsReceiptsList({
  data,
  isLoading,
  visibilityState,
}: Props) {
  const [globalFilter, setGlobalFilter] = useState("");

  // table state
  const columns = useMemo<ColumnDef<Type>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Name",
      },
      {
        accessorKey: "note",
        header: "Description",
        size: 300,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => (
          <Badge color={(info.getValue() as boolean) ? "green" : "red"}>
            {(info.getValue() as boolean) ? "Active" : "Inactive"}
          </Badge>
        ),
        size: 50,
      },
    ],
    [],
  );

  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>(mergeVisibilityState(visibilityState));
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      globalFilter,
      columnVisibility,
      columnSizing,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
    columnResizeMode: "onChange",
  });

  // update column visibility when prop changes
  useEffect(() => {
    if (!visibilityState) {
      return;
    }
    setColumnVisibility(mergeVisibilityState(visibilityState));
  }, [visibilityState]);

  const onEdit = (id: string) =>
    `${paths.dashboard.inventory.goodsReceipts.edit(id)}`;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Input
        type="text"
        placeholder="Search by code, description, or status..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />

      {/* Table */}
      <div
        style={{
          width: "100%",
          minWidth: table.getTotalSize(),
          overflow: "auto",
        }}
      >
        <Table
          dense
          grid
          striped
          style={{ width: "100%", minWidth: table.getTotalSize() }}
        >
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const size = header.getSize();
                  return (
                    <TableHeader
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{
                        width:
                          size === Number.MAX_SAFE_INTEGER
                            ? "auto"
                            : `${size}px`,
                        position: "relative",
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getIsSorted() && (
                            <HeaderSortIcon
                              sorted={
                                header.column.getIsSorted() as "asc" | "desc"
                              }
                            />
                          )}
                        </div>
                        <div
                          role="presentation"
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className="w-1 h-6 bg-gray-300 hover:bg-blue-500 cursor-col-resize select-none touch-none"
                        />
                      </div>
                    </TableHeader>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRowSkeleton row={3} col={columns.length} />
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  href={onEdit(row.original._id!)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => {
                    const size = cell.column.getSize();
                    return (
                      <TableCell
                        key={cell.id}
                        style={{
                          width:
                            size === Number.MAX_SAFE_INTEGER
                              ? "auto"
                              : `${size}px`,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              !globalFilter && <TableRowNoData col={columns.length} />
            )}
          </TableBody>
        </Table>
      </div>

      {/* Result summary */}
      {globalFilter && (
        <GlobalFilterRowCount
          rowCount={table.getFilteredRowModel().rows.length}
        />
      )}
    </div>
  );
}
