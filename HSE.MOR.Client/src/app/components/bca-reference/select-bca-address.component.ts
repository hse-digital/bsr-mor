import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { AddressModel, AddressResponseModel } from 'src/app/services/address.service';
import { ApplicationService } from 'src/app/services/application.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'select-bca-address',
  templateUrl: './select-bca-address.component.html'
})
export class SelectBcaAddressComponent {

  bcaAddressHasErrors = false;
  selectedAddress?: AddressModel;

  @Input() addressName!: string;
  @Input() addressResponse?: AddressResponseModel;
  @Input() searchModel: { referenceNumber?: string } = {}
  @Input() selfAddress = false;

  @Output() onAddressSelected = new EventEmitter<AddressModel>();
  @Output() onSearchAgain = new EventEmitter();

  @ViewChildren("summaryError") summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(public applicationService: ApplicationService, private titleService: TitleService) { }

  continue() {
    this.bcaAddressHasErrors = !this.selectedAddress;
    if (!this.bcaAddressHasErrors) {
      this.onAddressSelected.emit(this.selectedAddress);
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    }
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.bcaAddressHasErrors && showError ? errorMessage : undefined;
  }

  get numberOfAddresses(): number | undefined {
    return this.addressResponse?.Results.length;
  }

  getTitle() {
    return this.selfAddress ? 'Select your address' : `Select the address of ${this.addressName}`;
  }
}
