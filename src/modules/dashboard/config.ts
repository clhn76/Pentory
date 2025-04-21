import { ArrowRightLeftIcon, CreditCardIcon, HomeIcon } from "lucide-react";

export const DASHBOARD_MENU_ITEMS = [
  {
    label: "홈",
    icon: HomeIcon,
    href: "/dashboard",
  },
];

export const USER_DROPDOWN_NAVS = [
  {
    label: "결제",
    icon: CreditCardIcon,
    href: "/dashboard/billing",
  },
  {
    label: "플랜 변경",
    icon: ArrowRightLeftIcon,
    href: "/dashboard/plans",
  },
];
