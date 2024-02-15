import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRouteSnapshot } from "@angular/router";
import { ReportWhenBecomeAwareComponent } from '../report-when-become-aware/report-when-become-aware.component';
import { ReportActingOrgComponent } from '../report-acting-org/report-acting-org.component';


@Component({
  templateUrl: './report-acting-org-type.component.html'
})

export class ReportActingOrgTypeComponent extends PageComponent<string> {
  public static route: string = 'report-acting-org-type';
  static title: string = "Report Organisation Type - Submit a mandatory occurrence notice and report";

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {};
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.ActingOrgType)) {
      applicationService.model.Report.ActingOrgType = "";
    }
    this.model = applicationService.model.Report.ActingOrgType;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Report!.ActingOrgType = this.model;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.OrgRole) && applicationService.model.Report?.OrgRole == "on_behalf";
  }

  modelValid: boolean = true;
  hasActingOrgTypeErrors: boolean = true;


  isValid(): boolean {
    this.modelValid = !FieldValidations.IsNotNullOrWhitespace(this.model);
    this.hasActingOrgTypeErrors = this.modelValid;
    return !this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(ReportActingOrgComponent.route, this.activatedRoute);
  }
}
