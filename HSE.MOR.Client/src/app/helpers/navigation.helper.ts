import { NotFoundComponent } from "../components/not-found/not-found.component";
import { BcaReferenceNumberComponent } from "../features/building/bca-reference-number/bca-reference-number.component";
import { BuildingAddressComponent } from "../features/building/building-address/building-address.component";
import { BuildingModule } from "../features/building/building.module";
import { HrbrReferenceNumberComponent } from "../features/building/hrbr-reference-number/hrbr-reference-number.component";
import { IdentifyBuildingComponent } from "../features/building/identify-building/identify-building.component";
import { NoticeYourDetailsComponent } from "../features/notice/notice-your-details/notice-your-details.component";
import { NoticeModule } from "../features/notice/notice.module";
import { EnterReferenceComponent } from "../features/report/enter-reference/enter-reference.component";
import { ReportYourDetailsComponent } from "../features/report/report-your-details/report-your-details.component";
import { ReportModule } from "../features/report/report.module";
import { ReportOrgRoleComponent } from "../features/report/report-org-role/report-org-role.component";

export class NavigationHelper {

  static route: any = {
    "notice": `/${NoticeModule.baseRoute}/${BuildingModule.baseRoute}/${IdentifyBuildingComponent.route}`,
    "report": `/${ReportModule.baseRoute}/${EnterReferenceComponent.route}`,
    "bca-reference-number": `/${BuildingModule.baseRoute}/${BcaReferenceNumberComponent.route}`,
    "report-bca-reference-number": `/${ReportModule.baseRoute}/${BuildingModule.baseRoute}/${BcaReferenceNumberComponent.route}`,
    "notice-bca-reference-number": `/${NoticeModule.baseRoute}/${BuildingModule.baseRoute}/${BcaReferenceNumberComponent.route}`,
    "hrb-number": `/${BuildingModule.baseRoute}/${HrbrReferenceNumberComponent.route}`,
    "report-hrb-number": `/${ReportModule.baseRoute}/${BuildingModule.baseRoute}/${HrbrReferenceNumberComponent.route}`,
    "notice-hrb-number": `/${NoticeModule.baseRoute}/${BuildingModule.baseRoute}/${HrbrReferenceNumberComponent.route}`,
    "notice-search-address": `/${NoticeModule.baseRoute}/${BuildingModule.baseRoute}/${BuildingAddressComponent.route}`,
    "report-search-address": `/${ReportModule.baseRoute}/${BuildingModule.baseRoute}/${BuildingAddressComponent.route}`,
    "report-identify-building": `/${ReportModule.baseRoute}/${BuildingModule.baseRoute}/${IdentifyBuildingComponent.route}`,
    "notice-identify-building": `/${NoticeModule.baseRoute}/${BuildingModule.baseRoute}/${IdentifyBuildingComponent.route}`,
    "notice-your-details": `/${NoticeModule.baseRoute}/${NoticeYourDetailsComponent.route}`,
    "report-your-details": `/${ReportModule.baseRoute}/${ReportYourDetailsComponent.route}`,
    "report-role-in-submit-notice": `/${ReportModule.baseRoute}/${ReportOrgRoleComponent.route}`,
  };

  static getRoute(key: string): string {
    let routeValue = this.route[key];
    return routeValue ? routeValue : NotFoundComponent.route;
  }

}
