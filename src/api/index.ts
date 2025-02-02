import * as auth from "./auth";
import * as employee from "./employee";
import * as supplier from "./supplier";
import * as table from "./table";
import * as inventory from "./inventory";
import * as menu from "./menu";
import * as itemCategory from "./item-category";
import * as menuCategory from "./menu-category";
import * as purchaseItem from "./purchase-item";

class API {
  auth: typeof auth;
  employee: typeof employee;
  supplier: typeof supplier;
  table: typeof table;
  inventory: typeof inventory;
  menu: typeof menu;
  itemCategory: typeof itemCategory;
  menuCategory: typeof menuCategory;
  purchaseItem: typeof purchaseItem;


  constructor() {
    this.auth = auth;
    this.employee = employee;
    this.supplier = supplier;
    this.table = table;
    this.inventory = inventory;
    this.menu = menu;
    this.itemCategory = itemCategory;
    this.menuCategory = menuCategory;
    this.purchaseItem = purchaseItem;
  }
}

const api = new API();

export default api;
