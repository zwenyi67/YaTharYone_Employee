import * as auth from "./auth";
import * as supplier from "./supplier";
import * as waiterOrder from "./waiter/order";
import * as chefOrder from "./chef/order";



class API {
  auth: typeof auth;
  supplier: typeof supplier;
  waiterOrder: typeof waiterOrder;
  chefOrder: typeof chefOrder;



  constructor() {
    this.auth = auth;
    this.supplier = supplier;
    this.waiterOrder = waiterOrder;
    this.chefOrder = chefOrder;

  }
}

const api = new API();

export default api;
