import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { NoticeOrganisationNameComponent } from '../notice-organisation-name/notice-organisation-name.component';

@Component({
  templateUrl: './notice-contact-number.component.html'
})

export class NoticeContactNumberComponent extends PageComponent<string> {
  public static route: string = 'notice-contact-number';
  static title: string = "Your telephone or mobile number – Tell the Building Safety Regulator about a mandatory occurrence";


  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Notice) {
      applicationService.model.Notice = {};
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice.ContactNumber)) {
      applicationService.model.Notice.ContactNumber = "";
    }
    this.model = applicationService.model.Notice?.ContactNumber;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Notice!.ContactNumber = this.model;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice?.FirstName) && FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice?.LastName)
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
    return this.navigationService.navigateRelative(NoticeOrganisationNameComponent.route, this.activatedRoute);
  }
}
