import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './what-to-report.component.html'
})

export class WhatToReportComponent extends PageComponent<string> {
  public static route: string = 'what-to-report';
  static title: string = "What do you want to report? – Make a mandatory occurrence report";


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
