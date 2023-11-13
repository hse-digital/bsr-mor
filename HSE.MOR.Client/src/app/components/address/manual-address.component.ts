import { Component, EventEmitter, Injector, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';
import { AddressModel, AddressType } from 'src/app/services/address.service';
import { AddressSearchMode } from './address.component';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { TitleService } from 'src/app/services/title.service';
import { GetInjector } from '../../helpers/injector.helper';
import { FieldValidations } from '../../helpers/validators/fieldvalidations';
import { PostCodeValidator } from '../../helpers/validators/postcode-validator';

@Component({
  selector: 'manual-address',
  templateUrl: './manual-address.component.html'
})
export class ManualAddressComponent {

  @Input() searchMode: AddressSearchMode = AddressSearchMode.Building;
  @Output() onSearchAgain = new EventEmitter();
  @Output() onAddressEntered = new EventEmitter<AddressModel>();
  @Input() addressName?: string;
  @Input() selfAddress = false;

  hasErrors = false;
  errors = {
    postcodeHasErrors: false,
    addressHasErrors: false,
    townCityHasErrors: false,
    postcode: { hasErrors: false, errorText: '' },
  }

  model: AddressModel = { BuildingAddressType: AddressType.Manual, IsManual: true }

  @ViewChildren("summaryError") summaryError?: QueryList<GovukErrorSummaryComponent>;

  private injector: Injector = GetInjector();
  private applicationService: ApplicationService = this.injector.get(ApplicationService);

  constructor(private titleService: TitleService) {
    this.applicationService.model.Building!.Address = this.model;
  }

  confirmAddress() {
    if (this.isModelValid()) {
      this.onAddressEntered.emit(this.model);
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    }
  }

  postcodeMessage: string = "You need to enter a postcode";
  addressMessage: string = "You need to tell us the address of the building";
  townCityMessage: string = "You need to tell us the address of the building";


  private isModelValid() {
    this.errors.postcodeHasErrors = false;
    this.errors.addressHasErrors = false;
    this.errors.townCityHasErrors = false;
    if (!FieldValidations.IsNotNullOrWhitespace(this.model.Address)) {
      this.errors.addressHasErrors = true;
    } if (!FieldValidations.IsNotNullOrWhitespace(this.model.Town)) {
      this.errors.townCityHasErrors = true;
    } if (!this.isPostcodeValid()) {
      this.errors.postcodeHasErrors = true;
    }


    this.hasErrors = this.errors.postcodeHasErrors || this.errors.addressHasErrors || this.errors.townCityHasErrors || this.errors.postcode.hasErrors;

    return !this.hasErrors;
  }

  private isPostcodeValid(): boolean {
    let postcode = this.model.Postcode?.replace(' ', '');
    this.errors.postcode.hasErrors = true;
    if (!postcode) {
      this.errors.postcode.errorText = 'You need to enter a postcode';
    } else if (postcode.length < 5) {
      this.errors.postcode.errorText = "You need to enter a full postcode";
    } else if (!PostCodeValidator.isValid(postcode)) {
      this.errors.postcode.errorText = "You need to enter a real postcode";
    } else {
      this.errors.postcode.hasErrors = false;
    }

    return !this.errors.postcode.hasErrors;
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.hasErrors && showError ? errorMessage : undefined;
  }

  addressTypeDescription() {
    return 'This address must be in England or Wales.';
  }

  getTitle() {
    return "Enter the building's address";
  }
}
