import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService, ReportModel} from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './notice-your-details.component.html'
})

export class NoticeYourDetailsComponent extends PageComponent<ReportModel> {
  public static route: string = 'your-details';
  static title: string = "Your details";
  override model: ReportModel = new ReportModel();


  override onInit(applicationService: ApplicationService): void {
    this.model = applicationService.model;
    this.model.FirstName = applicationService.model.FirstName;
    this.model.LastName = applicationService.model.LastName;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.FirstName = this.model.FirstName;
    applicationService.model.LastName = this.model.LastName;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
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
