import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRouteSnapshot } from "@angular/router";
import { NoticeActingOrgComponent } from '../notice-acting-org/notice-acting-org.component';


@Component({
  templateUrl: './notice-acting-org-type.component.html'
})

export class NoticeActingOrgTypeComponent extends PageComponent<string> {
  public static route: string = 'notice-acting-org-type';
  static title: string = "Notice Organisation Type - Submit a mandatory occurrence notice and report";

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Notice) {
      applicationService.model.Notice = {};
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice.ActingOrgType)) {
      applicationService.model.Notice.ActingOrgType = "";
    }
    this.model = applicationService.model.Notice.ActingOrgType;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Notice!.ActingOrgType = this.model;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice?.OrgRole) && applicationService.model.Notice?.OrgRole == "on_behalf";
  }

  modelValid: boolean = true;
  hasActingOrgTypeErrors: boolean = true;


  isValid(): boolean {
    this.modelValid = !FieldValidations.IsNotNullOrWhitespace(this.model);
    this.hasActingOrgTypeErrors = this.modelValid;
    return !this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(NoticeActingOrgComponent.route, this.activatedRoute);
  }
}
