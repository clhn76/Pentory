import {
  loadTossPayments,
  TossPaymentsWidgets,
} from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";

const clientKey = "test_gck_nRQoOaPz8LD4yLB5ozXj8y47BMw6";
// const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

interface CheckoutProps {
  amount: number;
  currency?: string;
  orderName: string;
  userName: string;
  userEmail: string;
  userId: string;
}

export function Checkout({
  amount,
  currency = "KRW",
  orderName,
  userName,
  userEmail,
  userId,
}: CheckoutProps) {
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);

  useEffect(() => {
    if (widgets) return;

    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(clientKey);
      const widgets = tossPayments.widgets({
        customerKey: userId,
      });
      setWidgets(widgets);
      return widgets;
    }

    async function renderPaymentWidgets(widgets: TossPaymentsWidgets) {
      if (widgets == null) return;
      await widgets.setAmount({
        currency,
        value: amount,
      });
      await Promise.all([
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        }),
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);
      setReady(true);
    }

    fetchPaymentWidgets().then(renderPaymentWidgets);
  }, [amount, currency, userId, widgets]);

  useEffect(() => {
    if (widgets == null) return;
    widgets.setAmount({
      currency,
      value: amount,
    });
  }, [widgets, amount, currency]);

  const handlePayment = async () => {
    if (!widgets) return;

    const orderId = crypto.randomUUID();

    try {
      await widgets.requestPayment({
        orderId,
        orderName,
        successUrl: window.location.origin + "/payments/success",
        failUrl: window.location.origin + "/payments/fail",
        customerEmail: userEmail,
        customerName: userName,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div id="payment-method" className="w-full" />
        <div id="agreement" className="w-full" />

        <button
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors
            ${
              ready
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          disabled={!ready}
          onClick={handlePayment}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}
