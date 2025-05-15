import { BookmarkIcon, GlobeIcon, HomeIcon, LibraryIcon } from "lucide-react";

export const DASHBOARD_GROUPS = [
  {
    groupLabel: "",
    items: [
      {
        label: "홈",
        icon: HomeIcon,
        href: "/dashboard",
      },
    ],
  },
  {
    groupLabel: "요약 정리",
    items: [
      {
        label: "스페이스 둘러보기",
        icon: GlobeIcon,
        href: "/dashboard/public-spaces",
      },
      {
        label: "개인 스페이스",
        icon: LibraryIcon,
        href: "/dashboard/spaces",
      },
      {
        label: "구독 스페이스",
        icon: BookmarkIcon,
        href: "/dashboard/subscribe-spaces",
      },
    ],
  },
];
