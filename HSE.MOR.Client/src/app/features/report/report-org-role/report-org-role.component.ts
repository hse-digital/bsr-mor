import { Component, ViewChild } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ReportDutyHolderCanSubmitComponent } from '../report-duty-holder-can-submit/report-duty-holder-can-submit.component';
import { TypeIncidentReportedComponent } from '../type-incident-reported/type-incident-reported.component';
import { ReportActingOrgComponent } from '../report-acting-org/report-acting-org.component';
import { ReportWhenBecomeAwareComponent } from '../report-when-become-aware/report-when-become-aware.component';
import { app } from '../../../../../server';
import { ReportActingOrgTypeComponent } from '../report-acting-org-type/report-acting-org-type.component';

@Component({
  templateUrl: './report-org-role.component.html'
})

export class ReportOrgRoleComponent extends PageComponent<string> {
  public static route: string = 'report-org-role';
  static title: string = "How is undefined involved in this building? - Submit a mandatory occurrence notice and report";
  organisationName?: string;

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {};
    }  
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.OrgRole)) {
      applicationService.model.Report.OrgRole = "";
    }     
    this.model = applicationService.model.Report.OrgRole;
    this.organisationName = applicationService.model.Report.OrganisationName ?? "organisation";
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    if (this.model != "on_behalf") {
      applicationService.model.Report!.ActingOrg = undefined;
      applicationService.model.Report!.ActingOrgRole = undefined;
    }
    applicationService.model.Report!.OrgRole = this.model;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  modelValid: boolean = true;
  hasOrgRoleErrors: boolean = true;
  hasOrgRoleOtherErrors: boolean = true;


  isValid(): boolean {
    this.modelValid = !FieldValidations.IsNotNullOrWhitespace(this.model);
    this.hasOrgRoleErrors = this.modelValid;
    return !this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    if (this.model == "other") {
      return this.navigationService.navigateRelative(ReportDutyHolderCanSubmitComponent.route, this.activatedRoute);
    } else if (this.model == "on_behalf") {
      return this.navigationService.navigateRelative(ReportActingOrgTypeComponent.route, this.activatedRoute);
    } else {
      return this.navigationService.navigateRelative(ReportWhenBecomeAwareComponent.route, this.activatedRoute);
    }
    
  }
}
