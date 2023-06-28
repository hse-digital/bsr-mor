import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ApplicationService } from "src/app/services/application.service";
import { ComponentsModule } from "../../../components/components.module";
import { HseRoute, HseRoutes } from "../../../helpers/hse.route";
import { AdviceEnterYourNameComponent } from "./advice-enter-your-name/advice-enter-your-name.component";



const routes = new HseRoutes([
  HseRoute.protected(AdviceEnterYourNameComponent.route, AdviceEnterYourNameComponent, AdviceEnterYourNameComponent.title),
]);

@NgModule({
  declarations: [
    AdviceEnterYourNameComponent,
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
export class AdvicePersonOrganisationModule {
  static baseRoute: string = "person-organisation";
}
