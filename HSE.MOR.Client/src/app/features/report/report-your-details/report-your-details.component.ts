import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService, ReportModel } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './report-your-details.component.html'
})

export class ReportYourDetailsComponent extends PageComponent<ReportModel> {
  public static route: string = 'your-details';
  static title: string = "Your details";
  override model: ReportModel = new ReportModel();


  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {}
    }
    this.model = applicationService.model.Report;
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.FirstName)) {
      applicationService.model.Report.FirstName = "";
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.LastName)) {
      applicationService.model.Report.LastName = "";
    }
    this.model.FirstName = applicationService.model.Report?.FirstName;
    this.model.LastName = applicationService.model.Report?.LastName;  
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Report!.FirstName = this.model.FirstName;
    applicationService.model.Report!.LastName = this.model.LastName;
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
