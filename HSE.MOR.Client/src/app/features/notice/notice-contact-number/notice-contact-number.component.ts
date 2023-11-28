import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService, ContactModel } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { NoticeOrganisationNameComponent } from '../notice-organisation-name/notice-organisation-name.component';
import { PhoneNumberValidator } from '../../../helpers/validators/phone-number-validator';

@Component({
  templateUrl: './notice-contact-number.component.html'
})

export class NoticeContactNumberComponent extends PageComponent<string> {
  public static route: string = 'notice-contact-number';
  static title: string = "Your telephone or mobile number - Submit a mandatory occurrence notice and report";


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
    var contactModel = new ContactModel();
    contactModel.EmailAddress = applicationService.model.EmailAddress;
    contactModel.FirstName = applicationService.model.Notice?.FirstName;
    contactModel.LastName = applicationService.model.Notice?.LastName;
    contactModel.ContactNumber = applicationService.model.Notice!.ContactNumber;
    //applicationService.createContactIfNotExists(contactModel);
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice?.FirstName) && FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice?.LastName)
  }

  modelValid: boolean = false;
  ErrorMessage: string = "Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192";
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
    return this.navigationService.navigateRelative(NoticeOrganisationNameComponent.route, this.activatedRoute);
  }
}
