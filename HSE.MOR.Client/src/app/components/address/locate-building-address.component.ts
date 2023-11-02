import { Component, Input, Output, EventEmitter, QueryList, ViewChildren, Injector, OnInit } from '@angular/core';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { ApplicationService } from 'src/app/services/application.service';
import { GetInjector } from '../../helpers/injector.helper';
import { FieldValidations } from '../../helpers/validators/fieldvalidations';
import { AddressModel, AddressResponseModel, AddressType } from '../../services/address.service';
import { TitleService } from '../../services/title.service';

@Component({
  selector: 'locate-building-address',
  templateUrl: './locate-building-address.component.html'
})
export class LocateBuildingAddressComponent implements OnInit {

  hasLocateBuildingErrors = false;
  @Input() addressName!: string;
  @Input() selfAddress = false;
  @Input() model!: string
  @Output() onLocateBuildingAddress = new EventEmitter<string>();

  @ViewChildren("summaryError") summaryError?: QueryList<GovukErrorSummaryComponent>;

  private injector: Injector = GetInjector();
  private applicationService: ApplicationService = this.injector.get(ApplicationService);

  constructor(private titleService: TitleService) { }

  ngOnInit(): void {
    if (!this.applicationService.model.Building) {
      this.applicationService.model.Building = {}
    }
    if (!this.applicationService.model.Building.Address) {
      this.applicationService.model.Building.Address = { IsManual: false };
    }
    this.applicationService.model.Building.Address.BuildingAddressType = AddressType.AboutBuilding;
    this.applicationService.model.Building.Address.IsManual = false;
    if (!this.applicationService.model.Building.LocateBuilding) {
      this.applicationService.model.Building.LocateBuilding = "";
    }

    this.model = this.applicationService.model.Building?.LocateBuilding;
  }

  errorMessage: string = 'You need to tell us if the building has an address';

  continue() {
    this.hasLocateBuildingErrors = !this.isValid();
    if (this.isValid()) {
      this.applicationService.model.Building!.LocateBuilding = this.model;
      this.onLocateBuildingAddress.emit(this.model);
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    }
  }

  isValid(): boolean {
    this.hasLocateBuildingErrors = true;
    let locateAddress = this.model;

    if (!FieldValidations.IsNotNullOrWhitespace(locateAddress)) {
      this.errorMessage = 'You need to tell us how to find your building';
    } else if (locateAddress.length! > 500) {
      this.errorMessage = 'You need to tell us how to find your building using fewer words';
    }  else {
      this.hasLocateBuildingErrors = false;
    }

    return !this.hasLocateBuildingErrors;
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.hasLocateBuildingErrors && showError ? errorMessage : undefined;
  }
}
