import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ReportActingOrgRoleComponent } from '../report-acting-org-role/report-acting-org-role.component';

@Component({
  templateUrl: './report-acting-org.component.html'
})

export class ReportActingOrgComponent extends PageComponent<string> {
  public static route: string = 'report-acting-org';
  static title: string = "What is the name of the organisation you're acting for? - Submit a mandatory occurrence notice and report";


  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {};
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.ActingOrg)) {
      applicationService.model.Report.ActingOrg = "";
    }
    this.model = applicationService.model.Report?.ActingOrg;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Report!.ActingOrg = this.model;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.OrgRole) && applicationService.model.Report?.OrgRole == "on_behalf";
  }

  modelValid: boolean = false;
  ErrorMessage: string = "You need to tell us the organisation you are acting for";
  ActingOrgnError: boolean = false;

  override isValid(): boolean {
    this.ActingOrgnError = false;
    if (!FieldValidations.IsNotNullOrWhitespace(this.model)) {
      this.ActingOrgnError = true;
    }
    if (this.model!.length > 50) {
      this.ErrorMessage = "You need to tell us the organisation you are acting for  using fewer words"
      this.ActingOrgnError = true;
    }
    this.modelValid = !this.ActingOrgnError;
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(ReportActingOrgRoleComponent.route, this.activatedRoute);
  }
}
