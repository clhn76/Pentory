import {
  BookmarkIcon,
  GlobeIcon,
  HomeIcon,
  LibraryIcon,
  LinkIcon,
  // PenIcon,
} from "lucide-react";
import { SPACE_HREF_PREFIX } from "../space/config";

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
  // {
  //   groupLabel: "콘텐츠",
  //   items: [
  //     {
  //       label: "콘텐츠 생성",
  //       icon: PenIcon,
  //       href: "/dashboard/contents/create",
  //     },
  //   ],
  // },
  {
    groupLabel: "개별 요약",
    items: [
      {
        label: "URL 요약",
        icon: LinkIcon,
        href: "/dashboard/summary/url",
      },
    ],
  },
  {
    groupLabel: "요약 스페이스",
    items: [
      {
        label: "스페이스 둘러보기",
        icon: GlobeIcon,
        href: SPACE_HREF_PREFIX.PUBLIC,
      },
      {
        label: "개인 스페이스",
        icon: LibraryIcon,
        href: SPACE_HREF_PREFIX.MY,
      },
      {
        label: "구독 스페이스",
        icon: BookmarkIcon,
        href: SPACE_HREF_PREFIX.SUBSCRIBE,
      },
    ],
  },
];
