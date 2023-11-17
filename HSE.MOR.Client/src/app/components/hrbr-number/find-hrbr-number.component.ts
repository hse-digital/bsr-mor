import { Component, Output, EventEmitter, Input, ViewChildren, OnInit, QueryList, Injector } from '@angular/core';
import { ApplicationService, StructureDynamicsModel } from 'src/app/services/application.service';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { TitleService } from 'src/app/services/title.service';
import { GetInjector } from '../../helpers/injector.helper';
import { AddressModel, AddressResponseModel, AddressType } from '../../services/address.service';
import { HrbNumberValidator } from '../../helpers/validators/hrb-number-validator';
@Component({
  selector: 'find-hrbr-number',
  templateUrl: './find-hrbr-number.component.html'
})
export class FindHrbrNumberComponent {

  @Input() searchModel!: { hrbrNumber?: string };
  @Input() addressName!: string;
  @Input() selfAddress = false;

  @Output() public onSearchPerformed = new EventEmitter<AddressResponseModel>();

  hrbrNumberHasErrors: boolean = false;
  hrbrNumberErrorText: string = '';
  loading = false;
  addressResponseModel: AddressResponseModel = new AddressResponseModel();
  addressModel?: AddressModel;

  private injector: Injector = GetInjector();
  private applicationService: ApplicationService = this.injector.get(ApplicationService);

  @ViewChildren("summaryError") summaryError?: QueryList<GovukErrorSummaryComponent>;

  ngOnInit(): void {
    this.searchModel = { hrbrNumber: this.applicationService.model.Building?.Address?.HrbNumber }
  }

  constructor(private titleService: TitleService) { }

  async findAddress() {
    if (!this.isReferenceNumberHasErrors()) {
      this.loading = true;
      let buildingDetailsResponse = await this.applicationService.getStructureByHrbrNumber(this.searchModel.hrbrNumber!);
      if (buildingDetailsResponse.length > 0) {
        this.mapStructureToAddressModel(buildingDetailsResponse);
        this.onSearchPerformed.emit(this.addressResponseModel);
      } else {
        this.onSearchPerformed.emit(new AddressResponseModel());
      }
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    }
  }

  isReferenceNumberHasErrors(): boolean {
    let hrbrNumber = this.searchModel.hrbrNumber?.replace(' ', '');
    this.hrbrNumberHasErrors = false;
    if (!hrbrNumber) {
      this.hrbrNumberErrorText = 'You need to enter a building registration number';
      this.hrbrNumberHasErrors = true;
      return this.hrbrNumberHasErrors;
    } if (!HrbNumberValidator.isValid(hrbrNumber ?? '')) {
      this.hrbrNumberErrorText = 'You need to enter a valid building registration number';
      this.hrbrNumberHasErrors = true;
      return this.hrbrNumberHasErrors;
    } if (hrbrNumber!.length < 5 || hrbrNumber!.length > 12) {
      this.hrbrNumberErrorText = "You need to enter a valid building registration number";
      this.hrbrNumberHasErrors = true;
      return this.hrbrNumberHasErrors;
    } 

    return this.hrbrNumberHasErrors;
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.hrbrNumberHasErrors && showError ? errorMessage : undefined;
  }

  mapStructureToAddressModel(structureModelArray: StructureDynamicsModel[]) {
    structureModelArray.forEach(x => {
      this.addressModel = { BuildingAddressType: AddressType.HRBNumber };
      this.addressModel.Address = `${x.bsr_name}, ${x.bsr_addressline1}, ${x.bsr_city}, ${x.bsr_postcode}`;
      this.addressModel.BuildingName = x.bsr_name;
      this.addressModel.Street = x.bsr_addressline1;
      this.addressModel.Town = x.bsr_city;
      this.addressModel.Postcode = x.bsr_postcode;
      this.addressModel.HrbApplicationId = x._bsr_buildingapplicationid_value;
      this.addressModel.HrbNumber = this.searchModel.hrbrNumber;

      this.addressResponseModel.Results.push(this.addressModel);
    });

    this.addressResponseModel.TotalResults = structureModelArray.length;
  }

}
