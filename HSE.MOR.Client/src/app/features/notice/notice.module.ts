import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ApplicationService } from "src/app/services/application.service";
import { ComponentsModule } from "../../components/components.module";
import { HseRoute, HseRoutes } from "../../helpers/hse.route";
import { NoticeYourDetailsComponent } from "./notice-your-details/notice-your-details.component";


const routes = new HseRoutes([
  HseRoute.protected(NoticeYourDetailsComponent.route, NoticeYourDetailsComponent, NoticeYourDetailsComponent.title),

]);

@NgModule({
  declarations: [
    NoticeYourDetailsComponent
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
export class NoticeModule {
  static baseRoute: string = "notice";
}
