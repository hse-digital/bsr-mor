import { Component, Output, EventEmitter, Input, ViewChildren, OnInit, QueryList, Injector } from '@angular/core';
import { ApplicationService, BuildingDetailsDynamicsModel, BuildingInformationDynamicsModel } from 'src/app/services/application.service';
import { AddressModel, AddressResponseModel, AddressService, AddressType } from 'src/app/services/address.service';
import { AddressSearchMode } from './address.component';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { TitleService } from 'src/app/services/title.service';
import { GetInjector } from '../../helpers/injector.helper';
import { PostCodeValidator } from '../../helpers/validators/postcode-validator';
@Component({
  selector: 'find-address',
  templateUrl: './find-address.component.html'
})
export class FindAddressComponent {

  @Input() searchMode: AddressSearchMode = AddressSearchMode.Building;
  @Input() searchModel!: { postcode?: string };
  @Input() addressName!: string;
  @Input() selfAddress = false;
  @Output() public onSearchPerformed = new EventEmitter<AddressResponseModel>();
  @Output() onEnterManualAddress = new EventEmitter();

  postcodeHasErrors: boolean = false;
  postcodeErrorText: string = '';
  uprnList: string[] = [];
  loading = false;
  addressResponseModel: AddressResponseModel = new AddressResponseModel();
  addressModel?: AddressModel;
  addressResponseBuilding?: AddressResponseModel;
  addressResponsePostalAddress?: AddressResponseModel;

  private injector: Injector = GetInjector();
  private applicationService: ApplicationService = this.injector.get(ApplicationService);

  @ViewChildren("summaryError") summaryError?: QueryList<GovukErrorSummaryComponent>;

  ngOnInit(): void {
    this.searchModel = { postcode: this.applicationService.model.Building?.Address?.CapturedPostcode }
  }

  constructor(private addressService: AddressService, private titleService: TitleService) { }

  async findAddress() {
    if (this.isPostcodeValid()) {
      this.loading = true;     
      let buildingInformationResponse = await this.applicationService.getBuildigsInformation(this.searchModel.postcode!);    
      if (buildingInformationResponse.length > 0) {
        this.mapBuildingInformationToAddressModel(buildingInformationResponse);
        this.onSearchPerformed.emit(this.addressResponseModel);
      } else {
        let buildingDetailsResponse = await this.applicationService.getBuildigsDetails(this.searchModel.postcode!);
        if (buildingDetailsResponse.length > 0) {
          this.mapBuildingDetailsToAddressModel(buildingDetailsResponse);
          this.onSearchPerformed.emit(this.addressResponseModel);
        } else {
          this.addressResponseBuilding = await this.searchAddress();
          if (this.addressResponseBuilding?.Results.length > 0) {
            this.removePostcodeSpaces(this.addressResponseBuilding);
            this.onSearchPerformed.emit(this.addressResponseBuilding);
          } else {
            this.onSearchPerformed.emit(new AddressResponseModel());
          }
        }       
      } 
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    }
  }

  isPostcodeValid(): boolean {
    let postcode = this.searchModel.postcode?.replace(' ', '');
    this.postcodeHasErrors = true;
    if (!postcode) {
      this.postcodeErrorText = "Postcode cannot be empty. Please enter a full UK postcode, such as 'LS1 4AP'";
    } else if (postcode.length < 5 ) {
      this.postcodeErrorText = "Postcode provided is too short. Please enter a full UK postcode, such as 'LS1 4AP'";
    } else if (postcode.length > 7) {
      this.postcodeErrorText = "Postcode provided is too long. Please enter a full UK postcode, such as 'LS1 4AP'";
    } else if (!PostCodeValidator.isValid(postcode!)) {
      this.postcodeErrorText = "Postcode provided is not in the correct format. Please enter a full UK postcode using only letters and numbers, such as 'LS1 4AP'";
    }
    else {
      this.postcodeHasErrors = false;
    }

    return !this.postcodeHasErrors;
  }

  removePostcodeSpaces(addressResponseBuilding: AddressResponseModel) {
    addressResponseBuilding.Results.forEach(x => {
      let postcode = x.Postcode;
      x.CapturedPostcode = x.Postcode;
      x.Postcode = x.Postcode?.replace(' ', '');
      x.Address = x.Address?.replace(postcode!, x.Postcode!);
    });    
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.postcodeHasErrors && showError ? errorMessage : undefined;
  }

  private searchAddress(): Promise<AddressResponseModel> {
    switch (this.searchMode) {
      case AddressSearchMode.Building:
        return this.addressService.SearchBuildingByPostcode(this.searchModel.postcode!);
      case AddressSearchMode.PostalAddress:
        return this.addressService.SearchPostalAddress_LPI_ByPostcode(this.searchModel.postcode!);
    }
  }

  mapBuildingInformationToAddressModel(buildingInformationModelArray: BuildingInformationDynamicsModel[]) {
    buildingInformationModelArray.forEach(x => {
      this.addressModel = { BuildingAddressType: AddressType.PostcodeSearch };
      this.addressModel.Address = `${x.bsr_name}, ${x.bsr_addressline1}, ${x.bsr_city}, ${x.bsr_postcode?.replace(' ', '') }`;
      this.addressModel.BuildingName = x.bsr_name;
      this.addressModel.Street = x.bsr_addressline1;
      this.addressModel.Town = x.bsr_city;
      this.addressModel.Postcode = x.bsr_postcode;
      this.addressModel.BuildingId = x._bsr_buildingid_value ? x._bsr_buildingid_value : undefined;
      this.addressModel.StructureId = x.bsr_blockid ? x.bsr_blockid : undefined;
      this.addressModel.CapturedPostcode = x.bsr_postcode;

      this.addressResponseModel.Results.push(this.addressModel);
    });

    this.addressResponseModel.TotalResults = buildingInformationModelArray.length;
  }

  mapBuildingDetailsToAddressModel(buildingInformationModelArray: BuildingDetailsDynamicsModel[]) {
    buildingInformationModelArray.forEach(x => {
      this.addressModel = { BuildingAddressType: AddressType.PostcodeSearch };
      this.addressModel.Address = `${x.bsr_name}, ${x.bsr_address1_line1}, ${x.bsr_address1_city}, ${x.bsr_address1_postalcode?.replace(' ', '') }`;
      this.addressModel.BuildingName = x.bsr_name;
      this.addressModel.Street = x.bsr_address1_line1;
      this.addressModel.Town = x.bsr_address1_city;
      this.addressModel.Postcode = x.bsr_address1_postalcode?.replace(' ', '');
      this.addressModel.CapturedPostcode = x.bsr_address1_postalcode;
      this.addressResponseModel.Results.push(this.addressModel);
    });

    this.addressResponseModel.TotalResults = buildingInformationModelArray.length;
  }

  addressTypeDescription() {
    if (this.searchMode == AddressSearchMode.Building) {
      return 'This address must be in England.';
    }

    return 'This address must be in England.';
  }

}
