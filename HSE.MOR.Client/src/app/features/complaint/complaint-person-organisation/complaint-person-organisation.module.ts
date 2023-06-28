import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ApplicationService } from "src/app/services/application.service";
import { ComponentsModule } from "../../../components/components.module";
import { HseRoute, HseRoutes } from "../../../helpers/hse.route";
import { ComplaintEnterYourNameComponent } from "./complaint-enter-your-name/complaint-enter-your-name.component";




const routes = new HseRoutes([
  HseRoute.protected(ComplaintEnterYourNameComponent.route, ComplaintEnterYourNameComponent, ComplaintEnterYourNameComponent.title),
]);

@NgModule({
  declarations: [
    ComplaintEnterYourNameComponent,
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
export class ComplaintPersonOrganisationModule {
  static baseRoute: string = "person-organisation";
}
