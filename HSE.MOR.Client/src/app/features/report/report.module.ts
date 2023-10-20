import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ApplicationService } from "src/app/services/application.service";
import { ComponentsModule } from "../../components/components.module";
import { HseRoute, HseRoutes } from "../../helpers/hse.route";
import { BuildingModule } from "../building/building.module";
import { EnterReferenceComponent } from "./enter-reference/enter-reference.component";
import { TypeIncidentReportedComponent } from "./type-incident-reported/type-incident-reported.component";
import { TypeRiskReportedComponent } from "./type-risk-reported/type-risk-reported.component";
import { WhatToReportComponent } from "./what-to-report/what-to-report.component";
import { ReportYourDetailsComponent } from "./report-your-details/report-your-details.component";
import { WhoSubmittedNoticeComponent } from "./who-submitted-notice/who-submitted-notice.component";
import { IncidentDetailsComponent } from "./incident-details/incident-details.component";
import { RiskDetailsComponent } from "./risk-details/risk-details.component";
import { ReportSupportInfoComponent } from "./report-support-info/report-support-info.component";
import { RoleInSubmitNoticeComponent } from "./role-in-submit-notice/role-in-submit-notice.component";


const routes = new HseRoutes([
  HseRoute.protected(EnterReferenceComponent.route, EnterReferenceComponent, EnterReferenceComponent.title),
  HseRoute.protected(WhatToReportComponent.route, WhatToReportComponent, WhatToReportComponent.title),
  HseRoute.protected(TypeIncidentReportedComponent.route, TypeIncidentReportedComponent, TypeIncidentReportedComponent.title),
  HseRoute.protected(TypeRiskReportedComponent.route, TypeRiskReportedComponent, TypeRiskReportedComponent.title),
  HseRoute.protected(WhoSubmittedNoticeComponent.route, WhoSubmittedNoticeComponent, WhoSubmittedNoticeComponent.title),
  HseRoute.protected(ReportYourDetailsComponent.route, ReportYourDetailsComponent, ReportYourDetailsComponent.title),
  HseRoute.protected(IncidentDetailsComponent.route, IncidentDetailsComponent, IncidentDetailsComponent.title),
  HseRoute.protected(RiskDetailsComponent.route, RiskDetailsComponent, RiskDetailsComponent.title),
  HseRoute.protected(ReportSupportInfoComponent.route, ReportSupportInfoComponent, ReportSupportInfoComponent.title),
  HseRoute.protected(RoleInSubmitNoticeComponent.route, RoleInSubmitNoticeComponent, RoleInSubmitNoticeComponent.title),
  HseRoute.forLoadChildren(BuildingModule.baseRoute, () => import('../building/building.module').then(m => m.BuildingModule)),
]);

@NgModule({
  declarations: [
    EnterReferenceComponent,
    WhatToReportComponent,
    ReportYourDetailsComponent,
    WhoSubmittedNoticeComponent,
    TypeIncidentReportedComponent,
    TypeRiskReportedComponent,
    IncidentDetailsComponent,
    RiskDetailsComponent,
    ReportSupportInfoComponent,
    RoleInSubmitNoticeComponent,
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule,
    ComponentsModule
  ],
  providers: [HttpClient, ApplicationService, ...routes.getProviders()]
})
export class ReportModule {
  static baseRoute: string = "report";
}
