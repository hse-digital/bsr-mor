import { Component, ViewChild } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService, ReportModel } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './role-in-submit-notice.component.html'
})

export class RoleInSubmitNoticeComponent extends PageComponent<ReportModel> {
  public static route: string = 'role-in-submit-notice';
  static title: string = "How is undefined involved in this building?";
  override model = new ReportModel();
  organisationName: string = "Test";

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {};
    }
    this.model = applicationService.model.Report;
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.RoleInNoticeSubmit)) {
      applicationService.model.Report.RoleInNoticeSubmit = "";
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.RoleInNoticeSubmitOther)) {
      applicationService.model.Report.RoleInNoticeSubmitOther = "";
    }   
    this.model.RoleInNoticeSubmit = applicationService.model.Report.RoleInNoticeSubmit;
    this.model.RoleInNoticeSubmitOther = applicationService.model.Report.RoleInNoticeSubmitOther;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Report!.RoleInNoticeSubmit = this.model!.RoleInNoticeSubmit;
    applicationService.model.Report!.RoleInNoticeSubmitOther = this.model!.RoleInNoticeSubmit === "other" ? this.model!.RoleInNoticeSubmitOther : undefined;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  modelValid: boolean = true;
  hasRoleInNoticeSubmitErrors: boolean = true;
  hasRoleInNoticeSubmitOtherErrors: boolean = true;


  override isValid(): boolean {
    if (this.model!.RoleInNoticeSubmit === "other" && !FieldValidations.IsNotNullOrWhitespace(this.model!.RoleInNoticeSubmitOther)) {
      this.modelValid = false;
      this.hasRoleInNoticeSubmitOtherErrors = this.modelValid;
      this.hasRoleInNoticeSubmitErrors = true;
      return this.modelValid;
    } else {
      this.modelValid = FieldValidations.IsNotNullOrWhitespace(this.model!.RoleInNoticeSubmit);
      this.hasRoleInNoticeSubmitOtherErrors = true;
      this.hasRoleInNoticeSubmitErrors = this.modelValid;
      return this.modelValid;
    }
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative('risk-details', this.activatedRoute);
  }
}
