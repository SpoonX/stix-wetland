import { Route } from 'stix';

export class DbRoute {
  public static find (endpoint: string, controller: string | { new (): Object }) {
    return Route.get(endpoint, controller, 'find');
  }

  public static findOne (endpoint: string, controller: string | { new (): Object }) {
    return Route.get(`${endpoint}/:id`, controller, 'findOne');
  }

  public static create (endpoint: string, controller: string | { new (): Object }) {
    return Route.post(endpoint, controller, 'create');
  }

  public static modify (endpoint: string, controller: string | { new (): Object }) {
    return Route.patch(`${endpoint}/:id`, controller, 'modify');
  }

  public static destroy (endpoint: string, controller: string | { new (): Object }) {
    return Route.delete(`${endpoint}/:id`, controller, 'destroy');
  }

  public static all (endpoint: string, controller: string | { new (): Object }) {
    return [
      this.find(endpoint, controller),
      this.findOne(endpoint, controller),
      this.create(endpoint, controller),
      this.modify(endpoint, controller),
      this.destroy(endpoint, controller),
    ];
  }
}
