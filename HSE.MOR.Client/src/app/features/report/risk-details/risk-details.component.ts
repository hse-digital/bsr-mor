import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService, ReportModel } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './risk-details.component.html'
})

export class RiskDetailsComponent extends PageComponent<ReportModel> {
  public static route: string = 'risk-details';
  static title: string = "Your details";
  override model: ReportModel = new ReportModel();


  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {}
    }
    this.model = applicationService.model.Report;
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.AboutRisk)) {
      applicationService.model.Report.AboutRisk = "";
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.CauseOfRisk)) {
      applicationService.model.Report.CauseOfRisk = "";
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.WhoAffectedByRisk)) {
      applicationService.model.Report.WhoAffectedByRisk = "";
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.RiskKeepPeopleSafe)) {
      applicationService.model.Report.RiskKeepPeopleSafe = "";
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.OrganisationFindOut)) {
      applicationService.model.Report.OrganisationFindOut = "";
    }
    this.model.AboutRisk = applicationService.model.Report?.AboutRisk;
    this.model.CauseOfRisk = applicationService.model.Report?.CauseOfRisk;
    this.model.WhoAffectedByRisk = applicationService.model.Report?.WhoAffectedByRisk;
    this.model.RiskKeepPeopleSafe = applicationService.model.Report?.RiskKeepPeopleSafe;
    this.model.OrganisationFindOut = applicationService.model.Report?.OrganisationFindOut;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Report!.AboutRisk = this.model.AboutRisk;
    applicationService.model.Report!.CauseOfRisk = this.model.CauseOfRisk;
    applicationService.model.Report!.WhoAffectedByRisk = this.model.WhoAffectedByRisk;
    applicationService.model.Report!.RiskKeepPeopleSafe = this.model.RiskKeepPeopleSafe;
    applicationService.model.Report!.OrganisationFindOut = this.model.OrganisationFindOut;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    if (applicationService.model.Report?.RiskReported) {
      return applicationService.model.Report!.RiskReported!.length > 0 ? true : false;
    } else {
      return false;
    }
  }

  errorMessage: string = "You need to tell us about the occurrence";
  aboutRiskErrorMessage: string = "You need to tell us what happened / is the risk";
  whatCausedItErrorMessage: string = "You need to tell us what caused it";
  whoAffectedErrorMessage: string = "You need to tell us who has been / could have been affected";
  keepPeopleSafeErrorMessage: string = "You need to tell us what you have done to keep people safe";
  organisationFindOutErrorMessage: string = "You need to tell us how the occurrence was discovered";
  aboutRiskInError: boolean = false;
  whatCausedItInError: boolean = false;
  whoAffectedItInError: boolean = false;
  keepPeopleSafeItInError: boolean = false;
  organisationFindOutItInError: boolean = false;
  modelValid: boolean = false;

  override isValid(): boolean {
    this.modelValid = false;
    this.aboutRiskInError = false;
    this.whatCausedItInError = false;
    this.whoAffectedItInError = false;
    this.keepPeopleSafeItInError = false;
    this.organisationFindOutItInError = false;

    if (!FieldValidations.IsNotNullOrWhitespace(this.model.AboutRisk)) {
      this.aboutRiskInError = true;

    } if (FieldValidations.IsNotNullOrWhitespace(this.model.AboutRisk) && this.model.AboutRisk?.length! > 500) {

      this.aboutRiskErrorMessage = "You need to tell us what happened / is the risk using fewer words";
      this.aboutRiskInError = true;

    } if (!FieldValidations.IsNotNullOrWhitespace(this.model.CauseOfRisk)) {
      this.whatCausedItInError = true;

    } if (FieldValidations.IsNotNullOrWhitespace(this.model.CauseOfRisk) && this.model.CauseOfRisk?.length! > 300) {

      this.whatCausedItErrorMessage = "You need to tell us what caused it using fewer words";
      this.whatCausedItInError = true;

    } if (!FieldValidations.IsNotNullOrWhitespace(this.model.WhoAffectedByRisk)) {
      this.whoAffectedItInError = true;

    } if (FieldValidations.IsNotNullOrWhitespace(this.model.WhoAffectedByRisk) && this.model.WhoAffectedByRisk?.length! > 250) {

      this.whoAffectedErrorMessage = "You need to tell us who has been / could have been affected using fewer words";
      this.whoAffectedItInError = true;

    } if (!FieldValidations.IsNotNullOrWhitespace(this.model.RiskKeepPeopleSafe)) {
      this.keepPeopleSafeItInError = true;

    } if (FieldValidations.IsNotNullOrWhitespace(this.model.RiskKeepPeopleSafe) && this.model.RiskKeepPeopleSafe?.length! > 750) {

      this.keepPeopleSafeErrorMessage = "You need to tell us what you have done to keep people safe using fewer words";
      this.keepPeopleSafeItInError = true;

    } if (!FieldValidations.IsNotNullOrWhitespace(this.model.OrganisationFindOut)) {
      this.organisationFindOutItInError = true;

    } if (FieldValidations.IsNotNullOrWhitespace(this.model.OrganisationFindOut) && this.model.OrganisationFindOut?.length! > 250) {

      this.organisationFindOutErrorMessage = "You need to tell us how the occurrence was discovered using fewer words";
      this.organisationFindOutItInError = true;

    }
    this.modelValid = this.aboutRiskInError || this.whatCausedItInError || this.whoAffectedItInError || this.keepPeopleSafeItInError || this.organisationFindOutItInError ? false : true;
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigate('');
  }
}
