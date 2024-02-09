import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService, BuildingModel, CheckAnswersReportModel, UploadSharepointModel, ReportModel } from "../../../services/application.service";
import { ActivatedRouteSnapshot } from "@angular/router";
import { AddressModel, AddressType } from '../../../services/address.service';
import { NavigationHelper } from '../../../helpers/navigation.helper';
import { FieldValidations } from '../../../helpers/validators/fieldvalidations';
import { ReportConfirmationComponent } from '../report-confirmation/report-confirmation.component';
import { app } from '../../../../../server';
@Component({
  templateUrl: './report-check-your-answers.component.html'
})

export class ReportCheckYourAnswersComponent extends PageComponent<CheckAnswersReportModel> {
  public static route: string = 'check-your-answers';
  static title: string = "Check your answers - Submit a mandatory occurrence notice and report";
  baseRoutes: string[] = ["enter-email", "what-to-submit"];
  override model: CheckAnswersReportModel = new CheckAnswersReportModel();
  isBCAAddress: boolean = false;
  isHRBAdress: boolean = false;
  isSearchAddress: boolean = false;
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
  UploadSharepointModel?: UploadSharepointModel;
  incidentId?: string;
  isBuildingType: boolean = false;
  isEnteredAddress: boolean = false;
  isProvidedAdress: boolean = false;
  isIdentiyBuilding: boolean = false;
  isActingOrganisation: boolean = false;

