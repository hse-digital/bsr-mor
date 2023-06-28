import { Component } from '@angular/core';
import { PageComponent } from '../../helpers/page.component';
import { ApplicationService, ContactRequestModel } from "../../services/application.service";
import { FieldValidations } from "../../helpers/validators/fieldvalidations";
import { ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './request-about.component.html'
})

export class RequestAboutComponent extends PageComponent<ContactRequestModel> {
  public static route: string = 'request-about';
  static title: string = "What do you want to contact the Building Safety Regulator about";
  override model = new ContactRequestModel();

  override onInit(applicationService: ApplicationService): void {
    this.model = applicationService.model;
    this.model.Reason = applicationService.model.Reason;
    this.model.ReasonOther = applicationService.model.ReasonOther;
  }
 
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Reason = this.model.Reason;
    applicationService.model.ReasonOther = this.model.Reason === "other" ? this.model.ReasonOther : undefined;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  modelValid: boolean = false;
  hasReasonErrors: boolean = false;

  override isValid(): boolean {

    if (this.model.Reason === "other" && !FieldValidations.IsNotNullOrWhitespace(this.model.ReasonOther)) {
      this.modelValid = false;
    } else {
      this.modelValid = FieldValidations.IsNotNullOrWhitespace(this.model.Reason);
      this.hasReasonErrors = this.modelValid;
    } 
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigate('complaint-or-advice');
  }
}
