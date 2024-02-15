import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { LocalStorage } from "src/app/helpers/local-storage";
import { Sanitizer } from "../helpers/sanitizer";
import { FieldValidations } from "../helpers/validators/fieldvalidations";
import { AddressModel } from "./address.service";
import { FileScanResult } from "./file-upload.service";

@Injectable()
export class ApplicationService {
  // replace this any to a specific type
  model: IncidentModel;
  uploadSharepointModel?: UploadSharepointModel;

  constructor(private httpClient: HttpClient) {
    this.model = LocalStorage.getJSON('application_data') ?? {};
  }

  newApplication() {
    LocalStorage.remove('application_data');
    this.model = new IncidentModel();
  }

  updateLocalStorage() {
    LocalStorage.setJSON('application_data', this.model)
  }

  clearApplication() {
    this.model = new IncidentModel();
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
  
  }

  async getBuildigsInformation(postcode: string): Promise<BuildingInformationDynamicsModel[]> {
    return await firstValueFrom(this.httpClient.post<BuildingInformationDynamicsModel[]>(`api/GetBuildingInformationUsingPostcodeAsync`, { "Postcode": postcode } ));
  }
  async getBuildigsDetails(postcode: string): Promise<BuildingDetailsDynamicsModel[]> {
    return await firstValueFrom(this.httpClient.post<BuildingDetailsDynamicsModel[]>(`api/GetBuildingDetailsUsingPostcodeAsync`, { "Postcode": postcode }));
  }
  async getIncidentByCaseNumber(caseNumber: string): Promise<IncidentModelDynamics> {
    return await firstValueFrom(this.httpClient.post<IncidentModelDynamics>(`api/GetIncidentUsingCaseNumberAsync`, { "CaseNumber": caseNumber }));
  }
  async getBuildigsDetailsByBcaReferenceNumber(referenceNumber: string): Promise<BuildingDetailsDynamicsModel[]> {
    return await firstValueFrom(this.httpClient.get<BuildingDetailsDynamicsModel[]>(`api/GetDynamicsBuildingDetailsByBcaReferenceAsync/${referenceNumber}`));
  }
  async getStructureByHrbrNumber(hrbrNumber: string): Promise<StructureDynamicsModel[]> {
    return await firstValueFrom(this.httpClient.get<BuildingDetailsDynamicsModel[]>(`api/GetDynamicsStructureByHrbrNumberAsync/${hrbrNumber}`));
  }
  async triggerFileUploadScanandUpload(scanModel: UploadSharepointModel): Promise<void> {
    await firstValueFrom(this.httpClient.post<UploadSharepointModel>(`api/TriggerFilesToSharePointUpload`, scanModel));
  }
  async createNewMORApplication(): Promise<void> {
    if (!this.model.Id) {
      var returnModel = await firstValueFrom(this.httpClient.post<IncidentModel>('api/NewMORCaseAsync', Sanitizer.sanitize(this.model)));
      this.model.Id = returnModel.Id;
      this.model.CaseNumber = returnModel.CaseNumber;
      this.model.MorId = returnModel.MorId;
      this.model.CustomerId = returnModel.CustomerId;
      this.updateLocalStorage();
    }
  }
  async createNewMORReportApplication(): Promise<void> {
    if (!this.model.Id) {
      if (this.model.WhatToSubmit == "report") {
        this.ifSameUserDetails();
      }
      var returnModel = await firstValueFrom(this.httpClient.post<IncidentModel>('api/NewMORCaseAsync', Sanitizer.sanitize(this.model)));
      this.model.Id = returnModel.Id;
      this.model.CaseNumber = returnModel.CaseNumber;
      this.model.MorId = returnModel.MorId;
      this.model.CustomerId = returnModel.CustomerId;
      this.updateLocalStorage();
      if (FieldValidations.IsNotNullOrWhitespace(this.model.Id) && (this.model.Report?.FilesUploaded && this.model.Report?.FilesUploaded?.length > 0)) {
        this.uploadSharepointModel = {};
        this.uploadSharepointModel.id = this.model.Id;
        this.uploadSharepointModel.ContactId = this.model.CustomerId;
        this.uploadSharepointModel.Email = this.model.EmailAddress;
        this.uploadSharepointModel.FileUploads = this.model.Report.FilesUploaded;
        this.triggerFileUploadScanandUpload(this.uploadSharepointModel);        
      }
    }   
  }
  async updateMORApplication(): Promise<void> {
    if (this.model.WhatToSubmit == "report") {
      this.ifSameUserDetails();
    }
    var returnModel = await firstValueFrom(this.httpClient.put<IncidentModel>('api/UpdateMORCaseAsync', Sanitizer.sanitize(this.model)));
    this.model.Id = returnModel.Id;
    this.model.CaseNumber = returnModel.CaseNumber;
    this.model.MorId = returnModel.MorId;
    this.model.CustomerId = returnModel.CustomerId;
    this.updateLocalStorage();
    if (FieldValidations.IsNotNullOrWhitespace(this.model.Id) && (this.model.Report?.FilesUploaded && this.model.Report?.FilesUploaded?.length > 0)) {
      this.uploadSharepointModel = {};
      this.uploadSharepointModel.id = this.model.Id;
      this.uploadSharepointModel.ContactId = this.model.CustomerId;
      this.uploadSharepointModel.Email = this.model.EmailAddress;
      this.uploadSharepointModel.FileUploads = this.model.Report.FilesUploaded;
      this.triggerFileUploadScanandUpload(this.uploadSharepointModel);
    }
    this.updateLocalStorage();
  }

