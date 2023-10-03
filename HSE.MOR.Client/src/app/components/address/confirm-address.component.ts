import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AddressModel } from 'src/app/services/address.service';
import { ApplicationService, BuildingModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { GetInjector } from '../../helpers/injector.helper';

@Component({
  selector: 'confirm-address',
  templateUrl: './confirm-address.component.html'
})
export class ConfirmAddressComponent implements OnInit {

  @Input() address!: AddressModel;
  @Input() contactRequest!: BuildingModel;
  @Input() addressName?: string;
  @Input() selfAddress = false;
  @Output() onAddressConfirmed = new EventEmitter<boolean | undefined>();
  @Output() onSearchAgain = new EventEmitter();
  @Output() onEnterManualAddress = new EventEmitter();

  private injector: Injector = GetInjector();
  private applicationService: ApplicationService = this.injector.get(ApplicationService);

  constructor(public navigationService: NavigationService) {
  }

  ngOnInit(): void {
    this.contactRequest = this.applicationService.model.Building!;
  }

  getAddressLineOne() {
    if (this.address.IsManual)
      return this.returnManualAddress(this.address);

    var address = this.address.Address?.replace(this.address.Town!, '')!;
    return address.split(',').filter(x => x.trim().length > 0).join(', ');
  }
  getTitle() {
    return this.selfAddress ? 'Confirm your address' : `Confirm the address of ${this.addressName}`;
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
}
