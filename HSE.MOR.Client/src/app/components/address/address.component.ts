import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AddressModel, AddressResponseModel } from 'src/app/services/address.service';
import { GetInjector } from '../../helpers/injector.helper';
import { NavigationHelper } from '../../helpers/navigation.helper';
import { ApplicationService, BuildingModel } from '../../services/application.service';
import { NavigationService } from '../../services/navigation.service';
@Component({
  selector: 'hse-address',
  templateUrl: './address.component.html'
})
export class AddressComponent implements OnInit {

  private injector: Injector = GetInjector();
  private applicationService: ApplicationService = this.injector.get(ApplicationService);

  @ViewChild("backButton") public backButton?: ElementRef;

  constructor(public navigationService: NavigationService) {
  }

  @Input() searchMode: AddressSearchMode = AddressSearchMode.Building;
  @Input() address?: AddressModel;
  @Input() addressName!: string;
  @Input() selfAddress = false;
  @Output() onAddressConfirmed = new EventEmitter();
  @Output() onChangeStep = new EventEmitter();
  @Output() onManualEnter = new EventEmitter();
  @Output() onGoToIdentifyBuilding = new EventEmitter();


  searchModel: { postcode?: string } = {};
  addressResponse?: AddressResponseModel;

  @Input() step = '';
  private history: string[] = [];

  ngOnInit(): void {
    if (this.step != undefined && this.step!.length > 0) {
      this.changeStepTo(this.step);
      this.history = [];
    }
    else if (this.address) {
      this.changeStepTo('confirm');
      this.history = [];
    } else {
      this.changeStepTo('has-address');
      this.history = [];
    }
  }

  addressConfirmed() {
    this.onAddressConfirmed.emit(this.address);
  }

  searchPerformed(addressResponse: AddressResponseModel) {
    if (addressResponse.Results.length > 0) {
      this.addressResponse = addressResponse;
      if (this.addressResponse.Results.length == 1) {
        this.address = this.addressResponse.Results[0];
        this.changeStepTo('confirm');
      } else {
        this.changeStepTo(addressResponse.TotalResults < 100 ? "select" : "too-many");
      }
    } else {
      this.changeStepTo("not-found");
    }
  }

  addressSelected(selectedAddress: any) {
    this.address = selectedAddress;
    this.changeStepTo('confirm');
  }

  addressRegion(region: string) {
    if (region == "england") {
      this.changeStepTo('manual');
    } else {
      this.changeStepTo("not-in-scope");
    }
  }
  hasAddress(hasAddress: string) {
    if (hasAddress == "yes") {
      this.changeStepTo('find');
    } else {
      this.changeStepTo('locate-building-address');
    }
  }
  locateBuildingAddress(locateBuilding: string) {
    if (locateBuilding) {
      this.changeStepTo('prof-number-of-floors');
    } 
  }

  numberOfFloors(floors: string) {
    this.applicationService.model.Building!.NumberOfFloors = floors;
    if (floors == 'seven_or_less') {
      this.changeStepTo("building-not-in-scope");
    } else {
      this.changeStepTo('number-of-units');
    }

  }

  numberOfUnits(units: string) {
    this.applicationService.model.Building!.NumberOfUnits = units;
    if (units == 'no') {
      this.changeStepTo("building-not-in-scope");
    } else {
      this.changeStepTo('manual');
    }

  }

  profNumberOfFloors(floors: number) {
    this.applicationService.model.Building!.NumberOfFloorsProf = floors.toString();
    this.changeStepTo('building-height');
  }

  buildingHeight(height: number) {
    this.applicationService.model.Building!.BuildingHeight = height.toString();
    if (this.isHeightInScope(this.applicationService.model.Building!)) {
      this.changeStepTo('prof-number-of-units');
    } else {
      this.changeStepTo("building-not-in-scope");
    }

  }

  profNumberOfUnits(units: number) {
    this.applicationService.model.Building!.NumberOfUnitsProf = units.toString();
    if (this.applicationService.model.Building?.Address?.IsManual) {
      if (this.isInScope(this.applicationService.model.Building!)) {
        this.changeStepTo('confirm');
      } else {
        this.changeStepTo("building-not-in-scope");
      }
    } else {      
      if (this.applicationService.model.WhatToSubmit == 'notice') {       
        this.navigationService.navigate("notice/your-details");
      } else {
        this.navigationService.navigate("report/your-details");
      }
    }
  }

  manualAddressEntered(address: AddressModel) {
    this.address = address;
    this.changeStepTo('prof-number-of-floors');
  }

  searchAgain() {
    this.changeStepTo('find');
  }

  enterManualAddress() {
    this.changeStepTo('region');
  }

  goToIdenityBuilding() {
    this.onGoToIdentifyBuilding.emit(true);
  }

  navigateBack() {
    let previousStep = this.history.pop();
    if (!previousStep) {
      history.back();
    } else {
      this.step = previousStep;
      this.onChangeStep.emit(this.step);
    }
  }

  private changeStepTo(step: string) {
    this.history.push(this.step);
    this.step = step;
    this.resetFocus();
    this.onChangeStep.emit(this.step);
  }

  resetFocus() {
    const mainHeader = document.querySelector('#gouvk-header-service-name');
    if (mainHeader) {
      (mainHeader as HTMLElement).focus();
      (mainHeader as HTMLElement).blur();
    }
  }

  isHeightInScope(model: BuildingModel) {
    var greaterthan6Stories = Number(model.NumberOfFloorsProf) > 6;
    var greaterthan17Meters = Number(model.BuildingHeight) > 17;

    return greaterthan6Stories || greaterthan17Meters;
  }

  isInScope(model: BuildingModel) {
    var greaterthan6Stories = Number(model.NumberOfFloorsProf) > 6;
    var greaterthan17Meters = Number(model.BuildingHeight) > 17;

    var criteria1 = greaterthan6Stories || greaterthan17Meters;
    var criteria2 = Number(model.NumberOfUnitsProf) > 1;

    return criteria1 && criteria2;
  }

}

export enum AddressSearchMode {
  Building,
  PostalAddress,
}
