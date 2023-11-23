import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, NoticeModel } from 'src/app/services/application.service';
import { NoticeCheckYourAnswersComponent } from '../notice-check-your-answers/notice-check-your-answers.component';
import { WhenBecomeAwareComponent } from '../when-become-aware/when-become-aware.component';

@Component({
  selector: 'hse-briefly-describe-risk-incident',
  templateUrl: './briefly-describe-risk-incident.component.html'
})
export class BrieflyDescribeRiskIncidentComponent extends PageComponent<NoticeModel>  {
  public static route: string = 'briefly-describe-risk-incident';
  override model: NoticeModel = new NoticeModel();
  static title: string = "Notice details - Submit a mandatory occurrence notice and report";

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Notice) {
      applicationService.model.Notice = {}
    }
    this.model = applicationService.model.Notice;
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice.DescribeRiskIncident)) {
      applicationService.model.Notice.DescribeRiskIncident = "";
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice.ActionsToKeepSafe)) {
      applicationService.model.Notice.ActionsToKeepSafe = "";
    }

    this.model.DescribeRiskIncident = applicationService.model.Notice?.DescribeRiskIncident;
    this.model.ActionsToKeepSafe = applicationService.model.Notice?.ActionsToKeepSafe;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Notice!.DescribeRiskIncident = this.model.DescribeRiskIncident;
    applicationService.model.Notice!.ActionsToKeepSafe = this.model.ActionsToKeepSafe;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return applicationService.model.Notice?.WhenBecomeAware?.Year && applicationService.model.Notice?.WhenBecomeAware?.Month && applicationService.model.Notice?.WhenBecomeAware?.Day
      && applicationService.model.Notice?.WhenBecomeAware?.Hour && applicationService.model.Notice?.WhenBecomeAware?.Minute ? true : false;
  }

  describeIncidentRiskErrorMessage: string = "You need to briefly describe the risk or incident";
  actionsToKeepSafeErrorMessage: string = "You need to tell us what immediate actions you have taken";
  
  describeIncidentRiskInError: boolean = false;
  actionsToKeepSafeInError: boolean = false;
  
  modelValid: boolean = false;

  override isValid(): boolean {
    this.modelValid = false;
    this.describeIncidentRiskInError = false;
    this.actionsToKeepSafeInError = false;
   

    if (!FieldValidations.IsNotNullOrWhitespace(this.model.DescribeRiskIncident)) {
      this.describeIncidentRiskInError = true;

    } if (FieldValidations.IsNotNullOrWhitespace(this.model.DescribeRiskIncident) && this.model.DescribeRiskIncident?.length! > 200) {

      this.describeIncidentRiskErrorMessage = "You need to briefly describe the risk or incident in fewer words";
      this.describeIncidentRiskInError = true;

    } if (!FieldValidations.IsNotNullOrWhitespace(this.model.ActionsToKeepSafe)) {
      this.actionsToKeepSafeInError = true;

    } if (FieldValidations.IsNotNullOrWhitespace(this.model.ActionsToKeepSafe) && this.model.ActionsToKeepSafe?.length! > 200) {

      this.actionsToKeepSafeErrorMessage = "You need to tell us what immediate actions you have taken in fewer words";
      this.actionsToKeepSafeInError = true;

    } 
    this.modelValid = this.describeIncidentRiskInError || this.actionsToKeepSafeInError  ? false : true;
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(NoticeCheckYourAnswersComponent.route, this.activatedRoute);
  }

}
