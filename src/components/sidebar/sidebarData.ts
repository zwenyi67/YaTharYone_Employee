import {
  ArrowRightLeft,
  Gauge,
  Store,
  User2Icon,
} from "lucide-react";

export const sidebarData = [
  {
    routeNames: ["/dashboard"],
    name: "title.dashboard",
    icon: Gauge,
  },
  {
    routeNames: [""],
    name: "title.supplier-management",
    icon: Store,
    subMenu: [
      {
        routeNames: ["/supplier-management/suppliers"],
        name: "title.suppliers",
        icon: Store,
      },
      {
        routeNames: ["/supplier-management/purchasehistories"],
        name: "title.purchases",
        icon: ArrowRightLeft,
      },
    ],
  },
  {
    routeNames: ["/employee-management"],
    name: "title.employee-management",
    icon: User2Icon,
    subMenu: [],
  },
];
