import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { WhoSubmittedNoticeComponent } from '../who-submitted-notice/who-submitted-notice.component';
import { NavigationHelper } from '../../../helpers/navigation.helper';

@Component({
  templateUrl: './enter-reference.component.html'
})

export class EnterReferenceComponent extends PageComponent<string> {
  public static route: string = 'enter-reference';
  static title: string = "Enter mandatory occurrence notice reference - Submit a mandatory occurrence notice and report";
  caseNumber?: string;


  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {};
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.NoticeReference)) {
      applicationService.model.Report.NoticeReference = "";
    }
    this.model = applicationService.model.Report?.NoticeReference;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    
    var dynamicsIncidentModel = await applicationService.getIncidentByCaseNumber(this.model!);
    if (dynamicsIncidentModel) {
      this.model = dynamicsIncidentModel.CaseNumber;
      applicationService.model.Id = dynamicsIncidentModel.IncidentId;
      applicationService.model.Report!.Id = dynamicsIncidentModel.MorId;
      applicationService.model.CustomerId = dynamicsIncidentModel.CustomerId;
      applicationService.model.MorId = dynamicsIncidentModel.MorId;
    }
    if (FieldValidations.IsNotNullOrWhitespace(this.model)) {
      applicationService.model.Report!.NoticeReference = this.model;
    } else {
      this.processing = false;
      this.modelValid = false;
      this.hasErrors = true;
      this.ErrorMessage = this.ErrorNotExists;
      throw Error;
    }
    
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  navigateToIdentifyBuilding() {
    let route = NavigationHelper.getRoute("report-identify-building");
    this.navigationService.navigate(route);
  }

  modelValid: boolean = false;
  RefFormat = new RegExp('^CAS[0-9]{5}[A-Z0-9]{4}$', 'i'); // i parameter to make case insensitive
  ErrorMessage: string = "";
  ErrorRequired = "You need to enter a notice reference";
  ErrorInvalid = "You need to enter a valid notice reference";
  ErrorNotExists = "Entered notice reference does not exist";

  override isValid(): boolean {
    if (!FieldValidations.IsNotNullOrWhitespace(this.model)) {
      this.modelValid = false;
      this.ErrorMessage = this.ErrorRequired;
    }
    else if (!this.RefFormat.test(this.model!)) {
      this.modelValid = false;
      this.ErrorMessage = this.ErrorInvalid;
    }
    else {
      this.modelValid = true;
    }
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(WhoSubmittedNoticeComponent.route, this.activatedRoute);
  }
}
