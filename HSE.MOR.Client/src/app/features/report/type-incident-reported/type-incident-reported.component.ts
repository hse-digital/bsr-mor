import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './type-incident-reported.component.html'
})

export class TypeIncidentReportedComponent extends PageComponent<string> {
  public static route: string = 'type-incident-reported';
  static title: string = "What type of incident are you reporting?";


  override onInit(applicationService: ApplicationService): void {
    this.model = applicationService.model.WhatToReport;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.WhatToReport = this.model;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  modelValid: boolean = false;
  ErrorMessage: string = "You need to tell us if it's an incident or a risk of an incident";

  override isValid(): boolean {
    this.modelValid = FieldValidations.IsNotNullOrWhitespace(this.model);
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    if (this.model == "incident") {
      return this.navigationService.navigate('');
    }
    else {
      return this.navigationService.navigate('');
    }
  }
}
