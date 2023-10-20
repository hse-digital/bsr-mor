import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ReportOrganisationNameComponent } from '../report-organisation-name/report-organisation-name.component';

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
  ErrorMessage: string = "You need to tell us your contact number";
  OrgNameInError: boolean = false;

  override isValid(): boolean {
    this.OrgNameInError = false;
    if (!FieldValidations.IsNotNullOrWhitespace(this.model)) {
      this.OrgNameInError = true;
    } else if (this.model!.length < 3) {
      this.ErrorMessage = "You need to enter a contact number that is longer than 2 characters"
      this.OrgNameInError = true;
    } if (this.model!.length > 50) {
      this.ErrorMessage = "You need to tell us your contact number using fewer characters"
      this.OrgNameInError = true;
    }
    this.modelValid = !this.OrgNameInError;
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(ReportOrganisationNameComponent.route, this.activatedRoute);
  }
}
