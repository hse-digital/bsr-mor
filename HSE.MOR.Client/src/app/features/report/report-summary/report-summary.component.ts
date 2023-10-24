import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService, CheckAnswersReportModel } from "../../../services/application.service";
import { ActivatedRouteSnapshot } from "@angular/router";
import { FieldValidations } from '../../../helpers/validators/fieldvalidations';
import { AddressType } from '../../../services/address.service';

@Component({
  templateUrl: './report-summary.component.html'
})

export class ReportSummaryComponent extends PageComponent<CheckAnswersReportModel> {
  public static route: string = 'report-summary';
  static title: string = "Report Summary";
  override model: CheckAnswersReportModel = new CheckAnswersReportModel();
  isBCAAddress: boolean = false;
  isHRBAdress: boolean = false;
  isSearchAdress: boolean = false;
  isAddressManual: boolean = false;
  isIncident: boolean = false;
  isBuilding: boolean = false;
  isSharedWithOthers: boolean = false;
  isSharedWithOthersIncident: boolean = false;

  override onInit(applicationService: ApplicationService): void {
    this.isBCAAddress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.BCAReference ? true : false;
    this.isHRBAdress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.HRBNumber ? true : false;
    this.isSearchAdress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.PostcodeSearch ? true : false;
    this.isBuilding = !FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.NoticeReference);    
    this.isIncident = applicationService.model.Report?.WhatToReport == "incident" ? true : false;
    var isShared = applicationService.model.Report?.SharedWithOthers ? true : false;
    this.isSharedWithOthersIncident = this.isIncident && isShared;
    this.isSharedWithOthers = !this.isIncident && isShared;
    this.model.Address = applicationService.model.Report?.CheckAnswersModel?.Address;
    this.model.BcaReference = applicationService.model.Report?.CheckAnswersModel?.BcaReference;
    this.model.HrbNumber = applicationService.model.Report?.CheckAnswersModel?.HrbNumber;
    this.isAddressManual = applicationService.model.Report?.CheckAnswersModel?.IsManualAddress!;
    if (this.isAddressManual) {
      this.model.AddressRegion = applicationService.model.Report?.CheckAnswersModel?.AddressRegion;
      this.model.NumberOfFloors = applicationService.model.Report?.CheckAnswersModel?.NumberOfFloors?.toString();
      this.model.NumberOfUnits = applicationService.model.Report?.CheckAnswersModel?.NumberOfUnits?.toString();
      this.model.BuildingHeight = applicationService.model.Report?.CheckAnswersModel?.BuildingHeight?.toString();
    }    
    this.model.YourName = applicationService.model.Report?.CheckAnswersModel?.YourName;
    this.model.ContactDetails = applicationService.model.Report?.CheckAnswersModel?.ContactDetails;
    this.model.ContactNumber = applicationService.model.Report?.CheckAnswersModel?.ContactNumber;
    this.model.OrganisationName = applicationService.model.Report?.CheckAnswersModel?.OrganisationName;
    this.model.OrgRole = applicationService.model.Report?.CheckAnswersModel?.OrgRole;
    this.model.NoticeReference = applicationService.model.Report?.CheckAnswersModel?.NoticeReference;
    this.model.IncidentOrSituation = applicationService.model.Report?.CheckAnswersModel?.IncidentOrSituation;
    this.model.IncidentReported = applicationService.model.Report?.CheckAnswersModel?.IncidentReported;
    this.model.AboutIncident = applicationService.model.Report?.CheckAnswersModel?.AboutIncident;
    this.model.CauseOfIncident = applicationService.model.Report?.CheckAnswersModel?.CauseOfIncident;
    this.model.WhoAffectedByIncident = applicationService.model.Report?.CheckAnswersModel?.WhoAffectedByIncident;
    this.model.IncidentKeepPeopleSafe = applicationService.model.Report?.CheckAnswersModel?.IncidentKeepPeopleSafe;
    this.model.OccurrenceDiscovered = applicationService.model.Report?.CheckAnswersModel?.OccurrenceDiscovered;
    this.model.SharedWithOthers = applicationService.model.Report?.CheckAnswersModel?.SharedWithOthers;
    this.model.RiskReported = applicationService.model.Report?.CheckAnswersModel?.RiskReported;
    this.model.AboutRisk = applicationService.model.Report?.CheckAnswersModel?.AboutRisk;
    this.model.CauseOfRisk = applicationService.model.Report?.CheckAnswersModel?.CauseOfRisk;
    this.model.WhoAffectedByRisk = applicationService.model.Report?.CheckAnswersModel?.WhoAffectedByRisk;
    this.model.RiskKeepPeopleSafe = applicationService.model.Report?.CheckAnswersModel?.RiskKeepPeopleSafe;
    this.model.UploadedFileNames = applicationService.model.Report?.CheckAnswersModel?.UploadedFileNames;

  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    
  }

  printSummary() {
    window.print();
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  
  modelValid: boolean = false;
  override isValid(): boolean {
    return true
  }
  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigate('');
  }
}