  async UploadToSharepoint(model?: UploadSharepointModel): Promise<UploadSharepointModel> {
    return await firstValueFrom(this.httpClient.post<UploadSharepointModel>(`api/PushToSharePointAsync`, Sanitizer.sanitize(model)));
  }

  ifSameUserDetails() {
    if (this.model.Report?.SubmittedNotice! == "me") {
      this.model.Report!.FirstName! = this.model.Report!.SameUserDetails?.FirstName!;
      this.model.Report!.LastName! = this.model.Report!.SameUserDetails?.LastName!;
      this.model.Report!.ContactNumber! = this.model.Report!.SameUserDetails?.ContactNumber!;
      this.model.Report!.OrganisationName! = this.model.Report!.SameUserDetails?.OrganisationName!;
      this.model.Report!.OrgRole! = this.model.Report!.SameUserDetails?.OrgRole!;
      this.model.Report!.OrgType! = this.model.Report!.SameUserDetails?.OrgType!;
      this.model.Report!.ActingOrg! = this.model.Report!.SameUserDetails?.ActingOrg!;
      this.model.Report!.ActingOrgRole! = this.model.Report!.SameUserDetails?.ActingOrgRole!;  
      this.model.Report!.ActingOrgType! = this.model.Report!.SameUserDetails?.ActingOrgType!;  
      this.model.Report!.ReportWhenBecomeAware! = this.model.Report!.SameUserDetails?.ReportWhenBecomeAware!;  
    }   
  }
}

export class IncidentModel {
  Id?: string;
  IncidentId?: string;
  Notice?: NoticeModel;
  Report?: ReportModel;
  Building?: BuildingModel;
  EmailAddress?: string;
  WhatToSubmit?: string;
  IsEmailVerified?: boolean;
  CustomerId?: string;
  MorId?: string;
  CaseNumber?: string;
  IsAnswersChecked: boolean = false;
}

export class IncidentModelDynamics {
  Id?: string;
  IncidentId?: string;
  FirstName?: string;
  LastName?: string;
  ContactNumber?: string;
  EmailAddress?: string;
  WhatToSubmit?: string;
  IsEmailVerified?: boolean;
  CustomerId?: string;
  MorId?: string;
  CaseNumber?: string;
  MorModelDynamics?: NoticeModel;
  BuildingModelDynamics?: BuildingModel;
  Address?: AddressModel;
}

export class NoticeModel {
  DescribeRiskIncident?: string;
  WhenBecomeAware?: TimeModel;
  FirstName?: string;
  LastName?: string;
  ContactNumber?: string;
  OrganisationName?: string;
  ActingOrg?: string;
  OrgRole?: string;
  OrgType?: string;
  ActingOrgRole?: string;
  ActingOrgType?: string;
  ActionsToKeepSafe?: string;
  IsReportSubmitted?: boolean;
  CheckAnswersModel?: CheckAnswersNoticeModel;
}

