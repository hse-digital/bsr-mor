import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { LocalStorage } from "src/app/helpers/local-storage";

@Injectable()
export class ApplicationService {
  // replace this any to a specific type
  model: ReportModel;

  constructor(private httpClient: HttpClient) {
    this.model = LocalStorage.getJSON('application_data') ?? {};
  }

  newApplication() {
    LocalStorage.remove('application_data');
    this.model = new ReportModel();
  }

  updateLocalStorage() {
    LocalStorage.setJSON('application_data', this.model)
  }

  clearApplication() {
    this.model = new ReportModel();
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

    if (this.model.id) {
      await firstValueFrom(this.httpClient.put(`api/UpdateApplication/${this.model.id}`, this.model));
    }
  }
}

/*
export class ContactRequestModel {
  id?: string;
  Reason?: string;
  ReasonOther?: string;
  RequestType?: string;
  WhoAreYou?: string;
  WhoAreYouOther?: string;
  Complaint: ComplaintModel = {};
  Advice: AdviceModel = {};
}

export class ComplaintModel {
  NumberOfFloors?: string;
  NumberOfUnits?: string;
  FirstName?: string;
  LastName?: string
}
export class AdviceModel {
  NumberOfFloors?: number;
  NumberOfUnits?: number;
  BuildingHeight?: number;
  FirstName?: string;
  LastName?: string
}
*/
export class ReportModel {
  id?: string;
  NoticeReference?: string;
  WhatToReport?: string;
}
