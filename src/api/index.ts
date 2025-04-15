import * as auth from "./auth";
import * as waiterOrder from "./waiter/order";
import * as chefOrder from "./chef/order";
import * as cashier from "./cashier";



class API {
  auth: typeof auth;
  waiterOrder: typeof waiterOrder;
  chefOrder: typeof chefOrder;
  cashier: typeof cashier;



  constructor() {
    this.auth = auth;
    this.waiterOrder = waiterOrder;
    this.chefOrder = chefOrder;
    this.cashier = cashier;

  }
}

const api = new API();

export default api;
