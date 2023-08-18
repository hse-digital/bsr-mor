import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './your-details.component.html'
})

export class YourDetailsComponent extends PageComponent<string> {
  public static route: string = 'your-details';
  static title: string = "Your details";


  override onInit(applicationService: ApplicationService): void {
    this.model = applicationService.model.NoticeReference;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.NoticeReference = this.model;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  modelValid: boolean = false;
  RefFormat = new RegExp('^CAS[0-9]{5}[A-Z0-9]{4}$', 'i'); // i parameter to make case insensitive
  ErrorMessage: string = "";
  ErrorRequired = "You need to enter a name";
  ErrorInvalid = "You need to enter a valid name";

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
