import * as auth from "./auth";
import * as supplier from "./supplier";
import * as order from "./waiter/order";


class API {
  auth: typeof auth;
  supplier: typeof supplier;
  order: typeof order;
  


  constructor() {
    this.auth = auth;
    this.supplier = supplier;
    this.order = order;

  }
}

const api = new API();

export default api;
