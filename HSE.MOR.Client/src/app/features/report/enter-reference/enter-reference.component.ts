import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService, IncidentModelDynamics } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { WhoSubmittedNoticeComponent } from '../who-submitted-notice/who-submitted-notice.component';
import { NavigationHelper } from '../../../helpers/navigation.helper';
import { application } from 'express';
import { AddressType } from '../../../services/address.service';

@Component({
  templateUrl: './enter-reference.component.html'
})

export class EnterReferenceComponent extends PageComponent<string> {
  public static route: string = 'enter-reference';
  static title: string = "Enter mandatory occurrence notice reference - Submit a mandatory occurrence notice and report";
  caseNumber?: string;


  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {};
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.NoticeReference)) {
      applicationService.model.Report.NoticeReference = "";
    }
    this.model = applicationService.model.Report?.NoticeReference;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    
    var dynamicsIncidentModel = await applicationService.getIncidentByCaseNumber(this.model!);
    if (dynamicsIncidentModel) {
      this.mapCaseWithNotice(dynamicsIncidentModel, applicationService);
    }
    if (FieldValidations.IsNotNullOrWhitespace(this.model)) {
      applicationService.model.Report!.NoticeReference = this.model;
    } else {
      this.processing = false;
      this.modelValid = false;
      this.hasErrors = true;
      this.ErrorMessage = this.ErrorNotExists;
      throw Error;
    }
    
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  navigateToIdentifyBuilding() {
    let route = NavigationHelper.getRoute("report-identify-building");
    this.navigationService.navigate(route);
  }

  modelValid: boolean = false;
  RefFormat = new RegExp('^CAS[0-9]{5}[A-Z0-9]{4}$', 'i'); // i parameter to make case insensitive
  ErrorMessage: string = "";
  ErrorRequired = "You need to enter a notice reference";
  ErrorInvalid = "You need to enter a valid a notice reference";
  ErrorNotExists = "You need to enter a valid notice reference";

  override isValid(): boolean {
    if (!FieldValidations.IsNotNullOrWhitespace(this.model)) {
      this.modelValid = false;
      this.ErrorMessage = this.ErrorRequired;
    }
    else if (!this.RefFormat.test(this.model!)) {
      this.modelValid = false;
      this.ErrorMessage = this.ErrorInvalid;
    }
    else {
      this.modelValid = true;
    }
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(WhoSubmittedNoticeComponent.route, this.activatedRoute);
  }

  mapCaseWithNotice(caseModel: IncidentModelDynamics, applicationService: ApplicationService) {
    this.model = caseModel.CaseNumber;
    applicationService.model.Id = caseModel.IncidentId;
    applicationService.model.Report!.Id = caseModel.MorId;
    applicationService.model.CustomerId = caseModel.CustomerId;
    applicationService.model.MorId = caseModel.MorId;
    if (caseModel.BuildingModelDynamics) {
      applicationService.model.Building = {};     
      applicationService.model.Building.Address = {};
      if (AddressType[caseModel.BuildingModelDynamics.IdentifyBuilding as keyof typeof AddressType] == AddressType.HRBNumber)
      {
        applicationService.model.Building.Address.HrbApplicationId = caseModel.BuildingModelDynamics?.Address?.HrbApplicationId;
        applicationService.model.Building.IdentifyBuilding = "building_registration"
      }
      if (AddressType[caseModel.BuildingModelDynamics.IdentifyBuilding as keyof typeof AddressType] == AddressType.BCAReference)
      {
        applicationService.model.Building.Address.BuildingControlAppId = caseModel.BuildingModelDynamics?.Address?.BuildingControlAppId;
        applicationService.model.Building.IdentifyBuilding = "building_reference"
      }
      if (FieldValidations.IsNotNullOrWhitespace(caseModel.BuildingModelDynamics.IdentifyBuilding) || caseModel.BuildingModelDynamics.IdentifyBuilding == "")
      {
        applicationService.model.Building.Address.Address = caseModel.BuildingModelDynamics.Address?.Address;
        applicationService.model.Building.Address.Street = caseModel.BuildingModelDynamics.Address?.Street;
        applicationService.model.Building.Address.AddressLineTwo = caseModel.BuildingModelDynamics.Address?.AddressLineTwo;
        applicationService.model.Building.Address.AdministrativeArea = caseModel.BuildingModelDynamics.Address?.AdministrativeArea;
        applicationService.model.Building.Address.Town = caseModel.BuildingModelDynamics.Address?.Town;
        applicationService.model.Building.Address.Postcode = caseModel.BuildingModelDynamics.Address?.Postcode;
        applicationService.model.Building.Address.BuildingName = caseModel.BuildingModelDynamics.Address?.BuildingName;
        applicationService.model.Building.Address.IsManual = caseModel.BuildingModelDynamics.Address?.IsManual;
        applicationService.model.Building.BuildingHeight = caseModel.BuildingModelDynamics.Address?.BuildingHeight?.toString();
        applicationService.model.Building.NumberOfFloorsProf = caseModel.BuildingModelDynamics.Address?.NumberOfFloors?.toString();
        applicationService.model.Building.NumberOfUnitsProf = caseModel.BuildingModelDynamics.Address?.ResidentialUnits?.toString();
        applicationService.model.Building.Address.UPRN = caseModel.BuildingModelDynamics.Address?.UPRN;
        applicationService.model.Building.Address.ParentUPRN = caseModel.BuildingModelDynamics.Address?.ParentUPRN;
        applicationService.model.Building.Address.Number = caseModel.BuildingModelDynamics.Address?.Number;
      }
      applicationService.model.Building.LocateBuilding = caseModel.BuildingModelDynamics.LocateBuilding;
    }
  }
}
