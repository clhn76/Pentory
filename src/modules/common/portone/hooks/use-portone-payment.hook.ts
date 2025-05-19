import { useGetUser } from "@/modules/common/next-auth/hooks/use-get-user.hook";
import PortOne from "@portone/browser-sdk/v2";

type RequestPaymentProps = {
  totalAmount: number;
  orderName: string;
  customData?: Record<string, string>;
};

export const usePortonePayment = () => {
  const user = useGetUser();

  const requestPayment = async ({
    totalAmount,
    orderName,
    customData,
  }: RequestPaymentProps) => {
    if (!user) {
      throw new Error("User not found");
    }

    const paymentId = crypto.randomUUID();

    const res = await PortOne.requestPayment({
      paymentId,
      totalAmount,
      orderName,
      currency: "CURRENCY_KRW",
      payMethod: "CARD",
      storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
      channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
      customer: {
        customerId: user.id,
        fullName: user.name || undefined,
        email: user.email || undefined,
      },
      customData,
    });

    if (res?.code) {
      throw new Error(res.message);
    }

    return res;
  };

  return {
    requestPayment,
  };
};
