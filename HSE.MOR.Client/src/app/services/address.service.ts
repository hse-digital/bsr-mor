import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private httpClient: HttpClient) { }

  async SearchBuildingByPostcode(postcode: string): Promise<AddressResponseModel> {
    return await firstValueFrom(this.httpClient.get<AddressResponseModel>(`api/SearchBuildingByPostcode/${postcode}`));
  }

  async SearchPostalAddress_LPI_ByPostcode(postcode: string): Promise<AddressResponseModel> {
    return await firstValueFrom(this.httpClient.get<AddressResponseModel>(`api/SearchPostalAddress_LPI_ByPostcode/${postcode}`));
  }

  async SearchAddress(query: string): Promise<AddressResponseModel> {
    return await firstValueFrom(this.httpClient.get<AddressResponseModel>(`api/SearchAddress/${query}`));
  }

  async SearchBuildingAddressBy_UPRN(uprn: string): Promise<AddressResponseModel> {
    return await firstValueFrom(this.httpClient.get<AddressResponseModel>(`api/SearchBuildingAddressByUPRN/${uprn}`));
  }
}

export class AddressResponseModel {
  Offset!: number;
  MaxResults!: number;
  TotalResults!: number;
  Results: AddressModel[] = [];
}

export class AddressModel {
  IsManual?: boolean;
  UPRN?: string;
  ParentUPRN?: string;
  USRN?: string;
  Address?: string;
  AddressLineTwo?: string;
  BuildingName?: string;
  Number?: string;
  Street?: string;
  Town?: string;
  AdministrativeArea?: string;
  Postcode?: string;
  BuildingApplicationId?: string;
  AccountablePerson?: string;
  NumberOfFloors?: number;
  BuildingHeight?: number;
  ResidentialUnits?: number;
  BuildingId?: string;
  StructureId?: string;
  ContactId?: string;
}

