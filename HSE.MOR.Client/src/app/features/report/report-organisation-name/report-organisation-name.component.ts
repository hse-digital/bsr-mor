import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ReportOrgRoleComponent } from '../report-org-role/report-org-role.component';
import { OrganisationService } from '../../../services/organisation.service';

@Component({
  templateUrl: './report-organisation-name.component.html'
})

export class ReportOrganisationNameComponent extends PageComponent<string> {
  public static route: string = 'report-organisation-name';
  static title: string = "Tell us your organisation name? - Submit a mandatory occurrence notice and report";

  constructor(activatedRoute: ActivatedRoute, private organisationService: OrganisationService) {
    super(activatedRoute);
  }

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
    return applicationService.model.Report?.SubmittedNotice == "me" || FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.ContactNumber);
  }

  companies: string[] = [];
  async searchCompanies(company: string) {
    if (company?.length > 2) {
      var response = await this.organisationService.SearchCompany(company, "company");
      this.companies = response.Companies.map(x => x.Name);
    }
  }

  selectCompanyName(company: string) {
    this.model = company;
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
    return this.navigationService.navigateRelative(ReportOrgRoleComponent.route, this.activatedRoute);
  }
}
