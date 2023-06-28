import { NotFoundComponent } from "../components/not-found/not-found.component";

export class NavigationHelper {

  static route: any = {
  };

  static getRoute(key: string): string {
    let routeValue = this.route[key];
    return routeValue ? routeValue : NotFoundComponent.route;
  }

}
