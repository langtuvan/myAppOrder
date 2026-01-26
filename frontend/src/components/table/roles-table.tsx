"use client";
import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  PaginationState,
} from "@tanstack/react-table";
import {
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Role } from "@/types/role";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import paths from "@/router/path";

interface RolesTableProps {
  data: Role[];
  loading?: boolean;
  onEdit?: (role: Role) => void;
  onDelete?: (role: Role) => void;
  onRestore?: (role: Role) => void;
}

export function RolesTable({
  data,

}: RolesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 1000,
  });

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-2 font-medium text-left"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {"Name"}
            {column.getIsSorted() === "asc" ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronUpDownIcon className="h-4 w-4" />
            )}
          </button>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => {
        const description = getValue() as string;
        return (
          <div className="max-w-xs truncate text-sm text-gray-600">
            {description || "-"}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  return (
    <div className=" overflow-hidden">
      <Table dense striped grid bleed>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHeader key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHeader>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              href={paths.dashboard.system.roles.edit(row.original._id!)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* <NoData length={data.length} /> */}

      {/* Pagination */}
    </div>
  );
}
