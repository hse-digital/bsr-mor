import { Component, ViewChild } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { WhatToReportComponent } from '../what-to-report/what-to-report.component';
import { ReportDutyHolderCanSubmitComponent } from '../report-duty-holder-can-submit/report-duty-holder-can-submit.component';

@Component({
  templateUrl: './report-org-role.component.html'
})

export class ReportOrgRoleComponent extends PageComponent<string> {
  public static route: string = 'report-org-role';
  static title: string = "How is undefined involved in this building?";
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
    } else {
      return this.navigationService.navigateRelative(WhatToReportComponent.route, this.activatedRoute);
    }
    
  }
}
