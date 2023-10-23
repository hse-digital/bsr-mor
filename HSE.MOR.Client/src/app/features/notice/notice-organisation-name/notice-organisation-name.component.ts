import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { NoticeOrgRoleComponent } from '../notice-org-role/notice-org-role.component';

@Component({
  templateUrl: './notice-organisation-name.component.html'
})

export class NoticeOrganisationNameComponent extends PageComponent<string> {
  public static route: string = 'notice-organisation-name';
  static title: string = "Tell us your organisation name? – Tell the Building Safety Regulator about a mandatory occurrence";


  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Notice) {
      applicationService.model.Notice = {};
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice.OrganisationName)) {
      applicationService.model.Notice.OrganisationName = "";
    }
    this.model = applicationService.model.Notice?.OrganisationName;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Notice!.OrganisationName = this.model;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  modelValid: boolean = false;
  ErrorMessage: string = "You need to tell us your organisation";
  OrgNameInError: boolean = false;

  override isValid(): boolean {
    this.OrgNameInError = false;
    if (!FieldValidations.IsNotNullOrWhitespace(this.model)) {
      this.OrgNameInError = true;
    } else if (this.model!.length < 3) {
      this.ErrorMessage = "You need to enter an organisation that is longer than 2 characters"
      this.OrgNameInError = true;
    } if (this.model!.length > 50) {
      this.ErrorMessage = "You need to tell us your organisation using fewer words"
      this.OrgNameInError = true;
    }
    this.modelValid = !this.OrgNameInError;
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(NoticeOrgRoleComponent.route, this.activatedRoute);
  }
}
