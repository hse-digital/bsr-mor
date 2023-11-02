import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService, BuildingModel, CheckAnswersReportModel, ReportModel } from "../../../services/application.service";
import { ActivatedRouteSnapshot } from "@angular/router";
import { AddressModel, AddressType } from '../../../services/address.service';
import { NavigationHelper } from '../../../helpers/navigation.helper';
import { FieldValidations } from '../../../helpers/validators/fieldvalidations';
import { ReportConfirmationComponent } from '../report-confirmation/report-confirmation.component';

@Component({
  templateUrl: './report-check-your-answers.component.html'
})

export class ReportCheckYourAnswersComponent extends PageComponent<CheckAnswersReportModel> {
  public static route: string = 'check-your-answers';
  static title: string = "Check your answers";
  baseRoutes: string[] = ["enter-email", "what-to-submit"];
  override model: CheckAnswersReportModel = new CheckAnswersReportModel();
  isBCAAddress: boolean = false;
  isHRBAdress: boolean = false;
  isSearchAdress: boolean = false;
  isManual: boolean = false;
  fileNameArray: string[] = [];
  addressRouteKey?: string;
  isIncident: boolean = false;
  incidentReportedArray: string[] = [];
  riskReportedArray: string[] = [];
  isNoticeReference: boolean = false;
  isSharedWithOthers: boolean = false;
  isSharedWithOthersIncident: boolean = false;
  organisationName?: string;
  isAaboutTheBuilding: boolean = false;
  isSameUser: boolean = false;

  override onInit(applicationService: ApplicationService): void {
    this.isBCAAddress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.BCAReference ? true : false;
    this.isHRBAdress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.HRBNumber ? true : false;
    this.isSearchAdress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.PostcodeSearch ? true : false;
    this.isManual = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.Manual ? true : false;
    this.isAaboutTheBuilding = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.AboutBuilding ? true : false;
    this.isNoticeReference = FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.NoticeReference);
    this.isIncident = applicationService.model.Report?.WhatToReport == "incident" ? true : false;
    var isShared = applicationService.model.Report?.SharedWithOthers ? true : false;
    this.isSharedWithOthersIncident = this.isIncident && isShared;
    this.isSharedWithOthers = !this.isIncident && isShared;
    this.model.ContactDetails = applicationService.model.EmailAddress;
    this.setValuesToReportModel(applicationService.model?.Report!);
    this.setValuesToBuildingModel(applicationService.model?.Building!);
    this.addressRouteKey = this.getAddressRouteKey(applicationService.model.Building?.Address?.BuildingAddressType!);
    this.organisationName = applicationService.model.Report!.OrganisationName ?? "organisation";
    
