import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { LocalStorage } from "src/app/helpers/local-storage";

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

    if (this.model.id) {
      await firstValueFrom(this.httpClient.put(`api/UpdateApplication/${this.model.id}`, this.model));
    }
  }
}

export class MORModel {
  id?: string;
  Notice?: NoticeModel;
  Report?: ReportModel;
  Building?: BuildingModel;  
}

export class NoticeModel {
  DescribeRiskIncident?: string;
  WhenBecomeAware?: TimeModel;
}

export class ReportModel {
  NoticeReference?: string;
  WhatToReport?: string;
}

export class TimeModel {
  Day?: number;
  Month?: number;
  Year?: number;
  Hour?: number;
  Minute?: number;
}
}

export class BuildingModel {
  SubmittedDesignBca?: string;
  IdentifyBuilding?: string;
}
