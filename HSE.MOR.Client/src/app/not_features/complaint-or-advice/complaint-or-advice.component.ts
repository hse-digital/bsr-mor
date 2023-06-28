import { Component } from '@angular/core';
import { PageComponent } from '../../helpers/page.component';
import { AdviceModel, ApplicationService, ComplaintModel } from "../../services/application.service";
import { FieldValidations } from "../../helpers/validators/fieldvalidations";
import { ActivatedRouteSnapshot } from "@angular/router";
import { request } from 'express';

@Component({
  templateUrl: './complaint-or-advice.component.html'
})

export class ComplaintOrAdviceComponent extends PageComponent<string> {
  public static route: string = 'complaint-or-advice';
  static title: string = "How can the Building Safety Regulator help you?";

  override onInit(applicationService: ApplicationService): void {
    this.model = applicationService.model.RequestType;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.RequestType = this.model;
    this.initModel(applicationService, this.model);
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.Reason)
      || FieldValidations.IsNotNullOrWhitespace(applicationService.model.ReasonOther);
  }

  modelValid: boolean = false;
  override isValid(): boolean {
    this.modelValid = !FieldValidations.IsNotNullOrWhitespace(this.model);
    return !this.modelValid;
  }
  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigate('who-are-you');
  }

  initModel(applicationService: ApplicationService, requestType?: string) {
    if (requestType == "complaint") {
      applicationService.model.Complaint = new ComplaintModel();
    } else {
      applicationService.model.Advice = new AdviceModel();
    }
  }
}
