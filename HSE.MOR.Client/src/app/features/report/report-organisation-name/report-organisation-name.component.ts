import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './report-organisation-name.component.html'
})

export class ReportOrganisationNameComponent extends PageComponent<string> {
  public static route: string = 'report-organisation-name';
  static title: string = "Tell us your organisation name? – Tell the Building Safety Regulator about a mandatory occurrence";


  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {};
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.OrganisationName)) {
      applicationService.model.Report.OrganisationName = "";
    }
    this.model = applicationService.model.Report?.OrganisationName;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Report!.OrganisationName = this.model;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  modelValid: boolean = false;
  ErrorMessage: string = "You need to tell us your organisation";
  OrgNameInError: boolean = false;

  override isValid(): boolean {
    this.OrgNameInError  = false;
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
    return this.navigationService.navigate('');
  }
}
