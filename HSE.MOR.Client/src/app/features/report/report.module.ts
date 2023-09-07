import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ApplicationService } from "src/app/services/application.service";
import { ComponentsModule } from "../../components/components.module";
import { HseRoute, HseRoutes } from "../../helpers/hse.route";
import { EnterReferenceComponent } from "./enter-reference/enter-reference.component";
import { ReportYourDetailsComponent } from "./report-your-details/report-your-details.component";


const routes = new HseRoutes([
  HseRoute.protected(EnterReferenceComponent.route, EnterReferenceComponent, EnterReferenceComponent.title),
  HseRoute.protected(ReportYourDetailsComponent.route, ReportYourDetailsComponent, ReportYourDetailsComponent.title),

]);

@NgModule({
  declarations: [
    EnterReferenceComponent, ReportYourDetailsComponent
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
