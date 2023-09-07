import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrieflyDescribeRiskIncidentComponent } from './briefly-describe-risk-incident/briefly-describe-risk-incident.component';
import { HseAngularModule } from 'hse-angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { ApplicationService } from 'src/app/services/application.service';
import { HseRoute, HseRoutes } from 'src/app/helpers/hse.route';
import { WhenBecomeAwareComponent } from './when-become-aware/when-become-aware.component';

const routes = new HseRoutes([
  HseRoute.protected(BrieflyDescribeRiskIncidentComponent.route, BrieflyDescribeRiskIncidentComponent, BrieflyDescribeRiskIncidentComponent.title),
  HseRoute.protected(WhenBecomeAwareComponent.route, WhenBecomeAwareComponent, WhenBecomeAwareComponent.title),
]);

@NgModule({
  declarations: [
    BrieflyDescribeRiskIncidentComponent,
    WhenBecomeAwareComponent
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
