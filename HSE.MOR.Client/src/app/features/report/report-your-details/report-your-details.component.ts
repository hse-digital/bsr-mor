import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService, ReportModel } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ReportContactNumberComponent } from '../report-contact-number/report-contact-number.component';

@Component({
  templateUrl: './report-your-details.component.html'
})

export class ReportYourDetailsComponent extends PageComponent<ReportModel> {
  public static route: string = 'your-details';
  static title: string = "Your details - Submit a mandatory occurrence notice and report";
  override model: ReportModel = new ReportModel();


  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {}
    }
    this.model = applicationService.model.Report;
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.FirstName)) {
      applicationService.model.Report.FirstName = "";
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.LastName)) {
      applicationService.model.Report.LastName = "";
    }
    this.model.FirstName = applicationService.model.Report?.FirstName;
    this.model.LastName = applicationService.model.Report?.LastName;  
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Report!.FirstName = this.model.FirstName;
    applicationService.model.Report!.LastName = this.model.LastName;    
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.Building?.Address?.BcaReference) || FieldValidations.IsNotNullOrWhitespace(applicationService.model.Building?.Address?.HrbNumber)
      || FieldValidations.IsNotNullOrWhitespace(applicationService.model.Building?.Address?.Postcode) || FieldValidations.IsNotNullOrWhitespace(applicationService.model.Building?.LocateBuilding) || applicationService.model.Report?.SubmittedNotice != "me";
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

    if (!FieldValidations.IsNotNullOrWhitespace(this.model.FirstName) && !FieldValidations.IsNotNullOrWhitespace(this.model.LastName)) {
      this.firstAndLastNameInError = true;

    }
    if (!FieldValidations.IsNotNullOrWhitespace(this.model.FirstName)) {
      this.firstNameInError = true;

    } if (!FieldValidations.IsNotNullOrWhitespace(this.model.LastName)) {
      this.lastNameInError = true;

    } if (!FieldValidations.IsNotNullOrWhitespace(this.model.FirstName) && this.model.FirstName?.length! > 50) {

      this.firstNameErrorMessage = "You need to tell us your first name using fewer words";
      this.firstNameInError = true;

    } if (!FieldValidations.IsNotNullOrWhitespace(this.model.LastName) && this.model.LastName?.length! > 50) {

      this.lastNameErrorMessage = "You need to tell us your last name using fewer words";
      this.lastNameInError = true;

    }
    this.modelValid = this.firstAndLastNameInError || this.firstNameInError || this.lastNameInError ? false : true;
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(ReportContactNumberComponent.route, this.activatedRoute);
  }
}
