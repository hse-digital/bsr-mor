import { Component} from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRouteSnapshot } from "@angular/router";
import { ReportWhenBecomeAwareComponent } from '../report-when-become-aware/report-when-become-aware.component';
import { ReportOrganisationNameComponent } from '../report-organisation-name/report-organisation-name.component';


@Component({
  templateUrl: './report-org-type.component.html'
})

export class ReportOrgTypeComponent extends PageComponent<string> {
  public static route: string = 'report-org-type';
  static title: string = "Report Organisation Type - Submit a mandatory occurrence notice and report";

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {};
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.OrgType)) {
      applicationService.model.Report.OrgType = "";
    }
    this.model = applicationService.model.Report.OrgType;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {   
    applicationService.model.Report!.OrgType = this.model;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return applicationService.model.Report?.SubmittedNotice == "me" || FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.ContactNumber);
  }

  modelValid: boolean = true;
  hasOrgTypeErrors: boolean = true;


  isValid(): boolean {
    this.modelValid = !FieldValidations.IsNotNullOrWhitespace(this.model);
    this.hasOrgTypeErrors = this.modelValid;
    return !this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(ReportOrganisationNameComponent.route, this.activatedRoute);
  }
}
