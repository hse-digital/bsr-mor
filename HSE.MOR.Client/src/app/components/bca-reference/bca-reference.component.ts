import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AddressModel, AddressResponseModel, AddressType } from 'src/app/services/address.service';
import { NavigationService } from '../../services/navigation.service';
@Component({
  selector: 'bca-reference',
  templateUrl: './bca-reference.component.html'
})
export class BcaReferenceComponent implements OnInit {

  @ViewChild("backButton") public backButton?: ElementRef;

  constructor(public navigationService: NavigationService) {
  }

  @Input() address?: AddressModel;
  @Input() addressName!: string;
  @Input() selfAddress = false;
  @Output() onAddressConfirmed = new EventEmitter();
  @Output() onChangeStep = new EventEmitter();
  @Output() onGoToIdentifyBuilding = new EventEmitter();


  searchModel: { referenceNumber?: string } = {};
  addressResponse?: AddressResponseModel;

  step = 'find';
  private history: string[] = [];

  ngOnInit(): void {
    if (this.address) {
      this.changeStepTo('confirm');
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

  searchAgain() {
    this.changeStepTo('find');
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
 
}

