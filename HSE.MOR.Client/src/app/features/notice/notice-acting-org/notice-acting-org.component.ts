import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { NoticeOrgRoleComponent } from '../notice-org-role/notice-org-role.component';

@Component({
  templateUrl: './notice-acting-org.component.html'
})

export class NoticeActingOrgComponent extends PageComponent<string> {
  public static route: string = 'notice-acting-org';
  static title: string = "What is the name of the organisation you're acting for? - Submit a mandatory occurrence notice and report";


  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Notice) {
      applicationService.model.Notice = {};
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice.ActingOrg)) {
      applicationService.model.Notice.ActingOrg = "";
    }
    this.model = applicationService.model.Notice?.ActingOrg;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Notice!.ActingOrg = this.model;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice?.OrgRole) && applicationService.model.Notice?.OrgRole == "on_behalf";
  }

  modelValid: boolean = false;
  ErrorMessage: string = "You need to tell us your organisation";
  ActingOrgnError: boolean = false;

  override isValid(): boolean {
    this.ActingOrgnError = false;
    if (!FieldValidations.IsNotNullOrWhitespace(this.model)) {
      this.ActingOrgnError = true;
    } else if (this.model!.length < 3) {
      this.ErrorMessage = "You need to enter an organisation that is longer than 2 characters"
      this.ActingOrgnError = true;
    } if (this.model!.length > 50) {
      this.ErrorMessage = "You need to tell us your organisation using fewer words"
      this.ActingOrgnError = true;
    }
    this.modelValid = !this.ActingOrgnError;
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(NoticeOrgRoleComponent.route, this.activatedRoute);
  }
}
