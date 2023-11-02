import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService, CheckAnswersNoticeModel } from "../../../services/application.service";
import { ActivatedRouteSnapshot } from "@angular/router";
import { AddressType } from '../../../services/address.service';
import { NoticeConfirmationComponent } from '../notice-confirmation/notice-confirmation.component';

@Component({
  templateUrl: './notice-summary.component.html'
})

export class NoticeSummaryComponent extends PageComponent<CheckAnswersNoticeModel> {
  public static route: string = 'notice-summary';
  static title: string = "Notice Summary";
  override model: CheckAnswersNoticeModel = new CheckAnswersNoticeModel();
  isBCAAddress: boolean = false;
  isHRBAdress: boolean = false;
  isSearchAdress: boolean = false;
  isManual: boolean = false;
  fileNameArray: string[] = [];
  addressRouteKey?: string;
  isAddressManual: boolean = false;
  isAboutBuilding: boolean = false;

  override onInit(applicationService: ApplicationService): void {
    this.isBCAAddress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.BCAReference ? true : false;
    this.isHRBAdress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.HRBNumber ? true : false;
    this.isSearchAdress = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.PostcodeSearch ? true : false;
    this.isManual = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.Manual ? true : false;
    this.isAboutBuilding = applicationService.model.Building?.Address?.BuildingAddressType == AddressType.AboutBuilding ? true : false;
    this.model.Address = applicationService.model.Notice?.CheckAnswersModel?.Address;
    this.model.BcaReference = applicationService.model.Notice?.CheckAnswersModel?.BcaReference;
    this.model.HrbNumber = applicationService.model.Notice?.CheckAnswersModel?.HrbNumber;
    this.model.AboutBuilding = applicationService.model.Notice?.CheckAnswersModel?.AboutBuilding;
    this.isAddressManual = applicationService.model.Notice?.CheckAnswersModel?.IsManualAddress!;
    if (this.isManual) {
      this.model.AddressRegion = applicationService.model.Notice?.CheckAnswersModel?.AddressRegion;
      this.model.NumberOfFloors = applicationService.model.Notice?.CheckAnswersModel?.NumberOfFloors?.toString();
      this.model.NumberOfUnits = applicationService.model.Notice?.CheckAnswersModel?.NumberOfUnits?.toString();
      this.model.BuildingHeight = applicationService.model.Notice?.CheckAnswersModel?.BuildingHeight?.toString();
    }
    this.model.YourName = applicationService.model.Notice?.CheckAnswersModel?.YourName;
    this.model.Incident = applicationService.model.Notice?.CheckAnswersModel?.Incident;
    this.model.ActionsToKeepSafe = applicationService.model.Notice?.CheckAnswersModel?.ActionsToKeepSafe;
    this.model.OccurrenceDateTime = applicationService.model.Notice?.CheckAnswersModel?.OccurrenceDateTime;
    this.model.ContactDetails = applicationService.model.Notice?.CheckAnswersModel?.ContactDetails;
    this.model.ContactNumber = applicationService.model.Notice?.CheckAnswersModel?.ContactNumber;
    this.model.OrganisationName = applicationService.model.Notice?.CheckAnswersModel?.OrganisationName;
    this.model.OrgRole = applicationService.model.Notice?.CheckAnswersModel?.OrgRole;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  printSummary() {
    window.print();
  }

  modelValid: boolean = false;
  override isValid(): boolean {
    return true
  }
  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(NoticeConfirmationComponent.route, this.activatedRoute);
  }
}

