import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService, NoticeModel, ReportModel} from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { BrieflyDescribeRiskIncidentComponent } from '../briefly-describe-risk-incident/briefly-describe-risk-incident.component';
import { NoticeContactNumberComponent } from '../notice-contact-number/notice-contact-number.component';

@Component({
  templateUrl: './notice-your-details.component.html'
})

export class NoticeYourDetailsComponent extends PageComponent<NoticeModel> {
  public static route: string = 'your-details';
  static title: string = "Your details - Submit a mandatory occurrence notice and report";
  override model: NoticeModel = new NoticeModel();


  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Notice) {
      applicationService.model.Notice = {}
    }
    this.model = applicationService.model.Notice;
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice.FirstName)) {
      applicationService.model.Notice.FirstName = "";
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice.LastName)) {
      applicationService.model.Notice.LastName = "";
    }
    this.model.FirstName = applicationService.model.Notice?.FirstName;
    this.model.LastName = applicationService.model.Notice?.LastName;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Notice!.FirstName = this.model.FirstName;
    applicationService.model.Notice!.LastName = this.model.LastName;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.Building?.Address?.BcaReference) || FieldValidations.IsNotNullOrWhitespace(applicationService.model.Building?.Address?.HrbNumber)
      || FieldValidations.IsNotNullOrWhitespace(applicationService.model.Building?.Address?.Postcode) || FieldValidations.IsNotNullOrWhitespace(applicationService.model.Building?.LocateBuilding);
  }

  firstNameInError: boolean = false;
  lastNameInError: boolean = false;

  override isValid(): boolean {
    this.firstNameInError = !FieldValidations.IsNotNullOrWhitespace(this.model.FirstName);
    this.lastNameInError = !FieldValidations.IsNotNullOrWhitespace(this.model.LastName);

    return !this.firstNameInError && !this.lastNameInError;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(NoticeContactNumberComponent.route, this.activatedRoute);
  }
}
