import {
  ArrowRightLeft,
  Gauge,
  Store,
} from "lucide-react";

export const sidebarData = [
  {
    routeNames: ["/cashier/dashboard"],
    name: "title.dashboard",
    icon: Gauge,
  },
  {
    routeNames: ["/cashier/orders/tables"],
    name: "title.orders",
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
];
