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
  static title: string = "Report Summary - Submit a mandatory occurrence notice and report";
  override model: CheckAnswersReportModel = new CheckAnswersReportModel();
  isBCAAddress: boolean = false;
  isHRBAdress: boolean = false;
  isSearchAdress: boolean = false;
  isAddressManual: boolean = false;
  isManual: boolean = false;
  isIncident: boolean = false;
  isNoticeReference: boolean = false;
  isSharedWithOthers: boolean = false;
  isSharedWithOthersIncident: boolean = false;
  organisationName?: string;
  isSameUser: boolean = false;
  isAaboutTheBuilding: boolean = false;
  isActingOrganisation: boolean = false;

  override onInit(applicationService: ApplicationService): void {
    this.isBCAAddress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.BCAReference ? true : false;
    this.isHRBAdress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.HRBNumber ? true : false;
    this.isSearchAdress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.PostcodeSearch ? true : false;
    this.isManual = applicationService.model.Building?.Address?.IsManual ? true : false;
    this.isAaboutTheBuilding = applicationService.model.Building?.LocateBuilding ? true : false;
    this.isNoticeReference = FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.NoticeReference);       
    this.isSameUser = applicationService.model.Report?.SubmittedNotice == "me" ? true : false;
    this.isActingOrganisation = (FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.ActingOrg) && FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.ActingOrgRole))
      && (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.NoticeReference) || FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.NoticeReference) && applicationService.model.Report?.SubmittedNotice == "other")
    
    this.organisationName = applicationService.model.Report!.OrganisationName ?? "organisation";
    this.model.Address = applicationService.model.Report?.CheckAnswersModel?.Address;
    this.model.BcaReference = applicationService.model.Report?.CheckAnswersModel?.BcaReference;
    this.model.HrbNumber = applicationService.model.Report?.CheckAnswersModel?.HrbNumber;
    this.isAddressManual = applicationService.model.Report?.CheckAnswersModel?.IsManualAddress!;
    this.model.AboutBuilding = applicationService.model.Report?.CheckAnswersModel?.AboutBuilding;
    if (this.isAddressManual || this.isAaboutTheBuilding) {
      this.model.AddressRegion = applicationService.model.Report?.CheckAnswersModel?.AddressRegion;
      this.model.NumberOfFloors = applicationService.model.Report?.CheckAnswersModel?.NumberOfFloors?.toString();
      this.model.NumberOfUnits = applicationService.model.Report?.CheckAnswersModel?.NumberOfUnits?.toString();
      this.model.BuildingHeight = applicationService.model.Report?.CheckAnswersModel?.BuildingHeight?.toString();
    }    
    this.model.YourName = applicationService.model.Report?.CheckAnswersModel?.YourName;
    this.model.ContactDetails = applicationService.model.Report?.CheckAnswersModel?.ContactDetails;
    this.model.ContactNumber = applicationService.model.Report?.CheckAnswersModel?.ContactNumber;
    this.model.OrganisationName = applicationService.model.Report?.CheckAnswersModel?.OrganisationName;
    this.model.ActingOrg = applicationService.model.Report?.CheckAnswersModel?.ActingOrg;
    this.model.ActingOrgRole = applicationService.model.Report?.CheckAnswersModel?.ActingOrgRole;
    this.model.NoticeReference = applicationService.model.CaseNumber ?? applicationService.model.Report?.CheckAnswersModel?.NoticeReference;
    this.model.IncidentReported = applicationService.model.Report?.CheckAnswersModel?.IncidentReported;
    this.model.AboutIncident = applicationService.model.Report?.CheckAnswersModel?.AboutIncident;
    this.model.CauseOfIncident = applicationService.model.Report?.CheckAnswersModel?.CauseOfIncident;
    this.model.WhoAffectedByIncident = applicationService.model.Report?.CheckAnswersModel?.WhoAffectedByIncident;
    this.model.IncidentKeepPeopleSafe = applicationService.model.Report?.CheckAnswersModel?.IncidentKeepPeopleSafe;
    this.model.OccurrenceDiscovered = applicationService.model.Report?.CheckAnswersModel?.OccurrenceDiscovered;
    this.model.SharedWithOthers = applicationService.model.Report?.CheckAnswersModel?.SharedWithOthers;
    this.model.OrgRole = applicationService.model.Report?.CheckAnswersModel?.OrgRole;
    this.model.OccurrenceDateTime = applicationService.model.Report?.CheckAnswersModel?.OccurrenceDateTime;
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