export class ReportModel {
  Id?: string;
  NoticeReference?: string;
  OrgRole?: string;
  OrgType?: string;
  ActingOrgRole?: string;
  ActingOrgType?: string;
  SubmittedNotice?: string;
  FirstName?: string;
  LastName?: string;
  IncidentReported?: string[];
  AboutIncident?: string;
  CauseOfIncident?: string;
  WhoAffectedByIncident?: string;
  IncidentKeepPeopleSafe?: string;
  OccurrenceDiscovered?: string;
  SharedWithOthers?: string;
  OrganisationName?: string;
  ActingOrg?: string;
  ContactNumber?: string;
  FilesUploaded?: FileUploadModel[];
  YourSupportInfo?: string;
  ReportWhenBecomeAware?: TimeModel;
  SameUserDetails?: SameUserModel;
  CheckAnswersModel?: CheckAnswersReportModel
}

export class TimeModel {
  Day?: string;
  Month?: string;
  Year?: string;
  Hour?: string;
  Minute?: string;
}

export class SameUserModel {
  FirstName?: string;
  LastName?: string;
  OrganisationName?: string;
  ActingOrg?: string;
  ContactNumber?: string;
  OrgRole?: string;
  OrgType?: string;
  ActingOrgRole?: string;
  ActingOrgType?: string;
  ReportWhenBecomeAware?: TimeModel;
}

export class BuildingModel {
  SubmittedDesignBca?: string;
  IdentifyBuilding?: string;
  BuildingType?: string;
  Address?: AddressModel;
  BuildingName?: string;
  NumberOfFloors?: string;
  NumberOfUnits?: string;
  NumberOfFloorsProf?: string;
  NumberOfUnitsProf?: string;
  BuildingHeight?: string;
  AddressRegion?: string;
  HasAddress?: string;
  LocateBuilding?: string;
  Easting?: string;
  Northing?: string;
  BcaReference?: string;
  HrbNumber?: string
}


export class CheckAnswersNoticeModel {
  Address?: string;
  YourName?: string;
  Incident?: string;
  ActionsToKeepSafe?: string;
  OccurrenceDateTime?: string;
  ContactDetails?: string;
  IsManualAddress: boolean = false;
  AddressRegion?: string;
  NumberOfFloors?: string;
  NumberOfUnits?: string;
  BuildingHeight?: string;
  BcaReference?: string;
  HrbNumber?: string;
  ContactNumber?: string;
  OrganisationName?: string;
  OrgRole?: string;
  OrgType?: string;
  ActingOrg?: string;
  ActingOrgRole?: string;
  ActingOrgType?: string;
  AboutBuilding?: string;
  CaseNumber?: string;
  WhatToSubmit?: string;
}

export class CheckAnswersReportModel {
  Address?: string;
  YourName?: string;
  NoticeReference?: string;
  OrgRole?: string;
  OrgType?: string;
  ActingOrg?: string;
  ActingOrgRole?: string;
  ActingOrgType?: string;
  SubmittedNotice?: string;
  IncidentReported?: string;
  AboutIncident?: string;
  CauseOfIncident?: string;
  WhoAffectedByIncident?: string;
  IncidentKeepPeopleSafe?: string;
  OccurrenceDiscovered?: string;
  SharedWithOthers?: string;
  OrganisationName?: string;
  ContactNumber?: string;
  ContactDetails?: string;
  IsManualAddress: boolean = false;
  AddressRegion?: string;
  NumberOfFloors?: string;
  NumberOfUnits?: string;
  BuildingHeight?: string;
  BcaReference?: string;
  HrbNumber?: string;
  UploadedFileNames?: string;
  AboutBuilding?: string;
  BuildingType?: string;
  IdentiyBuilding?: string;
  WhatToSubmit?: string;
  OccurrenceDateTime?: string;
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
  _bsr_bcapplicationid_value?: string;
  bsr_blockid?: string;

}

export class StructureDynamicsModel {
  bsr_blockid?: string;
  bsr_name?: string;
  bsr_addressline1?: string;
  bsr_addressline2?: string;
  bsr_city?: string;
  bsr_postcode?: string;
  _bsr_buildingapplicationid_value?: string;
}

export class FileUploadModel {
  Progress: number = 0;
  FileName?: string;
  Status?: string;
  Message?: string;
  CaseId?: string;
  SASUri?: string;
  TaskId?: string;
  isProcessing?: boolean;
  isRemoved?: boolean;
  Subscription?: any;
  FileScanResult?: FileScanResult;
  isScanning?: boolean;
}

export class UploadSharepointModel {
  id?: string;
  ContactId?: string;
  Email?: string;
  FileUploads?: FileUploadModel[];
}

