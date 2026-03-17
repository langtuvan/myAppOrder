"use client";
import { useState, useMemo, useEffect } from "react";
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
import { Badge } from "@/components/badge";
import { Supplier } from "@/types/supplier";
import formattedMessage from "@/language/language";
import { Input } from "@/components/input";

type ColumnVisibilityState = Record<keyof Supplier, boolean>;

const defaultVisibilityState: ColumnVisibilityState = {
  _id: false,
  name: false,
  description: false,
  isActive: false,
  createdAt: false,
  updatedAt: false,
  createdBy: false,
  contactPerson: false,
  email: false,
  phone: false,
  address: false,
  city: false,
  country: false,
  companyName: false,
  postalCode: false,
  taxId: false,
} as ColumnVisibilityState;

const mergeVisibilityState = (
  state?: Partial<ColumnVisibilityState>,
): ColumnVisibilityState => ({
  ...defaultVisibilityState,
  ...(state ?? {}),
});

type Props = {
  data: Supplier[];
  isLoading?: boolean;
  visibilityState?: Partial<ColumnVisibilityState>;
};

export default function SupplierList({
  data,
  isLoading,
  visibilityState,
}: Props) {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<Supplier>[]>(
    () => [
      {
        accessorKey: "name",
        header: formattedMessage.inventory.suppliers.form.name,
        size: 200,
      },
      {
        accessorKey: "description",
        header: formattedMessage.inventory.suppliers.form.description,
        size: 300,
      },
      {
        accessorKey: "isActive",
        header: formattedMessage.inventory.suppliers.form.isActive,
        cell: (info) => (
          <Badge color={(info.getValue() as boolean) ? "green" : "red"}>
            {(info.getValue() as boolean)
              ? formattedMessage.common.active
              : formattedMessage.common.inactive}
          </Badge>
        ),
        size: 100,
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

  useEffect(() => {
    if (!visibilityState) {
      return;
    }
    setColumnVisibility(mergeVisibilityState(visibilityState));
  }, [visibilityState]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Input
        type="text"
        placeholder="Search by name, description, or status..."
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
                        {header.column.getCanResize() && (
                          <div
                            role="presentation"
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className="w-1 h-6 bg-gray-300 hover:bg-blue-500 cursor-col-resize select-none touch-none"
                          />
                        )}
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
                  href={paths.dashboard.inventory.suppliers.edit(
                    row.original._id!,
                  )}
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
