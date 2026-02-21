"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
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
import { Product } from "@/types/product";
import { type Order, StatusColor } from "@/hooks/useOrders";
import { fDate, fDateTime, formatStr } from "@/utils/format-time";
import { fCurrencyVND } from "@/utils/format-number";
import { Strong, Text } from "@/components/text";
import { ArrowUpDown } from "lucide-react";
import { Input } from "@/components/input";

type VisibilityState = Partial<Record<keyof Order, boolean>>;

const defaultVisibilityState: VisibilityState = {
  _id: true,
  orderType: false,
  trackingNumber: false,
  items: false,
  deliveryMethod: false,
  paymentMethod: false,
  paymentStatus: false,
  customerName: false,
  customerEmail: false,
  customerPhone: false,
  totalAmount: false,
  status: true,
  createdAt: true,
};

const mergeVisibilityState = (state?: VisibilityState): VisibilityState => ({
  ...defaultVisibilityState,
  ...(state ?? {}),
});

const columnHelper = createColumnHelper<Order>();

export default function OrderList({
  data,
  onSelect,
  visibilityState,
  isLoading,
}: {
  data: Order[];
  onSelect?: (id: string) => void;
  visibilityState?: VisibilityState;
  isLoading?: boolean;
}) {
  // table state
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    mergeVisibilityState(visibilityState)
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  const columns = useMemo(
    () => [
      // stt
      columnHelper.accessor("_id", {
        header: ({ column }) => (
          <button
            className=" sm:flex items-center gap-2 hover:text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            STT
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: (info) => <span className=" sm:inline">{info.row.index + 1}</span>,
        size: 50,
      }),
      columnHelper.accessor("orderType", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 hover:text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Order Type
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        size: 120,
      }),
      columnHelper.accessor("trackingNumber", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 hover:text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tracking number
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        size: 150,
      }),

      columnHelper.accessor("deliveryMethod", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 hover:text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Delivery
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        size: 120,
      }),
      columnHelper.accessor("paymentMethod", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 hover:text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Payment
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: (info) => (
          <span className="">
            {info.getValue()} -
            <Badge
              color={
                info.row.original.paymentStatus === "paid" ? "green" : "orange"
              }
            >
              {info.row.original.paymentStatus}
            </Badge>
          </span>
        ),
        size: 180,
      }),
      columnHelper.accessor((row) => row.customerPhone || row.customerEmail, {
        id: "customer",
        header: ({ column }) => (
          <button
            className=" sm:flex items-center gap-2 hover:text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Customer
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: (info) => (
          <span>
            {info.row.original?.customerPhone ||
              info.row.original?.customerEmail +
                " - " +
                info.row.original?.customerName}
          </span>
        ),
        size: 200,
      }),
      columnHelper.accessor("totalAmount", {
        header: ({ column }) => (
          <button
            className=" sm:flex items-center gap-2 hover:text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Amount
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: (info) => (
          <span className=" sm:inline">{fCurrencyVND(info.getValue()!)}</span>
        ),
        size: 150,
      }),
      // customerPayCod
      columnHelper.accessor("customerPayCod", {
        header: ({ column }) => (
          <button
            className=" sm:flex items-center gap-2 hover:text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Customer Pay COD
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: (info) => (
          <span className=" sm:inline">{fCurrencyVND(info.getValue()!)}</span>
        ),
        size: 150,
      }),
      columnHelper.accessor("status", {
        header: ({ column }) => (
          <button
            className=" sm:flex items-center gap-2 hover:text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: (info) => (
          <span className=" sm:inline">
            <Badge
              color={
                StatusColor[
                  info.getValue().toUpperCase() as keyof typeof StatusColor
                ] as any
              }
            >
              {info.getValue()}
            </Badge>
          </span>
        ),
        size: 120,
      }),
      columnHelper.accessor("createdAt", {
        header: ({ column }) => (
          <button
            className=" sm:flex items-center gap-2 hover:text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: (info) => (
          <span className=" sm:inline">
            {fDate(info.getValue(), formatStr.date)}
          </span>
        ),
        size: 130,
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      globalFilter,
      columnSizing,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
        placeholder="Search by order type, tracking number, customer, or status..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="hidden sm:block"
      />

      {/* Mobile view */}
      <ul
        role="list"
        className="divide-y divide-gray-100 dark:divide-white/5 sm:mb-4 sm:hidden"
      >
        {table.getRowModel().rows.map((row) => (
          <li
            key={row.original._id}
            className="flex gap-x-4 py-5"
            onClick={() => onSelect?.(row.original._id!)}
          >
            <div className="flex flex-col gap-1">
              <Text>
                Type: <Strong>{row.original.orderType} </Strong>
              </Text>
              <Text>
                Tracking number: <Strong>{row.original.trackingNumber} </Strong>
              </Text>
              <Text>
                Quantity: <Strong>{row.original.items?.length} </Strong>
              </Text>
              <Text>
                Delivery: <Strong>{row.original.deliveryMethod} </Strong>
              </Text>
              <Text>
                Payment:{" "}
                <Strong>
                  {row.original.paymentMethod} -{" "}
                  <Badge
                    color={
                      row.original.paymentStatus === "paid"
                        ? "green"
                        : "orange"
                    }
                  >
                    {row.original.paymentStatus}
                  </Badge>
                </Strong>
              </Text>
              <Text>
                Customer:{" "}
                <Strong>
                  {" "}
                  {row.original.customerPhone ||
                    row.original.customerName ||
                    row.original.customerEmail ||
                    ""}{" "}
                </Strong>
              </Text>
              <Text className="flex flex-row justify-between">
                <span>
                  Total: <Strong>{fCurrencyVND(row.original.totalAmount!)} </Strong>
                </span>
                <Badge
                  color={
                    StatusColor[
                      row.original.status.toUpperCase() as keyof typeof StatusColor
                    ] as any
                  }
                >
                  {row.original.status}
                </Badge>
              </Text>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop view */}
      <div
        style={{
          width: "100%",
          minWidth: table.getTotalSize(),
          overflow: "auto",
        }}
        className="hidden sm:block"
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
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
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
                  key={row.original._id}
                  onClick={(e) => onSelect?.(row.original._id!)}
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
                          cell.getContext()
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

//   const columns = useMemo(
//     () => [
//       // stt
//       columnHelper.accessor("_id", {
//         header: ({ column }) => (
//           <button
//             className=" sm:flex items-center gap-2 hover:text-primary"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             STT
//             <ArrowUpDown className="w-4 h-4" />
//           </button>
//         ),
//         cell: (info) => <span className=" sm:inline">{info.row.index + 1}</span>,
//       }),
//       columnHelper.accessor("orderType", {
//         header: ({ column }) => (
//           <button
//             className="flex items-center gap-2 hover:text-primary"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             Order Type
//             <ArrowUpDown className="w-4 h-4" />
//           </button>
//         ),
//       }),
//       columnHelper.accessor("trackingNumber", {
//         header: ({ column }) => (
//           <button
//             className="flex items-center gap-2 hover:text-primary"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             Tracking number
//             <ArrowUpDown className="w-4 h-4" />
//           </button>
//         ),
//       }),

//       columnHelper.accessor("deliveryMethod", {
//         header: ({ column }) => (
//           <button
//             className="flex items-center gap-2 hover:text-primary"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             Delivery
//             <ArrowUpDown className="w-4 h-4" />
//           </button>
//         ),
//       }),
//       columnHelper.accessor("paymentMethod", {
//         header: ({ column }) => (
//           <button
//             className="flex items-center gap-2 hover:text-primary"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             Payment
//             <ArrowUpDown className="w-4 h-4" />
//           </button>
//         ),
//         cell: (info) => (
//           <span className="">
//             {info.getValue()} -
//             <Badge
//               color={
//                 info.row.original.paymentStatus === "paid" ? "green" : "orange"
//               }
//             >
//               {info.row.original.paymentStatus}
//             </Badge>
//           </span>
//         ),
//       }),
//       columnHelper.accessor((row) => row.customerPhone || row.customerEmail, {
//         id: "customer",
//         header: ({ column }) => (
//           <button
//             className=" sm:flex items-center gap-2 hover:text-primary"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             Customer
//             <ArrowUpDown className="w-4 h-4" />
//           </button>
//         ),
//         cell: (info) => (
//           <span>
//             {info.row.original?.customerPhone ||
//               info.row.original?.customerEmail +
//                 " - " +
//                 info.row.original?.customerName}
//           </span>
//         ),
//       }),
//       columnHelper.accessor("totalAmount", {
//         header: ({ column }) => (
//           <button
//             className=" sm:flex items-center gap-2 hover:text-primary"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             Total Amount
//             <ArrowUpDown className="w-4 h-4" />
//           </button>
//         ),
//         cell: (info) => (
//           <span className=" sm:inline">{fCurrencyVND(info.getValue()!)}</span>
//         ),
//       }),
//       // customerPayCod
//       columnHelper.accessor("customerPayCod", {
//         header: ({ column }) => (
//           <button
//             className=" sm:flex items-center gap-2 hover:text-primary"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             Customer Pay COD
//             <ArrowUpDown className="w-4 h-4" />
//           </button>
//         ),
//         cell: (info) => (
//           <span className=" sm:inline">{fCurrencyVND(info.getValue()!)}</span>
//         ),
//       }),
//       columnHelper.accessor("status", {
//         header: ({ column }) => (
//           <button
//             className=" sm:flex items-center gap-2 hover:text-primary"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             Status
//             <ArrowUpDown className="w-4 h-4" />
//           </button>
//         ),
//         cell: (info) => (
//           <span className=" sm:inline">
//             <Badge
//               color={
//                 StatusColor[
//                   info.getValue().toUpperCase() as keyof typeof StatusColor
//                 ] as any
//               }
//             >
//               {info.getValue()}
//             </Badge>
//           </span>
//         ),
//       }),
//       columnHelper.accessor("createdAt", {
//         header: ({ column }) => (
//           <button
//             className=" sm:flex items-center gap-2 hover:text-primary"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             Created At
//             <ArrowUpDown className="w-4 h-4" />
//           </button>
//         ),
//         cell: (info) => (
//           <span className=" sm:inline">
//             {fDate(info.getValue(), formatStr.date)}
//           </span>
//         ),
//       }),
//     ],
//     []
//   );

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       columnVisibility,
//     },
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//   });

//   useEffect(() => {
//     if (!visibilityState) {
//       return;
//     }
//     setColumnVisibility(mergeVisibilityState(visibilityState));
//   }, [visibilityState]);

//   return (
//     <>
//       <ul
//         role="list"
//         className="divide-y divide-gray-100 dark:divide-white/5 sm:mb-4 sm:hidden"
//       >
//         {data.map((item) => (
//           <li
//             key={item._id}
//             className="flex gap-x-4 py-5"
//             onClick={() => onSelect?.(item._id!)}
//           >
//             <div className="flex flex-col gap-1">
//               <Text>
//                 Type: <Strong>{item.orderType} </Strong>
//               </Text>
//               <Text>
//                 Tracking number: <Strong>{item.trackingNumber} </Strong>
//               </Text>
//               <Text>
//                 Quantity: <Strong>{item.items?.length} </Strong>
//               </Text>
//               <Text>
//                 Delivery: <Strong>{item.deliveryMethod} </Strong>
//               </Text>
//               <Text>
//                 Payment:{" "}
//                 <Strong>
//                   {item.paymentMethod} -{" "}
//                   <Badge
//                     color={item.paymentStatus === "paid" ? "green" : "orange"}
//                   >
//                     {item.paymentStatus}
//                   </Badge>
//                 </Strong>
//               </Text>
//               <Text>
//                 Customer:{" "}
//                 <Strong>
//                   {" "}
//                   {item.customerPhone ||
//                     item.customerName ||
//                     item.customerEmail ||
//                     ""}{" "}
//                 </Strong>
//               </Text>
//               <Text className="flex flex-row justify-between">
//                 <span>
//                   Total: <Strong>{fCurrencyVND(item.totalAmount!)} </Strong>
//                 </span>
//                 <Badge
//                   color={
//                     StatusColor[
//                       item.status.toUpperCase() as keyof typeof StatusColor
//                     ] as any
//                   }
//                 >
//                   {item.status}
//                 </Badge>
//               </Text>
//             </div>
//           </li>
//         ))}
//       </ul>
//       {/* Desktop view */}
//       <Table className="hidden sm:block overflow-x-auto" dense grid striped>
//         <TableHead>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <TableRow key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <TableHeader key={header.id}>
//                   {header.isPlaceholder
//                     ? null
//                     : flexRender(
//                         header.column.columnDef.header,
//                         header.getContext()
//                       )}
//                 </TableHeader>
//               ))}
//             </TableRow>
//           ))}
//         </TableHead>
//         <TableBody>
//           {table.getRowModel().rows.length > 0 ? (
//             table.getRowModel().rows.map((row) => (
//               <TableRow
//                 key={row.original._id}
//                 onClick={(e) => onSelect?.(row.original._id!)}
//               >
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={columns.length} className="text-center py-4">
//                 No data available
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </>
//   );
// }
