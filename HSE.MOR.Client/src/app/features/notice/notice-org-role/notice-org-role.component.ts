import { Component, ViewChild } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService, NoticeModel } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { BrieflyDescribeRiskIncidentComponent } from '../briefly-describe-risk-incident/briefly-describe-risk-incident.component';
import { WhenBecomeAwareComponent } from '../when-become-aware/when-become-aware.component';

@Component({
  templateUrl: './notice-org-role.component.html'
})

export class NoticeOrgRoleComponent extends PageComponent<string> {
  public static route: string = 'notice-org-role';
  static title: string = "How is undefined involved in this building?";
  organisationName?: string;

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Notice) {
      applicationService.model.Notice = {};
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice.OrgRole)) {
      applicationService.model.Notice.OrgRole = "";
    }
    this.model = applicationService.model.Notice.OrgRole;
    this.organisationName = applicationService.model.Notice.OrganisationName ?? "organisation";

  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Notice!.OrgRole = this.model;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice?.OrganisationName);
  }

  modelValid: boolean = true;
  hasOrgRoleErrors: boolean = true;

  isValid(): boolean {
    this.modelValid = !FieldValidations.IsNotNullOrWhitespace(this.model);
    this.hasOrgRoleErrors = this.modelValid;
    return !this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(WhenBecomeAwareComponent.route, this.activatedRoute);
  }
}
