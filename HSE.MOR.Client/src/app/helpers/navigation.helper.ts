import { NotFoundComponent } from "../components/not-found/not-found.component";
import { BuildingModule } from "../features/building/building.module";
import { IdentifyBuildingComponent } from "../features/building/identify-building/identify-building.component";
import { NoticeModule } from "../features/notice/notice.module";
import { EnterReferenceComponent } from "../features/report/enter-reference/enter-reference.component";
import { ReportModule } from "../features/report/report.module";

export class NavigationHelper {

  static route: any = {
    "notice": `/${NoticeModule.baseRoute}/${BuildingModule.baseRoute}/${IdentifyBuildingComponent.route}`,
    "report": `/${ReportModule.baseRoute}/${EnterReferenceComponent.route}`,
    "report-identify-building": `/${ReportModule.baseRoute}/${BuildingModule.baseRoute}/${IdentifyBuildingComponent.route}`,
    "notice-identify-building": `/${NoticeModule.baseRoute}/${BuildingModule.baseRoute}/${IdentifyBuildingComponent.route}`,
  };

  static getRoute(key: string): string {
    let routeValue = this.route[key];
    return routeValue ? routeValue : NotFoundComponent.route;
  }

}
