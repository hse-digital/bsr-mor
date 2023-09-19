import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService, ReportModel } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './incident-details.component.html'
})

export class IncidentDetailsComponent extends PageComponent<ReportModel> {
  public static route: string = 'incident-details';
  static title: string = "Your details";
  override model: ReportModel = new ReportModel();


  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {}
    }
    this.model = applicationService.model.Report;
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.AboutIncident)) {
      applicationService.model.Report.AboutIncident = "";
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.CauseOfIncident)) {
      applicationService.model.Report.CauseOfIncident = "";
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.WhoAffectedByIncident)) {
      applicationService.model.Report.WhoAffectedByIncident = "";
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.IncidentKeepPeopleSafe)) {
      applicationService.model.Report.IncidentKeepPeopleSafe = "";
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.OccurrenceDiscovered)) {
      applicationService.model.Report.OccurrenceDiscovered = "";
    }
    this.model.AboutIncident = applicationService.model.Report?.AboutIncident;
    this.model.CauseOfIncident = applicationService.model.Report?.CauseOfIncident;
    this.model.WhoAffectedByIncident = applicationService.model.Report?.WhoAffectedByIncident;
    this.model.IncidentKeepPeopleSafe = applicationService.model.Report?.IncidentKeepPeopleSafe;
    this.model.OccurrenceDiscovered = applicationService.model.Report?.OccurrenceDiscovered;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Report!.AboutIncident = this.model.AboutIncident;
    applicationService.model.Report!.CauseOfIncident = this.model.CauseOfIncident;
    applicationService.model.Report!.WhoAffectedByIncident = this.model.WhoAffectedByIncident;
    applicationService.model.Report!.IncidentKeepPeopleSafe = this.model.IncidentKeepPeopleSafe;
    applicationService.model.Report!.OccurrenceDiscovered = this.model.OccurrenceDiscovered;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  errorMessage: string = "You need to tell us about the occurrence";
  aboutRiskErrorMessage: string = "You need to tell us what happened / is the risk";
  whatCausedItErrorMessage: string = "You need to tell us what caused it";
  whoAffectedErrorMessage: string = "You need to tell us who has been / could have been affected";
  keepPeopleSafeErrorMessage: string = "You need to tell us what you have done to keep people safe";
  occurrenceDiscoveredErrorMessage: string = "You need to tell us how the occurrence was discovered";
  aboutRiskInError: boolean = false;
  whatCausedItInError: boolean = false;
  whoAffectedItInError: boolean = false;
  keepPeopleSafeItInError: boolean = false;
  occurrenceDiscoveredItInError: boolean = false;
  modelValid: boolean = false;

  override isValid(): boolean {
    this.modelValid = false;
    this.aboutRiskInError = false;
    this.whatCausedItInError = false;
    this.whoAffectedItInError = false;
    this.keepPeopleSafeItInError = false;
    this.occurrenceDiscoveredItInError = false;

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
      this.occurrenceDiscoveredItInError = true;

    } if (FieldValidations.IsNotNullOrWhitespace(this.model.OrganisationFindOut) && this.model.OrganisationFindOut?.length! > 250) {

      this.occurrenceDiscoveredErrorMessage = "You need to tell us how the occurrence was discovered using fewer words";
      this.occurrenceDiscoveredItInError = true;

    }
    this.modelValid = this.aboutRiskInError || this.whatCausedItInError || this.whoAffectedItInError || this.keepPeopleSafeItInError || this.occurrenceDiscoveredItInError ? false : true;
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigate('');
  }
}
