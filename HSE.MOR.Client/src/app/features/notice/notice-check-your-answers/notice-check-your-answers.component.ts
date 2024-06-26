import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService, BuildingModel, CheckAnswersNoticeModel, NoticeModel } from "../../../services/application.service";
import { ActivatedRouteSnapshot } from "@angular/router";
import { AddressModel, AddressType } from '../../../services/address.service';
import { NavigationHelper } from '../../../helpers/navigation.helper';
import { NoticeConfirmationComponent } from '../notice-confirmation/notice-confirmation.component';
import { FieldValidations } from '../../../helpers/validators/fieldvalidations';

@Component({
  templateUrl: './notice-check-your-answers.component.html'
})

export class NoticeCheckYourAnswersComponent extends PageComponent<CheckAnswersNoticeModel> {
  public static route: string = 'check-your-answers';
  static title: string = "Check your answers - Submit a mandatory occurrence notice and report";
  baseRoutes: string[] = ["enter-email", "what-to-submit"];
  override model: CheckAnswersNoticeModel = new CheckAnswersNoticeModel();
  isBCAAddress: boolean = false;
  isHRBAdress: boolean = false;
  isSearchAddress: boolean = false;
  isManualAddress: boolean = false;
  fileNameArray: string[] = [];
  addressRouteKey?: string;
  isAaboutTheBuilding: boolean = false;
  isAddress: boolean = false;
  isEnteredAddress: boolean = false;
  isProvidedAdress: boolean = false;
  isActingOrganisation: boolean = false;

  override onInit(applicationService: ApplicationService): void {
    this.isBCAAddress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.BCAReference ? true : false; 
    this.isHRBAdress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.HRBNumber ? true : false;
    this.isSearchAddress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.PostcodeSearch || applicationService.model.Building?.Address?.BuildingAddressType == undefined ? true : false;   
    this.isAaboutTheBuilding = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.AboutBuilding ? true : false;
    this.isManualAddress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.Manual ? true : false;
    this.isEnteredAddress = this.isSearchAddress || this.isManualAddress;
    this.isProvidedAdress = this.isBCAAddress || this.isHRBAdress;
    this.isActingOrganisation = FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice?.ActingOrg)
      && FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice?.ActingOrgRole) && applicationService.model.Notice?.OrgRole == "on_behalf";

    this.model.ContactDetails = applicationService.model.EmailAddress;
    this.model.WhatToSubmit = applicationService.model.WhatToSubmit;
    this.setValuesToNoticeModel(applicationService.model?.Notice!);
    this.setValuesToBuildingModel(applicationService.model?.Building!);
    this.addressRouteKey = this.getAddressRouteKey(applicationService.model.Building?.Address?.BuildingAddressType!)
    this.isAddress = applicationService.model?.Building!.Address?.Address ? true : false;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    if (!applicationService.model.Notice) {
      applicationService.model.Notice = {}
    }
    applicationService.model.Notice!.CheckAnswersModel = this.model;
    if (applicationService.model.Id) {
      applicationService.updateMORApplication();   
    } else {
      await applicationService.createNewMORApplication();
    }
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return applicationService.model.Notice?.WhenBecomeAware !== undefined && !applicationService.model.IsAnswersChecked;
  }

  navigateTo(routeKey: string) {
    if (this.baseRoutes.find(f => f == routeKey)) {
      return this.navigationService.navigate(routeKey);
    } else {
      return this.navigationService.navigateRelative(routeKey, this.activatedRoute);
    }
  }

  navigateToAddress(step:string="") {
    var routeKey = NavigationHelper.getRoute(this.addressRouteKey!)
    if(step!=="")
      return this.navigationService.navigateRelative(`..${routeKey}`, this.activatedRoute, { step: step });
    return this.navigationService.navigate(routeKey);
  }

  getAddressRouteKey(addressType: AddressType) {
    switch (addressType) {
      case AddressType.BCAReference: return "notice-bca-reference-number";
      case AddressType.HRBNumber: return "notice-hrb-number";
      case AddressType.PostcodeSearch: return "notice-search-address";
      case AddressType.Manual: return "notice-search-address";
      case AddressType.AboutBuilding: return "notice-search-address";
    }
  }

  setValuesToBuildingModel(buildingModel: BuildingModel) {
    this.model.Address = !this.isAaboutTheBuilding ? buildingModel?.Address?.Address!.split(',').filter(x => x.trim().length > 0).join(', ') : "";
    this.model.IsManualAddress = buildingModel?.Address?.IsManual ? buildingModel?.Address?.IsManual : false;   
    this.model.BcaReference = buildingModel?.Address?.BcaReference;
    this.model.HrbNumber = buildingModel?.Address?.HrbNumber;
    this.model.AboutBuilding = buildingModel?.LocateBuilding ?? "";
    if (this.isManualAddress || this.isAaboutTheBuilding) {
      this.model.Address = buildingModel?.Address ? this.returnManualAddress(buildingModel?.Address) : "";
      this.model.AddressRegion = buildingModel?.AddressRegion?.toUpperCase();
      this.model.NumberOfFloors = buildingModel?.NumberOfFloorsProf?.toString();
      this.model.NumberOfUnits = buildingModel?.NumberOfUnitsProf?.toString();
      this.model.BuildingHeight = buildingModel?.BuildingHeight?.toString();
    }
    
  }

  setValuesToNoticeModel(noticeModel: NoticeModel) {  
    this.model.YourName = `${noticeModel.FirstName} ${noticeModel.LastName}`;
    this.model.Incident = noticeModel.DescribeRiskIncident;
    this.model.ActionsToKeepSafe = noticeModel.ActionsToKeepSafe;
    this.model.OccurrenceDateTime = `${noticeModel.WhenBecomeAware!.Day}-${noticeModel.WhenBecomeAware!.Month}-${noticeModel.WhenBecomeAware!.Year} - ${noticeModel.WhenBecomeAware!.Hour}:${noticeModel.WhenBecomeAware!.Minute}  ${this.setMeridiem(Number(noticeModel.WhenBecomeAware!.Hour!))}`;
    this.model.ContactNumber = noticeModel.ContactNumber;
    this.model.OrganisationName = noticeModel.OrganisationName;
    this.model.ActingOrg = noticeModel.ActingOrg;
    this.model.ActingOrgRole = noticeModel.ActingOrgRole;
    this.model.OrgRole = noticeModel.OrgRole;
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

  setMeridiem(hour: number) {
    return hour < 13 ? "am" : "pm";
  }

  modelValid: boolean = false;
  override isValid(): boolean {
    return true
  }
  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(NoticeConfirmationComponent.route, this.activatedRoute);
  }
}

