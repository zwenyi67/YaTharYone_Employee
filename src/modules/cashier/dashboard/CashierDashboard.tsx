import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, Printer, CheckCircle, XCircle, ReceiptText } from "lucide-react";
import api from "@/api";
import { GetPaymentOrder, ProcessPaymentPayloadType } from "@/api/cashier/types";
import { toast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { hideLoader, openLoader } from "@/store/features/loaderSlice";

// Payment Methods
const PAYMENT_METHODS = [
  { name: "cash", icon: <CreditCard className="size-4 mr-2" /> },
  { name: "kpay", icon: <CreditCard className="size-4 mr-2" /> },
  { name: "wave", icon: <CreditCard className="size-4 mr-2" /> },
];

const CashierDashboard = () => {
  const { data: orders = [], isFetching, refetch } = api.cashier.paymentOrder.useQuery();
  const [selectedOrder, setSelectedOrder] = useState<GetPaymentOrder | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const totalOrders = orders.length;
  const unpaidOrders = orders.filter((o) => o.payment_status === "pending").length;
  const completedOrders = orders.filter((o) => o.payment_status === "completed").length;

  const dispatch = useDispatch();

  const handleProcessPayment = (method: string) => {
    console.log(`Processing payment with ${method}`);
    setIsPaymentOpen(false);
    setIsReceiptOpen(true);
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const { mutate: processPayment } =
    api.cashier.processPayment.useMutation({
      onMutate: () => {
        dispatch(openLoader());
      },
      onSuccess: () => {
        toast({
          title: "Payment Process Completed",
          variant: "success",
        });
        setIsPaymentOpen(false);
        setSelectedOrder(null);
        refetch();
      },
      onError: (error) => {
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
      onSettled: () => {
        dispatch(hideLoader());
      },
    });

  const handleConfirmPayment = async (order: GetPaymentOrder) => {
    if (!selectedOrder || !selectedPaymentMethod) return;

    const payload: ProcessPaymentPayloadType = {
      payment_id: order.payment_id,
      payment_method: selectedPaymentMethod,
      payment_status: 'pending',
      table_id: order.table.id,
      order_id: order.id,
    }
    processPayment(payload);

    // try {
    //   await api.cashier.completePayment.mutateAsync({
    //     orderId: selectedOrder.id,
    //     paymentMethod: selectedPaymentMethod,
    //   });

    //   toast.success("Payment completed successfully!");
    //   setIsPaymentOpen(false);
    //   setSelectedOrder(null);
    //   refetch(); // Refresh order list
    // } catch (error) {
    //   toast.error("Payment failed. Try again.");
    // }
  };

  const printReceipt = () => window.print();

  return (
    <section className="m-4">
      {/* Dashboard Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-100 border border-green-300 rounded-lg text-center">
          <h2 className="text-lg font-bold">Completed Orders</h2>
          <p className="text-2xl font-semibold">{completedOrders}</p>
        </div>
        <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg text-center">
          <h2 className="text-lg font-bold">Total Orders</h2>
          <p className="text-2xl font-semibold">{totalOrders}</p>
        </div>
        <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-center">
          <h2 className="text-lg font-bold">Pending Payments</h2>
          <p className="text-2xl font-semibold">{unpaidOrders}</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`p-4 border rounded-lg shadow-md ${order.payment_status === "pending" ? "bg-red-50" : "bg-green-50"
                }`}
            >
              <h3 className="text-lg font-bold">Order #{order.order_number}</h3>
              <p>Table: {order.table.table_no}</p>
              <p
                className={`font-semibold ${order.payment_status === "pending" ? "text-red-600" : "text-green-600"
                  }`}
              >
                {order.payment_status === "pending" ? "Pending" : "Completed"}
              </p>
              <div className="flex gap-2 mt-2">
                {order.payment_status === "pending" ? (
                  <Button variant="outline" onClick={() => { setSelectedOrder(order); setIsPaymentOpen(true); }}>
                    <CreditCard className="size-4 mr-2" />
                    Process Payment
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => { setSelectedOrder(order); setIsReceiptOpen(true); }}>
                    <ReceiptText className="size-4 mr-2" />
                    View Receipt
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Dialog */}
      {selectedOrder && (
        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
          <DialogContent className="w-full max-w-md">
            <DialogTitle>Process Payment</DialogTitle>
            <p className="text-center text-gray-600">Select a payment method:</p>

            {/* Total Amount */}
            <div className="text-center text-lg font-semibold text-gray-800 mt-2">
              Total: ${selectedOrder.order_details.reduce((sum, item) => sum + item.quantity * item.menu.price, 0).toFixed(2)}
            </div>

            {/* Payment Method Selection */}
            <div className="mt-4">
              {PAYMENT_METHODS.map((method) => (
                <label key={method.name} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.name}
                    checked={selectedPaymentMethod === method.name}
                    onChange={() => setSelectedPaymentMethod(method.name)}
                    className="form-radio text-blue-600"
                  />
                  {method.icon}
                  <span className="font-medium">{method.name}</span>
                </label>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="default" onClick={() => setIsPaymentOpen(false)}>
                <XCircle className="size-4 mr-2" />
                Cancel
              </Button>
              <Button
                variant="default"
                disabled={!selectedPaymentMethod}
                onClick={() => handleConfirmPayment(selectedOrder)}
              >
                <CheckCircle className="size-4 mr-2" />
                Confirm Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}



      {/* Receipt Dialog */}
      {selectedOrder && (
        <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
          <DialogContent className="w-full max-w-lg">
            <DialogTitle>Order Receipt</DialogTitle>
            <div className="p-4 border rounded-lg shadow-md bg-gray-50">
              <h3 className="text-lg font-bold">Payment #{selectedOrder.payment_number}</h3>
              <h3 className="text-lg font-bold">Order #{selectedOrder.order_number}</h3>
              <p>Table: {selectedOrder.table.table_no}</p>
              <hr className="my-2" />
              <div className="text-sm">
                {selectedOrder.order_details.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.quantity}x {item.menu.name}</span>
                    <span>${(item.quantity * item.menu.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <hr className="my-2" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={printReceipt}>
                <Printer className="size-4 mr-2" />
                Print Receipt
              </Button>
              <Button variant="default" onClick={() => setIsReceiptOpen(false)}>
                <XCircle className="size-4 mr-2" />
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default CashierDashboard;