    this.isSameUser = applicationService.model.Report?.SubmittedNotice == "me" ? true : false;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {}
    }
    applicationService.model.Report!.CheckAnswersModel = this.model;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  navigateTo(routeKey: string) {
    if (this.baseRoutes.find(f => f == routeKey)) {
      return this.navigationService.navigate(routeKey);
    } else {
      return this.navigationService.navigateRelative(routeKey, this.activatedRoute);
    }
  }

  navigateToAddress() {
    var routeKey = NavigationHelper.getRoute(this.addressRouteKey!)
    return this.navigationService.navigate(routeKey);
  }

  getAddressRouteKey(addressType: AddressType) {
    switch (addressType) {
      case AddressType.BCAReference: return "report-bca-reference-number";
      case AddressType.HRBNumber: return "report-hrb-number";
      case AddressType.PostcodeSearch: return "report-search-address";
      case AddressType.Manual: return "report-search-address";
      case AddressType.AboutBuilding: return "report-search-address";
    }
  }

  setValuesToBuildingModel(buildingModel: BuildingModel) {
    this.model.Address = this.isSearchAdress || this.isManual ? buildingModel?.Address?.Address!.split(',').filter(x => x.trim().length > 0).join(', ') : "";
    this.model.IsManualAddress = buildingModel?.Address?.IsManual ? buildingModel?.Address?.IsManual : false;   
    this.model.BcaReference = buildingModel?.Address?.BcaReference;
    this.model.HrbNumber = buildingModel?.Address?.HrbNumber;
    this.model.AboutBuilding = buildingModel?.LocateBuilding ?? "";
    if (this.isManual) {
      this.model.Address = buildingModel?.Address ? this.returnManualAddress(buildingModel?.Address) : "";
      this.model.AddressRegion = buildingModel?.AddressRegion?.toUpperCase();
      this.model.NumberOfFloors = buildingModel?.NumberOfFloorsProf?.toString();
      this.model.NumberOfUnits = buildingModel?.NumberOfUnitsProf?.toString();
      this.model.BuildingHeight = buildingModel?.BuildingHeight?.toString();
    }

  }

  setValuesToReportModel(reportModel: ReportModel) {
    this.fileNameArray = [];
    this.model.YourName = `${reportModel.FirstName} ${reportModel.LastName}`;
    this.model.ContactNumber = reportModel.ContactNumber;
    this.model.OrganisationName = reportModel.OrganisationName;
    this.model.OrgRole = reportModel.OrgRole;
    this.model.SubmittedNotice = reportModel.SubmittedNotice;
    this.model.NoticeReference = reportModel.NoticeReference;
    if (reportModel.IncidentReported) {
      reportModel.IncidentReported.forEach(v => {
        this.incidentReportedArray.push(this.incidentReportedText[v ?? ""]);
      })
      this.model.IncidentReported = this.incidentReportedArray.length > 1 ? this.incidentReportedArray.toString().split(',').filter(x => x.trim().length > 0).join(', ') : this.incidentReportedArray.toString();
    }
    if (reportModel.RiskReported) {
      reportModel.RiskReported.forEach(v => {
        this.riskReportedArray.push(this.riskReportedText[v ?? ""]);
      })
      this.model.RiskReported = this.riskReportedArray.length > 1 ? this.riskReportedArray.toString().split(',').filter(x => x.trim().length > 0).join(', ') : this.riskReportedArray.toString();
    }
    this.model.IncidentOrSituation = reportModel.WhatToReport == "risk" ? "Situation" : "Incident";
    this.model.AboutIncident = reportModel.AboutIncident;
    this.model.CauseOfIncident = reportModel.CauseOfIncident;
    this.model.IncidentKeepPeopleSafe = reportModel.IncidentKeepPeopleSafe;
    this.model.WhoAffectedByIncident = reportModel.WhoAffectedByIncident;
    this.model.OccurrenceDiscovered = reportModel.OccurrenceDiscovered;
    this.model.SharedWithOthers = reportModel.SharedWithOthers;
    this.model.AboutRisk = reportModel.AboutRisk;
    this.model.CauseOfRisk = reportModel.CauseOfRisk;
    this.model.WhoAffectedByRisk = reportModel.WhoAffectedByRisk;
    this.model.RiskKeepPeopleSafe = reportModel.RiskKeepPeopleSafe;
    this.model.OrganisationFindOut = reportModel.OrganisationFindOut;
    if (reportModel.FilesUploaded) {
      reportModel.FilesUploaded.map(v => {
        this.fileNameArray.push(v.FileName!);
      });
      this.model.UploadedFileNames = this.fileNameArray.length > 1 ? this.fileNameArray.toString().split(',').filter(x => x.trim().length > 0).join(', ') : this.fileNameArray.toString();
      reportModel.YourSupportInfo = this.model.UploadedFileNames;
    }
    
  }

  private incidentReportedText: Record<string, string> = {
    "structural_failure": "structural failure",
    "fire_spread": "fire spread",
    "fire_safety": "fire safety",   
    "": ""
  }
  private riskReportedText: Record<string, string> = {
    "structural_failure": "risk of structural failure",
    "fire_spread": "risk of fire spreading",
    "fire_safety": "fire safety",   
    "": ""
  } 

  returnManualAddress(model: AddressModel): string {
    var addressArray = [];
    addressArray.push(model.Address!);
    if (model.AddressLineTwo) {
      addressArray.push(model.AddressLineTwo);
    }
    if (model.AdministrativeArea) {
      addressArray.push(model.AdministrativeArea);
    }
    addressArray.push(model.Town!, model.Postcode!);
    var addressString = addressArray.toString();
    return addressString.split(',').filter(x => x.trim().length > 0).join(', ');
  }

  modelValid: boolean = false;
  override isValid(): boolean {
    return true
  }
  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(ReportConfirmationComponent.route, this.activatedRoute);
  }
}

