"use client";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Order, OrderType, PaymentMethod } from "@/types/order";
import { fCurrencyVND } from "@/utils/format-number";
import { Button } from "./button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "./table";
import { Text } from "./text";

interface PrintBillProps {
  orderData: Order;
  onClose?: () => void;
}

export const PrintBill = ({ orderData, onClose }: PrintBillProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: `
       @page {
         size: 80mm auto;
         margin: 0;
       }
       @media print {
         body {
           margin: 0;
           padding: 0;
         }
       }
     `,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-xl w-fit max-h-[90vh] overflow-auto">
        <div className="p-6 space-y-4">
          {/* Print Content */}
          <div
            ref={printRef}
            className="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            style={{ width: "80mm" }}
          >
            {/* Header */}
            <div className="text-center border-b border-gray-300 pb-2 mb-3">
              <h1 className="text-xl font-bold">Hóa đơn mua hàng</h1>
              <Text className="text-xs ">Cảm ơn quý khách!</Text>
            </div>

            {/* Order Info */}
            <div className="mb-3 text-xs">
              <div className="space-y-1">
                <Text className="flex justify-between">
                  <span>Mã đơn:</span>
                  <span className="font-semibold">
                    {orderData.trackingNumber || "N/A"}
                  </span>
                </Text>
                <Text className="flex justify-between">
                  <span>Ngày:</span>
                  <span className="font-semibold">
                    {new Date().toLocaleDateString()}
                  </span>
                </Text>
                <Text className="flex justify-between">
                  <span>Loại:</span>
                  <span className="font-semibold">{orderData.orderType}</span>
                </Text>
                <Text className="flex justify-between">
                  <span>Thanh toán:</span>
                  <span className="font-semibold">
                    {orderData.payment.paymentMethod}
                  </span>
                </Text>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-3 border-t pt-2">
              <h2 className="text-sm font-bold mb-1">Khách hàng</h2>
              <div className="text-xs space-y-1">
                <Text>{orderData.customer?.firstName}</Text>
                <Text>{orderData.customer?.phone}</Text>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-3 border-t pt-2">
              <h2 className="text-sm font-bold mb-2">Sản phẩm</h2>
              <Table className="w-full" dense grid bleed>
                <TableHead>
                  <TableRow className="border-b">
                    <TableHeader className="text-left py-1">Tên SP</TableHeader>
                    <TableHeader className="text-center py-1">SL</TableHeader>
                    <TableHeader className="text-right py-1">Tổng</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderData.items?.map((item, index) => (
                    <TableRow key={index} className="border-b border-dashed">
                      <TableCell className="py-1">{item.productName}</TableCell>
                      <TableCell className="text-center py-1">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right py-1">
                        {fCurrencyVND(item.price * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="border-t pt-2">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span className="font-semibold">
                    {fCurrencyVND(
                      orderData.items?.reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0,
                      ) || 0,
                    )}
                  </span>
                </div>
                {orderData.billing.deliveryPrice > 0 && (
                  <div className="flex justify-between">
                    <span>Phí giao hàng:</span>
                    <span className="font-semibold">
                      {fCurrencyVND(orderData.billing.deliveryPrice)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold border-t pt-1 mt-1">
                  <span>Tổng cộng:</span>
                  <span>
                    {fCurrencyVND(orderData.billing.totalAmount || 0)}
                  </span>
                </div>
                {orderData.payment.paymentMethod === PaymentMethod.CASH && (
                  <>
                    <div className="flex justify-between">
                      <span>Khách đưa:</span>
                      <span className="font-semibold">
                        {fCurrencyVND(orderData.billing.customerPay || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tiền thừa:</span>
                      <span className="font-semibold">
                        {fCurrencyVND(
                          (orderData.billing.customerPay || 0) -
                            (orderData.billing.totalAmount || 0),
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-3 pt-2 border-t text-xs text-gray-600">
              <p>Cảm ơn quý khách đã mua hàng!</p>
              <p>Hẹn gặp lại quý khách</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end border-t pt-4">
            <Button color="white" onClick={onClose}>
              Đóng
            </Button>
            <Button color="blue" onClick={handlePrint}>
              In hóa đơn
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
