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
  firstAndLastNameInError: boolean = false;
  lastNameInError: boolean = false;
  modelValid: boolean = false;
  firstAndLastNameErrorMessage: string = "You need to tell us your first name and your last name";
  firstNameErrorMessage: string = "You need to tell us your first name";
  lastNameErrorMessage: string = "You need to tell us your last name";


  override isValid(): boolean {
    this.modelValid = false;
    this.firstNameInError = false;
    this.lastNameInError = false;
    this.firstAndLastNameInError = false;

    if (!FieldValidations.IsNotNullOrWhitespace(this.model.FirstName)) {
      this.firstNameInError = true;

    } if (!FieldValidations.IsNotNullOrWhitespace(this.model.LastName)) {
      this.lastNameInError = true;

    }
    if (!FieldValidations.IsNotNullOrWhitespace(this.model.FirstName) && !FieldValidations.IsNotNullOrWhitespace(this.model.LastName)) {
      this.firstAndLastNameInError = true;

    }
    if (!FieldValidations.IsNotNullOrWhitespace(this.model.FirstName) && this.model.FirstName?.length! > 50) {

      this.firstNameErrorMessage = "You need to tell us your first name using fewer words";
      this.firstNameInError = true;

    } if (!FieldValidations.IsNotNullOrWhitespace(this.model.LastName) && this.model.LastName?.length! > 50) {

      this.lastNameErrorMessage = "You need to tell us your last name using fewer words";
      this.lastNameInError = true;

    }
    this.modelValid = this.firstAndLastNameInError || this.firstNameInError || this.lastNameInError  ? false : true;
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(NoticeContactNumberComponent.route, this.activatedRoute);
  }
}
