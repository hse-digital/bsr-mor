import { Component, Output, EventEmitter, Input, ViewChildren, QueryList, Injector, OnInit } from '@angular/core';
import { ApplicationService, BuildingDetailsDynamicsModel } from 'src/app/services/application.service';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { TitleService } from 'src/app/services/title.service';
import { GetInjector } from '../../helpers/injector.helper';
import { AddressModel, AddressResponseModel, AddressType } from '../../services/address.service';
@Component({
  selector: 'find-bca-reference',
  templateUrl: './find-bca-reference.component.html'
})
export class FindBcaReferenceComponent {

  @Input() searchModel!: { referenceNumber?: string };
  @Input() addressName!: string;
  @Input() selfAddress = false;

  @Output() public onSearchPerformed = new EventEmitter<AddressResponseModel>();

  referenceNumberHasErrors: boolean = false;
  referenceNumberErrorText: string = '';
  loading = false;
  addressResponseModel: AddressResponseModel = new AddressResponseModel();
  addressModel?: AddressModel;

  private injector: Injector = GetInjector();
  private applicationService: ApplicationService = this.injector.get(ApplicationService);

  @ViewChildren("summaryError") summaryError?: QueryList<GovukErrorSummaryComponent>;

  ngOnInit(): void {
    this.searchModel = { referenceNumber: this.applicationService.model.Building?.Address?.BcaReference }
  }

  constructor( private titleService: TitleService) { }

  async findAddress() {
    if (this.isReferenceNumberValid()) {
      this.loading = true;
      let buildingDetailsResponse = await this.applicationService.getBuildigsDetailsByBcaReferenceNumber(this.searchModel.referenceNumber!);
      if (buildingDetailsResponse.length > 0) {
        this.mapBuildingDetailsToAddressModel(buildingDetailsResponse);
        this.onSearchPerformed.emit(this.addressResponseModel);
      } else {
        this.onSearchPerformed.emit(new AddressResponseModel());
      }
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    }
  }

  isReferenceNumberValid(): boolean {
    let referenceNumber = this.searchModel.referenceNumber?.replace(' ', '');
    this.referenceNumberHasErrors = true;
    if (!referenceNumber) {
      this.referenceNumberErrorText = "Enter a reference number";
    } else if (referenceNumber.length < 5 || referenceNumber.length > 12) {
      this.referenceNumberErrorText = "Enter a reference number, like 'BCA01001P1Z1'";
    } else {
      this.referenceNumberHasErrors = false;
    }

    return !this.referenceNumberHasErrors;
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.referenceNumberHasErrors && showError ? errorMessage : undefined;
  }

  mapBuildingDetailsToAddressModel(buildingDetailsModelArray: BuildingDetailsDynamicsModel[]) {
    buildingDetailsModelArray.forEach(x => {
      this.addressModel = { BuildingAddressType: AddressType.BCAReference };
      this.addressModel.Address = `${x.bsr_name}, ${x.bsr_address1_line1}, ${x.bsr_address1_city}, ${x.bsr_address1_postalcode}`;
      this.addressModel.BuildingName = x.bsr_name;
      this.addressModel.Street = x.bsr_address1_line1;
      this.addressModel.Town = x.bsr_address1_city;
      this.addressModel.Postcode = x.bsr_address1_postalcode;
      this.addressModel.BcaReference = this.searchModel.referenceNumber;

      this.addressResponseModel.Results.push(this.addressModel);
    });

    this.addressResponseModel.TotalResults = buildingDetailsModelArray.length;
  }

}
