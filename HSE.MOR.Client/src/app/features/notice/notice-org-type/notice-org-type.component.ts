import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRouteSnapshot } from "@angular/router";
import { NoticeOrganisationNameComponent } from '../notice-organisation-name/notice-organisation-name.component';


@Component({
  templateUrl: './notice-org-type.component.html'
})

export class NoticeOrgTypeComponent extends PageComponent<string> {
  public static route: string = 'notice-org-type';
  static title: string = "Notice Organisation Type - Submit a mandatory occurrence notice and report";

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Notice) {
      applicationService.model.Notice = {};
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice.OrgType)) {
      applicationService.model.Notice.OrgType = "";
    }
    this.model = applicationService.model.Notice.OrgType;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Notice!.OrgType = this.model;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice?.ContactNumber);
  }

  modelValid: boolean = true;
  hasOrgTypeErrors: boolean = true;


  isValid(): boolean {
    this.modelValid = !FieldValidations.IsNotNullOrWhitespace(this.model);
    this.hasOrgTypeErrors = this.modelValid;
    return !this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(NoticeOrganisationNameComponent.route, this.activatedRoute);
  }
}