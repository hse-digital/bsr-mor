import { Component, ViewChild } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ReportDutyHolderCanSubmitComponent } from '../report-duty-holder-can-submit/report-duty-holder-can-submit.component';
import { TypeIncidentReportedComponent } from '../type-incident-reported/type-incident-reported.component';

@Component({
  templateUrl: './report-acting-org-role.component.html'
})

export class ReportActingOrgRoleComponent extends PageComponent<string> {
  public static route: string = 'report-acting-org-role';
  static title: string = "How is undefined involved in this building? - Submit a mandatory occurrence notice and report";
  organisationName?: string;

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {};
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.ActingOrgRole)) {
      applicationService.model.Report.ActingOrgRole = "";
    }
    this.model = applicationService.model.Report.ActingOrgRole;
    this.organisationName = applicationService.model.Report.OrganisationName ?? "organisation";
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Report!.ActingOrgRole = this.model;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.ActingOrg);
  }

  modelValid: boolean = true;
  hasActingOrgRoleErrors: boolean = true;


  isValid(): boolean {
    this.modelValid = !FieldValidations.IsNotNullOrWhitespace(this.model);
    this.hasActingOrgRoleErrors = this.modelValid;
    return !this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    if (this.model == "other") {
      return this.navigationService.navigateRelative(ReportDutyHolderCanSubmitComponent.route, this.activatedRoute);
    } else {
      return this.navigationService.navigateRelative(TypeIncidentReportedComponent.route, this.activatedRoute);
    }

  }
}
