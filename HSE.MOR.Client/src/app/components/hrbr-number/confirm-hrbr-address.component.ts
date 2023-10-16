import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AddressModel } from 'src/app/services/address.service';
import { ApplicationService, BuildingModel } from 'src/app/services/application.service';
import { GetInjector } from '../../helpers/injector.helper';

@Component({
  selector: 'confirm-hrbr-address',
  templateUrl: './confirm-hrbr-address.component.html'
})
export class ConfirmHrbrAddressComponent implements OnInit {

  @Input() address!: AddressModel;
  @Input() contactRequest!: BuildingModel;
  @Input() addressName?: string;
  @Input() selfAddress = false;
  @Output() onAddressConfirmed = new EventEmitter<boolean | undefined>();
  @Output() onSearchAgain = new EventEmitter();
  @Output() onIdentifyBuilding = new EventEmitter();

  private injector: Injector = GetInjector();
  private applicationService: ApplicationService = this.injector.get(ApplicationService);

  ngOnInit(): void {
    this.contactRequest = this.applicationService.model.Building!;
  }

  getAddressLineOne() {
    var address = this.address.Address?.replace(this.address.Town!, '')!;
    return address.split(',').filter(x => x.trim().length > 0).join(', ');
  }
  getTitle() {
    return this.selfAddress ? 'Confirm your address' : `Confirm the address of ${this.addressName}`;
  }


}
