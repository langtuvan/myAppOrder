import CheckOut from "@/components/CheckOut";
import { OrderWebNewForm } from "@/sections/form/OrderNewEditForm";
import { OrderExport, OrderType } from "@/types/order";

export default function CheckOutPage() {
  return (
    <OrderWebNewForm
      orderType={OrderType.WEBSITE}
      orderExport={OrderExport.NORMAL}    
    />
  );
}
