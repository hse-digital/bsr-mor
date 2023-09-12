import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './enter-reference.component.html'
})

export class EnterReferenceComponent extends PageComponent<string> {
  public static route: string = 'enter-reference';
  static title: string = "Enter mandatory occurrence notice reference – Tell the Building Safety Regulator about a mandatory occurrence";


  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {};
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.NoticeReference)) {
      applicationService.model.Report.NoticeReference = "";
    }
    this.model = applicationService.model.Report?.NoticeReference;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Report!.NoticeReference = this.model;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  modelValid: boolean = false;
  RefFormat = new RegExp('^CAS[0-9]{5}[A-Z0-9]{4}$', 'i'); // i parameter to make case insensitive
  ErrorMessage: string = "";
  ErrorRequired = "You need to enter a notice reference";
  ErrorInvalid = "You need to enter a valid notice reference";

  override isValid(): boolean {
    if (!FieldValidations.IsNotNullOrWhitespace(this.model)) {
      this.modelValid = false;
      this.ErrorMessage = this.ErrorRequired;
    }
    else if (!this.RefFormat.test(this.model!)) {
      this.modelValid = false;
      this.ErrorMessage = this.ErrorInvalid;
    }
    else {
      this.modelValid = true;
    }
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigate('');
  }
}
