import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService, BuildingModel, MORModel, NoticeModel } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRouteSnapshot } from "@angular/router";
import { AddressModel, AddressType } from '../../../services/address.service';
import { NavigationHelper } from '../../../helpers/navigation.helper';

@Component({
  templateUrl: './notice-check-your-answers.component.html'
})

export class NoticeCheckYourAnswersComponent extends PageComponent<CheckAnswersNoticeModel> {
  public static route: string = 'check-your-answers';
  static title: string = "Check your answers";
  baseRoutes: string[] = ["enter-email", "what-to-submit"];
  override model: CheckAnswersNoticeModel = new CheckAnswersNoticeModel();
  isBCAAddress: boolean = false;
  isHRBAdress: boolean = false;
  isSearchAdress: boolean = false;
  fileNameArray: string[] = [];
  addressRouteKey?: string;
  isAddressManual: boolean = false;

  override onInit(applicationService: ApplicationService): void {
    this.isBCAAddress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.BCAReference ? true : false; 
    this.isHRBAdress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.HRBNumber ? true : false;
    this.isSearchAdress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.PostcodeSearch ? true : false;
    this.isAddressManual = applicationService.model.Building?.Address?.IsManual ?? false;
    this.model.ContactDetails = applicationService.model.EmailAddress;
    this.setValuesToNoticeModel(applicationService.model?.Notice!);
    this.setValuesToBuildingModel(applicationService.model?.Building!);
    this.addressRouteKey = this.getAddressRouteKey(applicationService.model.Building?.Address?.BuildingAddressType!)
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {

  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return applicationService.model.Notice?.WhenBecomeAware !== undefined;
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
      case AddressType.BCAReference: return "notice-bca-reference-number";
      case AddressType.HRBNumber: return "notice-hrb-number";
      case AddressType.PostcodeSearch: return "notice-search-address";
    }
  }

  setValuesToBuildingModel(buildingModel: BuildingModel) {
    this.model.Address = buildingModel?.Address ? buildingModel?.Address.Address!.split(',').filter(x => x.trim().length > 0).join(', ') : "";
    this.model.IsManualAddress = buildingModel?.Address?.IsManual ? buildingModel?.Address?.IsManual : false;
    this.model.AddressRegion = buildingModel.AddressRegion;
    this.model.NumberOfFloors = buildingModel.NumberOfFloorsProf?.toString();
    this.model.NumberOfUnits = buildingModel.NumberOfUnitsProf?.toString();
    this.model.BuildingHeight = buildingModel.BuildingHeight?.toString();
    this.model.BcaReference = buildingModel?.Address?.BcaReference;
    this.model.HrbNumber = buildingModel?.Address?.HrbNumber;
    if (this.isAddressManual) {
      this.model.Address = buildingModel?.Address ? this.returnManualAddress(buildingModel?.Address) : "";
      this.model.AddressRegion = buildingModel?.AddressRegion?.toUpperCase();
      this.model.NumberOfUnits = buildingModel?.NumberOfFloorsProf?.toString();
      this.model.NumberOfUnits = buildingModel?.NumberOfUnitsProf?.toString();
      this.model.BuildingHeight = buildingModel?.BuildingHeight?.toString();
    }
    
  }

  setValuesToNoticeModel(noticeModel: NoticeModel) {  
    this.model.YourName = `${noticeModel.FirstName} ${noticeModel.LastName}`;
    this.model.Incident = noticeModel.DescribeRiskIncident;
    this.model.OccurrenceDateTime = `${noticeModel.WhenBecomeAware!.Day}-${noticeModel.WhenBecomeAware!.Month}-${noticeModel.WhenBecomeAware!.Year} - ${noticeModel.WhenBecomeAware!.Hour} ${this.setMeridiem(noticeModel.WhenBecomeAware!.Hour!)}`;
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
    return this.navigationService.navigateRelative('confirmation', this.activatedRoute);
  }
}
export class CheckAnswersNoticeModel {
  Address?: string;
  YourName?: string;
  Incident?: string;
  OccurrenceDateTime?: string;
  ContactDetails?: string;
  IsManualAddress: boolean = false;
  AddressRegion?: string;
  NumberOfFloors?: string;
  NumberOfUnits?: string;
  BuildingHeight?: string;
  BcaReference?: string;
  HrbNumber?: string;
  
}
