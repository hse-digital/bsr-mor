import { Component, Output, EventEmitter, Input, ViewChildren, QueryList, Injector } from '@angular/core';
import { ApplicationService, BuildingInformationDynamicsModel } from 'src/app/services/application.service';
import { AddressModel, AddressResponseModel, AddressService } from 'src/app/services/address.service';
import { AddressSearchMode } from './address.component';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { TitleService } from 'src/app/services/title.service';
import { GetInjector } from '../../helpers/injector.helper';
@Component({
  selector: 'find-address',
  templateUrl: './find-address.component.html'
})
export class FindAddressComponent {

  @Input() searchMode: AddressSearchMode = AddressSearchMode.PostalAddress;
  @Input() searchModel!: { postcode?: string };
  @Input() addressName!: string;
  @Input() selfAddress = false;
  @Output() public onSearchPerformed = new EventEmitter<AddressResponseModel>();

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

  constructor(private addressService: AddressService, private titleService: TitleService) { }

  async findAddress() {
    if (this.isPostcodeValid()) {
      this.loading = true;
      this.searchMode = AddressSearchMode.PostalAddress;
      this.addressResponsePostalAddress = await this.searchAddress();

      this.addressResponsePostalAddress.Results.filter(x => {
        if (x.ParentUPRN != undefined || x.ParentUPRN != null) this.uprnList.push(x.ParentUPRN!);
      });
      this.searchMode = AddressSearchMode.Building;
      this.addressResponseBuilding = await this.searchAddress();
      this.addressResponseBuilding.Results.filter(x => {
        if (x.UPRN != undefined || x.UPRN != null) this.uprnList.push(x.UPRN!);
      });

      this.uprnList = this.uprnList.filter((value, index, array) =>
        index === array.findIndex((findValue) =>
          findValue === value));

      let buildingInformationResponse = await this.applicationService.getBuildigsInformation(this.uprnList);
      if (this.addressResponseBuilding.Results.length > 0) {
        this.onSearchPerformed.emit(this.addressResponseBuilding);
      }
      if (buildingInformationResponse.length > 0) {
        this.mapBuildingInformationToAddressModel(buildingInformationResponse);
        this.onSearchPerformed.emit(this.addressResponseModel);
      } if (buildingInformationResponse.length == 0 && this.addressResponseBuilding.Results.length == 0) {
        var urpnAddress = await this.searchBuildingAddressByUPRN(this.uprnList[0]);
        this.onSearchPerformed.emit(urpnAddress);
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
      this.postcodeErrorText = 'Enter a postcode';
    } else if (postcode.length < 5 || postcode.length > 7) {
      this.postcodeErrorText = "Enter a real postcode, like 'EC3A 8BF'.";
    } else {
      this.postcodeHasErrors = false;
    }

    return !this.postcodeHasErrors;
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.postcodeHasErrors && showError ? errorMessage : undefined;
  }

  private searchBuildingAddressByUPRN(uprn: string): Promise<AddressResponseModel> {
    return this.addressService.SearchBuildingAddressBy_UPRN(uprn);
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
      this.addressModel = {};
      this.addressModel.Address = `${x.bsr_name}, ${x.bsr_addressline1}, ${x.bsr_city}, ${x.bsr_postcode}`;
      this.addressModel.BuildingName = x.bsr_name;
      this.addressModel.Street = x.bsr_addressline1;
      this.addressModel.Town = x.bsr_city;
      this.addressModel.Postcode = x.bsr_postcode;
      this.addressModel.BuildingApplicationId = x.bsr_BuildingApplicationID?.bsr_applicationid;
      this.addressModel.BuildingHeight = x.bsr_sectionheightinmetres ? x.bsr_sectionheightinmetres : 0;
      this.addressModel.NumberOfFloors = x.bsr_nooffloorsabovegroundlevel ? x.bsr_nooffloorsabovegroundlevel : 0;
      this.addressModel.ResidentialUnits = x.bsr_numberofresidentialunits ? x.bsr_numberofresidentialunits : 0;
      this.addressModel.BuildingId = x._bsr_buildingid_value ? x._bsr_buildingid_value : undefined;
      this.addressModel.StructureId = x.bsr_blockid ? x.bsr_blockid : undefined;

      if (x.bsr_BuildingApplicationID?.bsr_papid_account) {
        this.addressModel.AccountablePerson = x.bsr_BuildingApplicationID?.bsr_papid_account.name;
        this.addressModel.ContactId = x.bsr_BuildingApplicationID.bsr_papid_account.accountid;
      } else if (x.bsr_BuildingApplicationID?.bsr_papid_contact) {
        this.addressModel.AccountablePerson = `${x.bsr_BuildingApplicationID?.bsr_papid_contact.firstname} ${x.bsr_BuildingApplicationID?.bsr_papid_contact.lastname}`;
        this.addressModel.ContactId = x.bsr_BuildingApplicationID.bsr_papid_contact.contactid;
      } else {
        this.addressModel.AccountablePerson = undefined;
      }

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