  override onInit(applicationService: ApplicationService): void {
    if (applicationService.model.Report?.CheckAnswersModel!) {
      this.model = applicationService.model.Report?.CheckAnswersModel!;
    }
    this.isBCAAddress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.BCAReference ? true : false;
    this.isHRBAdress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.HRBNumber ? true : false;
    this.isSearchAddress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.PostcodeSearch || applicationService.model.Building?.Address?.BuildingAddressType == undefined ? true : false;
    this.isManual = applicationService.model.Building?.Address?.IsManual ? true : false;
    this.isAaboutTheBuilding = applicationService.model.Building?.LocateBuilding ? true : false;
    this.isEnteredAddress = this.isSearchAddress || this.isManual;
    this.isProvidedAdress = this.isBCAAddress || this.isHRBAdress;
    this.isNoticeReference = FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.NoticeReference);
    this.isActingOrganisation = (FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.ActingOrg) && FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.ActingOrgRole) && applicationService.model.Report?.OrgRole == "on_behalf")
      && (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.NoticeReference) || (FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.NoticeReference) && applicationService.model.Report?.SubmittedNotice == "other"))
    this.model.ContactDetails = applicationService.model.EmailAddress;
    this.model.WhatToSubmit = applicationService.model.WhatToSubmit;
    this.setValuesToReportModel(applicationService.model?.Report!);
    this.setValuesToBuildingModel(applicationService.model?.Building!);
    this.addressRouteKey = this.getAddressRouteKey(applicationService.model.Building?.Address?.BuildingAddressType!);
    this.organisationName = applicationService.model.Report!.OrganisationName ?? "organisation";
    this.isBuildingType = applicationService.model.Building?.BuildingType ? true : false;
    this.isIdentiyBuilding = applicationService.model.Building?.IdentifyBuilding ? true : false;
    this.isSameUser = applicationService.model.Report?.SubmittedNotice == "me" ? true : false;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {}
    }
    applicationService.model.Report!.CheckAnswersModel = this.model;
    if (applicationService.model.Report.NoticeReference) {
      await applicationService.updateMORApplication();
    } else {
      await applicationService.createNewMORReportApplication();
    }  
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !applicationService.model.IsAnswersChecked;
  }

  navigateTo(routeKey: string) {
    if (this.baseRoutes.find(f => f == routeKey)) {
      return this.navigationService.navigate(routeKey);
    } else {
      return this.navigationService.navigateRelative(routeKey, this.activatedRoute);
    }
  }

  navigateToAddress(step: string = "") {
    var routeKey = NavigationHelper.getRoute(this.addressRouteKey!)
    if (step !== "")
      return this.navigationService.navigateRelative(`..${routeKey}`, this.activatedRoute, { step: step });
    return this.navigationService.navigate(routeKey);
  }

  getAddressRouteKey(addressType: AddressType) {
    switch (addressType) {
      case AddressType.BCAReference: return "report-bca-reference-number";
      case AddressType.HRBNumber: return "report-hrb-number";
      case AddressType.PostcodeSearch: return "report-search-address";
      case AddressType.Manual: return "report-search-address";
      case AddressType.AboutBuilding: return "report-search-address";
      case undefined: return "report-search-address";
    }
  }

  setValuesToBuildingModel(buildingModel: BuildingModel) {
    if (buildingModel?.Address?.Address) {
      this.model.Address = buildingModel?.Address?.Address!.split(',').filter(x => x.trim().length > 0).join(', ');
      this.model.IsManualAddress = buildingModel?.Address?.IsManual ? buildingModel?.Address?.IsManual : false;
      this.model.BcaReference = buildingModel?.Address?.BcaReference
      this.model.HrbNumber = buildingModel?.Address?.HrbNumber;
    } 
    this.model.AboutBuilding = buildingModel?.LocateBuilding ?? "";
    if (this.isManual || buildingModel?.LocateBuilding) {
      this.model.Address = buildingModel?.Address ? this.returnManualAddress(buildingModel?.Address) : "";
      this.model.AddressRegion = buildingModel?.AddressRegion?.toUpperCase();
      this.model.NumberOfFloors = buildingModel?.NumberOfFloorsProf?.toString();
      this.model.NumberOfUnits = buildingModel?.NumberOfUnitsProf?.toString();
      this.model.BuildingHeight = buildingModel?.BuildingHeight?.toString();
    }
    this.model.IdentiyBuilding = buildingModel.IdentifyBuilding;
  }

  setValuesToReportModel(reportModel: ReportModel) {
    this.fileNameArray = [];
    this.model.YourName = `${reportModel.FirstName} ${reportModel.LastName}`;
    this.model.ContactNumber = reportModel.ContactNumber;
    this.model.OrganisationName = reportModel.OrganisationName;
    this.model.OrgRole = reportModel.OrgRole;
    this.model.ActingOrg = reportModel.ActingOrg;
    this.model.ActingOrgRole = reportModel.ActingOrgRole;
    if (reportModel.ReportWhenBecomeAware) {
      this.model.OccurrenceDateTime = `${reportModel.ReportWhenBecomeAware!.Day}-${reportModel.ReportWhenBecomeAware!.Month}-${reportModel.ReportWhenBecomeAware!.Year} - ${reportModel.ReportWhenBecomeAware!.Hour}:${reportModel.ReportWhenBecomeAware!.Minute}  ${this.setMeridiem(Number(reportModel.ReportWhenBecomeAware!.Hour!))}`;
    }
    
    this.model.SubmittedNotice = reportModel.SubmittedNotice;
    this.model.NoticeReference = reportModel.NoticeReference;
    if (reportModel.IncidentReported) {
      reportModel.IncidentReported.forEach(v => {
        this.incidentReportedArray.push(this.incidentReportedText[v ?? ""]);
      })
      this.model.IncidentReported = this.incidentReportedArray.length > 1 ? this.incidentReportedArray.toString().split(',').filter(x => x.trim().length > 0).join(', ') : this.incidentReportedArray.toString();
    }   
    this.model.AboutIncident = reportModel.AboutIncident;
    this.model.CauseOfIncident = reportModel.CauseOfIncident;
    this.model.IncidentKeepPeopleSafe = reportModel.IncidentKeepPeopleSafe;
    this.model.WhoAffectedByIncident = reportModel.WhoAffectedByIncident;
    this.model.OccurrenceDiscovered = reportModel.OccurrenceDiscovered;
    
    this.model.SharedWithOthers = reportModel.SharedWithOthers;
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

  setMeridiem(hour: number) {
    return hour < 13 ? "am" : "pm";
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

