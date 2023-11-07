import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ReportOrganisationNameComponent } from '../report-organisation-name/report-organisation-name.component';
import { PhoneNumberValidator } from '../../../helpers/validators/phone-number-validator';

@Component({
  templateUrl: './report-contact-number.component.html'
})

export class ReportContactNumberComponent extends PageComponent<string> {
  public static route: string = 'report-contact-number';
  static title: string = "Your telephone or mobile number – Tell the Building Safety Regulator about a mandatory occurrence";


  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {};
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.ContactNumber)) {
      applicationService.model.Report.ContactNumber = "";
    }
    this.model = applicationService.model.Report?.ContactNumber;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Report!.ContactNumber = this.model;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.FirstName) && FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.LastName)
  }

  modelValid: boolean = false;
  ErrorMessage: string = "You need to enter a real contact number";
  ContactNumberInError: boolean = false;
  ContactNumberLengthInError: boolean = false;

  override isValid(): boolean {
    this.ContactNumberInError = false;
    this.ContactNumberLengthInError = false;
    if (!FieldValidations.IsNotNullOrWhitespace(this.model)) {
      this.ContactNumberInError = true;
    } if (!PhoneNumberValidator.isValid(this.model ?? '')) {
      this.ContactNumberInError = true;
    } if (this.model!.length < 3) {
      this.ContactNumberLengthInError = true;
    } if (this.model!.length > 50) {
      this.ContactNumberLengthInError = true;
    }
    this.modelValid = this.ContactNumberInError || this.ContactNumberLengthInError ? false : true;
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(ReportOrganisationNameComponent.route, this.activatedRoute);
  }
}
