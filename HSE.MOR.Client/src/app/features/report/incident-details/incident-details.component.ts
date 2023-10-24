import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService, ReportModel } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ReportSupportInfoComponent } from '../report-support-info/report-support-info.component';

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
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.SharedWithOthers)) {
      applicationService.model.Report.SharedWithOthers = "";
    }
    this.model.AboutIncident = applicationService.model.Report?.AboutIncident;
    this.model.CauseOfIncident = applicationService.model.Report?.CauseOfIncident;
    this.model.WhoAffectedByIncident = applicationService.model.Report?.WhoAffectedByIncident;
    this.model.IncidentKeepPeopleSafe = applicationService.model.Report?.IncidentKeepPeopleSafe;
    this.model.OccurrenceDiscovered = applicationService.model.Report?.OccurrenceDiscovered;
    this.model.SharedWithOthers = applicationService.model.Report?.SharedWithOthers;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Report!.AboutIncident = this.model.AboutIncident;
    applicationService.model.Report!.CauseOfIncident = this.model.CauseOfIncident;
    applicationService.model.Report!.WhoAffectedByIncident = this.model.WhoAffectedByIncident;
    applicationService.model.Report!.IncidentKeepPeopleSafe = this.model.IncidentKeepPeopleSafe;
    applicationService.model.Report!.OccurrenceDiscovered = this.model.OccurrenceDiscovered;
    applicationService.model.Report!.SharedWithOthers = this.model.SharedWithOthers;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    if (applicationService.model.Report?.IncidentReported) {
      return applicationService.model.Report?.IncidentReported!.length > 0 ? true : false;
    } else {
      return false;
    }
  }

  errorMessage: string = "You need to tell us about the occurrence";
  aboutIncidentErrorMessage: string = "You need to tell us what happened / is the risk";
  whatCausedItErrorMessage: string = "You need to tell us what caused it";
  whoAffectedErrorMessage: string = "You need to tell us who has been / could have been affected";
  keepPeopleSafeErrorMessage: string = "You need to tell us what you have done to keep people safe";
  occurrenceDiscoveredErrorMessage: string = "You need to tell us how the occurrence was discovered";
  sharedWithOthersErrorMessage: string = "You need to share for others to learn from  using fewer words";
  aboutIncidentInError: boolean = false;
  whatCausedItInError: boolean = false;
  whoAffectedItInError: boolean = false;
  keepPeopleSafeInError: boolean = false;
  occurrenceDiscoveredInError: boolean = false;
  sharedWithOthersInError: boolean = false;
  modelValid: boolean = false;

  override isValid(): boolean {
    this.modelValid = false;
    this.aboutIncidentInError = false;
    this.whatCausedItInError = false;
    this.whoAffectedItInError = false;
    this.keepPeopleSafeInError = false;
    this.occurrenceDiscoveredInError = false;
    this.sharedWithOthersInError = false;

    if (!FieldValidations.IsNotNullOrWhitespace(this.model.AboutIncident)) {
      this.aboutIncidentInError = true;

    } if (FieldValidations.IsNotNullOrWhitespace(this.model.AboutIncident) && this.model.AboutIncident?.length! > 200) {

      this.aboutIncidentErrorMessage = "You need to tell us what happened / is the risk using fewer words";
      this.aboutIncidentInError = true;

    } if (!FieldValidations.IsNotNullOrWhitespace(this.model.CauseOfIncident)) {
      this.whatCausedItInError = true;

    } if (FieldValidations.IsNotNullOrWhitespace(this.model.CauseOfIncident) && this.model.CauseOfIncident?.length! > 200) {

      this.whatCausedItErrorMessage = "You need to tell us what caused it using fewer words";
      this.whatCausedItInError = true;

    } if (!FieldValidations.IsNotNullOrWhitespace(this.model.WhoAffectedByIncident)) {
      this.whoAffectedItInError = true;

    } if (FieldValidations.IsNotNullOrWhitespace(this.model.WhoAffectedByIncident) && this.model.WhoAffectedByIncident?.length! > 200) {

      this.whoAffectedErrorMessage = "You need to tell us who has been / could have been affected using fewer words";
      this.whoAffectedItInError = true;

    } if (!FieldValidations.IsNotNullOrWhitespace(this.model.IncidentKeepPeopleSafe)) {
      this.keepPeopleSafeInError = true;

    } if (FieldValidations.IsNotNullOrWhitespace(this.model.IncidentKeepPeopleSafe) && this.model.IncidentKeepPeopleSafe?.length! > 300) {

      this.keepPeopleSafeErrorMessage = "You need to tell us what you have done to keep people safe using fewer words";
      this.keepPeopleSafeInError = true;

    } if (!FieldValidations.IsNotNullOrWhitespace(this.model.OccurrenceDiscovered)) {
      this.occurrenceDiscoveredInError = true;

    } if (FieldValidations.IsNotNullOrWhitespace(this.model.OccurrenceDiscovered) && this.model.OccurrenceDiscovered?.length! > 100) {
      this.occurrenceDiscoveredInError = true;

    } if (FieldValidations.IsNotNullOrWhitespace(this.model.SharedWithOthers)) {
      if (this.model.SharedWithOthers?.length! > 100) {
        this.sharedWithOthersInError = true;
      }
    }
    this.modelValid = this.aboutIncidentInError || this.whatCausedItInError || this.whoAffectedItInError || this.keepPeopleSafeInError || this.occurrenceDiscoveredInError || this.sharedWithOthersInError ? false : true;
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(ReportSupportInfoComponent.route, this.activatedRoute);
  }
}
