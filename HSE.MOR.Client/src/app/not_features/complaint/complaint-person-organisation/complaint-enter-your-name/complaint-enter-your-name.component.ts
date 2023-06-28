import { Component } from '@angular/core';
import { PageComponent } from '../../../../helpers/page.component';
import { ApplicationService, ComplaintModel, ContactRequestModel } from "../../../../services/application.service";
import { FieldValidations } from "../../../../helpers/validators/fieldvalidations";
import { ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './complaint-enter-your-name.component.html'
})

export class ComplaintEnterYourNameComponent extends PageComponent<ComplaintModel> {
  public static route: string = 'enter-your-name';
  static title: string = "Your name";
  override model: ComplaintModel = new ComplaintModel();

  override onInit(applicationService: ApplicationService): void {
    this.model = applicationService.model.Complaint;
    this.model.FirstName = applicationService.model.Complaint.FirstName;
    this.model.LastName = applicationService.model.Complaint.LastName; 
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Complaint = this.model;
    applicationService.model.Complaint.FirstName = this.model.FirstName;
    applicationService.model.Complaint.LastName = this.model.LastName;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return (FieldValidations.IsNotNullOrWhitespace(applicationService.model.RequestType) && applicationService.model.RequestType == "complaint") &&
      FieldValidations.IsNotNullOrWhitespace(applicationService.model.Reason) && applicationService.model.Reason == "person_or_organisation";
  }

  firstNameInError: boolean = false;
  lastNameInError: boolean = false;

  override isValid(): boolean {
    this.firstNameInError = !FieldValidations.IsNotNullOrWhitespace(this.model.FirstName);
    this.lastNameInError = !FieldValidations.IsNotNullOrWhitespace(this.model.LastName);

    return !this.firstNameInError && !this.lastNameInError;
  }
  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigate('');
  }
}
