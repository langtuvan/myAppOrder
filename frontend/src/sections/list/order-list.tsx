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

import { fDate, fDateTime, formatStr } from "@/utils/format-time";
import { fCurrencyVND } from "@/utils/format-number";
import { Strong, Text } from "@/components/text";
import { ArrowUpDown } from "lucide-react";
import { Input } from "@/components/input";
import { type Order, deliveryMethods, StatusColor } from "@/types/order";
import { useLanguageStore } from "@/store/language";

type VisibilityState = Partial<Record<string, boolean>>;

const defaultVisibilityState: VisibilityState = {
  _id: true,
  orderType: false,
  trackingNumber: false,
  items: false,
  deliveryMethod: false,
  paymentMethod: false,
  paymentStatus: false,
  status: true,
  createdAt: true,
};

const mergeVisibilityState = (
  state?: Partial<Record<string, boolean>>,
): Record<string, boolean> =>
  ({
    ...defaultVisibilityState,
    ...(state ?? {}),
  }) as Record<string, boolean>;

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
  const locale = useLanguageStore((state) => state.locale);
  const l = {
    stt: locale === "vi" ? "STT" : "No.",
    orderType: locale === "vi" ? "Loai don" : "Order Type",
    trackingNumber: locale === "vi" ? "Ma van don" : "Tracking number",
    delivery: locale === "vi" ? "Giao hang" : "Delivery",
    payment: locale === "vi" ? "Thanh toan" : "Payment",
    customer: locale === "vi" ? "Khach hang" : "Customer",
    totalAmount: locale === "vi" ? "Tong tien" : "Total Amount",
    customerPayCod: locale === "vi" ? "Thu ho COD" : "Customer Pay COD",
    status: locale === "vi" ? "Trang thai" : "Status",
    createdAt: locale === "vi" ? "Ngay tao" : "Created At",
    na: locale === "vi" ? "Khong co" : "N/A",
    search:
      locale === "vi"
        ? "Tim theo loai don, ma van don, khach hang hoac trang thai..."
        : "Search by order type, tracking number, customer, or status...",
    type: locale === "vi" ? "Loai" : "Type",
    quantity: locale === "vi" ? "So luong" : "Quantity",
    total: locale === "vi" ? "Tong" : "Total",
  };
  // table state
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(mergeVisibilityState(visibilityState));
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
            {l.stt}
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: (info) => (
          <span className=" sm:inline">{info.row.index + 1}</span>
        ),
        size: 50,
      }),
      columnHelper.accessor("orderType", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 hover:text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {l.orderType}
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
            {l.trackingNumber}
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        size: 150,
      }),

      columnHelper.accessor("delivery", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 hover:text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {l.delivery}
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: (info) => (
          <span className="">
            {info.row.original.delivery?.deliveryMethod || l.na}
          </span>
        ),
        size: 120,
      }),
      columnHelper.accessor("payment", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 hover:text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {l.payment}
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: (info) => (
          <span className="">
            {info.row.original.payment?.paymentMethod} -
            <Badge
              color={
                info.row.original.payment?.paymentStatus === "paid"
                  ? "green"
                  : "orange"
              }
            >
              {info.row.original.payment?.paymentStatus}
            </Badge>
          </span>
        ),
        size: 180,
      }),
      columnHelper.accessor("customer", {
        id: "customer",
        header: ({ column }) => (
          <button
            className=" sm:flex items-center gap-2 hover:text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {l.customer}
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: (info) => (
          <span>
            {typeof info.row.original.customer === "string"
              ? info.row.original.customer
              : info.row.original.customer?.phone ||
                info.row.original.customer?.firstName ||
                info.row.original.customer?.email ||
                l.na}
          </span>
        ),
        size: 200,
      }),
      columnHelper.accessor("billing", {
        header: ({ column }) => (
          <button
            className=" sm:flex items-center gap-2 hover:text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {l.totalAmount}
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: (info) => (
          <span className=" sm:inline">
            {fCurrencyVND(info.row.original.billing?.totalAmount || 0)}
          </span>
        ),
        size: 150,
      }),
      // customerPayCod
      columnHelper.accessor((row) => row.billing?.customerPayCod || 0, {
        id: "customerPayCod",
        header: ({ column }) => (
          <button
            className=" sm:flex items-center gap-2 hover:text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {l.customerPayCod}
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: (info) => (
          <span className=" sm:inline">{fCurrencyVND(info.getValue())}</span>
        ),
        size: 150,
      }),
      columnHelper.accessor("status", {
        header: ({ column }) => (
          <button
            className=" sm:flex items-center gap-2 hover:text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {l.status}
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
            {l.createdAt}
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
    [l],
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
        placeholder={l.search}
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
                {l.type}: <Strong>{row.original.orderType} </Strong>
              </Text>
              <Text>
                {l.trackingNumber}:{" "}
                <Strong>{row.original.trackingNumber} </Strong>
              </Text>
              <Text>
                {l.quantity}: <Strong>{row.original.items?.length} </Strong>
              </Text>
              <Text>
                {l.delivery}:{" "}
                <Strong>
                  {row.original.delivery?.deliveryMethod || l.na}{" "}
                </Strong>
              </Text>
              <Text>
                {l.payment}:{" "}
                <Strong>
                  {row.original.payment?.paymentMethod} -{" "}
                  <Badge
                    color={
                      row.original.payment?.paymentStatus === "paid"
                        ? "green"
                        : "orange"
                    }
                  >
                    {row.original.payment?.paymentStatus}
                  </Badge>
                </Strong>
              </Text>
              <Text>
                {l.customer}:{" "}
                <Strong>
                  {" "}
                  {typeof row.original.customer === "string"
                    ? row.original.customer
                    : row.original.customer?.phone ||
                      row.original.customer?.firstName ||
                      row.original.customer?.email ||
                      l.na}{" "}
                </Strong>
              </Text>
              <Text className="flex flex-row justify-between">
                <span>
                  {l.total}:{" "}
                  <Strong>
                    {fCurrencyVND(row.original.billing?.totalAmount || 0)}{" "}
                  </Strong>
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
                                header.getContext(),
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
