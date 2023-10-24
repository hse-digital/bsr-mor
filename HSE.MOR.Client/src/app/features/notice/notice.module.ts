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
import { BuildingModule } from '../building/building.module';
import { NoticeYourDetailsComponent } from './notice-your-details/notice-your-details.component';
import { NoticeCheckYourAnswersComponent } from './notice-check-your-answers/notice-check-your-answers.component';
import { NoticeContactNumberComponent } from './notice-contact-number/notice-contact-number.component';
import { NoticeOrganisationNameComponent } from './notice-organisation-name/notice-organisation-name.component';
import { NoticeOrgRoleComponent } from './notice-org-role/notice-org-role.component';
import { NoticeDutyHolderCanSubmitComponent } from './notice-duty-holder-can-submit/notice-duty-holder-can-submit.component';
import { NoticeConfirmationComponent } from './notice-confirmation/notice-confirmation.component';
import { PipeModule } from '../../helpers/pipes/pipe.module';
import { NoticeSummaryComponent } from './notice-summary/notice-summary.component';

const routes = new HseRoutes([
  HseRoute.protected(BrieflyDescribeRiskIncidentComponent.route, BrieflyDescribeRiskIncidentComponent, BrieflyDescribeRiskIncidentComponent.title),
  HseRoute.protected(WhenBecomeAwareComponent.route, WhenBecomeAwareComponent, WhenBecomeAwareComponent.title),
  HseRoute.protected(NoticeYourDetailsComponent.route, NoticeYourDetailsComponent, NoticeYourDetailsComponent.title),
  HseRoute.protected(NoticeCheckYourAnswersComponent.route, NoticeCheckYourAnswersComponent, NoticeCheckYourAnswersComponent.title),
  HseRoute.protected(NoticeContactNumberComponent.route, NoticeContactNumberComponent, NoticeContactNumberComponent.title),
  HseRoute.protected(NoticeOrganisationNameComponent.route, NoticeOrganisationNameComponent, NoticeOrganisationNameComponent.title),
  HseRoute.protected(NoticeOrgRoleComponent.route, NoticeOrgRoleComponent, NoticeOrgRoleComponent.title),
  HseRoute.protected(NoticeDutyHolderCanSubmitComponent.route, NoticeDutyHolderCanSubmitComponent, NoticeDutyHolderCanSubmitComponent.title),
  HseRoute.protected(NoticeConfirmationComponent.route, NoticeConfirmationComponent, NoticeConfirmationComponent.title),
  HseRoute.protected(NoticeSummaryComponent.route, NoticeSummaryComponent, NoticeSummaryComponent.title),
  HseRoute.forLoadChildren(BuildingModule.baseRoute, () => import('../building/building.module').then(m => m.BuildingModule))
]);

@NgModule({
  declarations: [
    BrieflyDescribeRiskIncidentComponent,
    WhenBecomeAwareComponent,
    NoticeYourDetailsComponent,
    NoticeCheckYourAnswersComponent,
    NoticeContactNumberComponent,
    NoticeOrganisationNameComponent,
    NoticeCheckYourAnswersComponent,
    NoticeOrgRoleComponent,
    NoticeDutyHolderCanSubmitComponent,
    NoticeConfirmationComponent,
    NoticeSummaryComponent,
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule,
    ComponentsModule,
    PipeModule,
  ],
  providers: [HttpClient, ApplicationService, ...routes.getProviders()]
})
export class NoticeModule {
  static baseRoute: string = "notice";
}
