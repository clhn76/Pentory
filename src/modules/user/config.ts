import { CreditCardIcon, TicketIcon } from "lucide-react";

export const USER_DROPDOWN_NAVS = [
  {
    label: "구독 / 결제 정보",
    icon: CreditCardIcon,
    href: "/dashboard/billing",
  },
  {
    label: "이용권 구매",
    icon: TicketIcon,
    href: "/dashboard/plans",
  },
];
