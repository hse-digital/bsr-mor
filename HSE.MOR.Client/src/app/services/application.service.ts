import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { LocalStorage } from "src/app/helpers/local-storage";
import { AddressModel } from "./address.service";

@Injectable()
export class ApplicationService {
  // replace this any to a specific type
  model: MORModel;

  constructor(private httpClient: HttpClient) {
    this.model = LocalStorage.getJSON('application_data') ?? {};
  }

  newApplication() {
    LocalStorage.remove('application_data');
    this.model = new MORModel();
  }

  updateLocalStorage() {
    LocalStorage.setJSON('application_data', this.model)
  }

  clearApplication() {
    this.model = new MORModel();
    this.updateLocalStorage();
  }

  async sendVerificationEmail(emailAddress: string): Promise<void> {
    await firstValueFrom(this.httpClient.post('api/SendVerificationEmail', { "EmailAddress": emailAddress }));
  }

  async validateOTPToken(otpToken: string, emailAddress: string): Promise<void> {
    await firstValueFrom(this.httpClient.post('api/ValidateOTPToken', {
      "OTPToken": otpToken,
      "EmailAddress": emailAddress
    }));
  }

  async updateApplication(): Promise<void> {
    this.updateLocalStorage();

    if (this.model.Id) {
      await firstValueFrom(this.httpClient.put(`api/UpdateApplication/${this.model.Id}`, this.model));
    }
  }

  async getBuildigsInformation(postcode: string): Promise<BuildingInformationDynamicsModel[]> {
    return await firstValueFrom(this.httpClient.post<BuildingInformationDynamicsModel[]>(`api/GetBuildingInformationUsingPostcodeAsync`, { "Postcode": postcode } ));
  }
  async getBuildigsDetails(postcode: string): Promise<BuildingDetailsDynamicsModel[]> {
    return await firstValueFrom(this.httpClient.post<BuildingDetailsDynamicsModel[]>(`api/GetBuildingDetailsUsingPostcodeAsync`, { "Postcode": postcode }));
  }
  async getBuildigsDetailsByBcaReferenceNumber(referenceNumber: string): Promise<BuildingDetailsDynamicsModel[]> {
    return await firstValueFrom(this.httpClient.get<BuildingDetailsDynamicsModel[]>(`api/GetDynamicsBuildingDetailsByBcaReferenceAsync/${referenceNumber}`));
  }
  async getStructureByHrbrNumber(hrbrNumber: string): Promise<StructureDynamicsModel[]> {
    return await firstValueFrom(this.httpClient.get<BuildingDetailsDynamicsModel[]>(`api/GetDynamicsStructureByHrbrNumberAsync/${hrbrNumber}`));
  }
}

export class MORModel {
  Id?: string;
  Notice?: NoticeModel;
  Report?: ReportModel;
  Building?: BuildingModel;
  FilesUploaded: FileUploadModel[] = [];
  EmailAddress?: string;
  WhatToSubmit?: string;
  IsEmailVerified?: boolean;
}

export class NoticeModel {
  DescribeRiskIncident?: string;
  WhenBecomeAware?: TimeModel;
  FirstName?: string;
  LastName?: string;
  OrgRole?: string;
  OrgRoleOther?: string;
}

export class ReportModel {
  NoticeReference?: string;
  OrgRole?: string;
  OrgRoleOther?: string;
  WhatToReport?: string;
  SubmittedNotice?: string;
  FirstName?: string;
  LastName?: string;
  IncidentReported?: string[];
  RiskReported?: string[];
  AboutRisk?: string;
  AboutIncident?: string;
  CauseOfRisk?: string;
  CauseOfIncident?: string;
  WhoAffectedByIncident?: string;
  WhoAffectedByRisk?: string;
  RiskKeepPeopleSafe?: string;
  IncidentKeepPeopleSafe?: string;
  OrganisationFindOut?: string;
  OccurrenceDiscovered?: string;
}

export class TimeModel {
  Day?: number;
  Month?: number;
  Year?: number;
  Hour?: number;
  Minute?: number;
}

export class BuildingModel {
  SubmittedDesignBca?: string;
  IdentifyBuilding?: string;
  BuildingType?: string;
  Address?: AddressModel;
  BuildingName?: string;
  NumberOfFloors?: string;
  NumberOfUnits?: string;
  NumberOfFloorsProf?: number;
  NumberOfUnitsProf?: number;
  BuildingHeight?: number;
  AddressRegion?: string;
  HasAddress?: string;
  LocateBuilding?: string;
  Easting?: string;
  Northing?: string;
  BcaReference?: string;
}

export class BuildingsInformationResponse {
  BuildingsInformation: BuildingInformationDynamicsModel[] = []
}

export class BuildingsDetailsResponse {
  BuildingsInformation: BuildingDetailsDynamicsModel[] = []
}

export class BuildingInformationDynamicsModel {
  bsr_uprn?: string;
  bsr_usrn?: string;
  bsr_name?: string;
  bsr_addressline1?: string;
  bsr_city?: string;
  bsr_postcode?: string;
  _bsr_buildingid_value?: string;
  bsr_blockid?: string;

}

export class BuildingDetailsDynamicsModel {
  bsr_address1_line1?: string;
  bsr_address1_postalcode?: string;
  bsr_name?: string;
  bsr_address1_city?: string;
  bsr_address1_line2?: string;

}

export class StructureDynamicsModel {
  bsr_blockid?: string;
  bsr_name?: string;
  bsr_addressline1?: string;
  bsr_addressline2?: string;
  bsr_city?: string;
  bsr_postcode?: string;
}

export class FileUploadModel {
  Progress: number = 0;
  FileName?: string;
  Status?: string;
  Message?: string;
  CaseId?: string;
}

