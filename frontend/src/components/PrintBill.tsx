"use client";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Order, OrderType, PaymentMethod } from "@/hooks/useOrders";
import { fCurrencyVND } from "@/utils/format-number";
import { Button } from "./button";

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
      <div className="bg-white rounded-lg shadow-xl w-fit max-h-[90vh] overflow-auto">
        <div className="p-6 space-y-4">
          {/* Print Content */}
          <div
            ref={printRef}
            className="p-4 bg-white"
            style={{ width: "80mm" }}
          >
            {/* Header */}
            <div className="text-center border-b border-gray-300 pb-2 mb-3">
              <h1 className="text-xl font-bold">Order Bill</h1>
              <p className="text-xs text-gray-600">Thank you for your order!</p>
            </div>

            {/* Order Info */}
            <div className="mb-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order #:</span>
                  <span className="font-semibold">
                    {orderData.trackingNumber || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold">{orderData.orderType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <span className="font-semibold">
                    {orderData.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-3 border-t pt-2">
              <h2 className="text-sm font-bold mb-1">Customer</h2>
              <div className="text-xs space-y-1">
                <p>{orderData.customerName}</p>
                <p>{orderData.customerPhone}</p>
                {orderData.orderType === OrderType.DELIVERY &&
                  orderData.address && (
                    <p className="text-gray-600">{orderData.address}</p>
                  )}
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-3 border-t pt-2">
              <h2 className="text-sm font-bold mb-2">Items</h2>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1">Item</th>
                    <th className="text-center py-1">Qty</th>
                    <th className="text-right py-1">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.items?.map((item, index) => (
                    <tr key={index} className="border-b border-dashed">
                      <td className="py-1">{item.productName}</td>
                      <td className="text-center py-1">{item.quantity}</td>
                      <td className="text-right py-1">
                        {fCurrencyVND(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="border-t pt-2">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    {fCurrencyVND(
                      orderData.items?.reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0,
                      ) || 0,
                    )}
                  </span>
                </div>
                {orderData.deliveryPrice > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className="font-semibold">
                      {fCurrencyVND(orderData.deliveryPrice)}
                    </span>
                  </div>
                )}
                {orderData.taxes > 0 && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span className="font-semibold">
                      {fCurrencyVND(orderData.taxes)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold border-t pt-1 mt-1">
                  <span>Total:</span>
                  <span>{fCurrencyVND(orderData.totalAmount || 0)}</span>
                </div>
                {orderData.paymentMethod === PaymentMethod.CASH && (
                  <>
                    <div className="flex justify-between">
                      <span>Paid:</span>
                      <span className="font-semibold">
                        {fCurrencyVND(orderData.customerPay || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Change:</span>
                      <span className="font-semibold">
                        {fCurrencyVND(
                          (orderData.customerPay || 0) -
                            (orderData.totalAmount || 0),
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-3 pt-2 border-t text-xs text-gray-600">
              <p>Thank you for your business!</p>
              <p>Please come again</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end border-t pt-4">
            <Button color="white" onClick={onClose}>
              Close
            </Button>
            <Button color="blue" onClick={handlePrint}>
              Print
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
