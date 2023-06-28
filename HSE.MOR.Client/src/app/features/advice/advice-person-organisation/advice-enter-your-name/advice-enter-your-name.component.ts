import { Component } from '@angular/core';
import { PageComponent } from '../../../../helpers/page.component';
import { AdviceModel, ApplicationService, ContactRequestModel } from "../../../../services/application.service";
import { FieldValidations } from "../../../../helpers/validators/fieldvalidations";
import { ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './advice-enter-your-name.component.html'
})

export class AdviceEnterYourNameComponent extends PageComponent<AdviceModel> {
  public static route: string = 'enter-your-name';
  static title: string = "Your name";
  override model: AdviceModel = new AdviceModel();

  override onInit(applicationService: ApplicationService): void {
    this.model = applicationService.model.Advice;
    this.model.FirstName = applicationService.model.Advice.FirstName;
    this.model.LastName = applicationService.model.Advice.LastName; 
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Advice = this.model;
    applicationService.model.Advice.FirstName = this.model.FirstName;
    applicationService.model.Advice.LastName = this.model.LastName;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return (FieldValidations.IsNotNullOrWhitespace(applicationService.model.RequestType) && applicationService.model.RequestType == "advice") &&
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
