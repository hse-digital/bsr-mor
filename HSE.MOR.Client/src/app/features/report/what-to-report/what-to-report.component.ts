import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { TypeIncidentReportedComponent } from '../type-incident-reported/type-incident-reported.component';
import { TypeRiskReportedComponent } from '../type-risk-reported/type-risk-reported.component';

@Component({
  templateUrl: './what-to-report.component.html'
})

export class WhatToReportComponent extends PageComponent<string> {
  public static route: string = 'what-to-report';
  static title: string = "What do you want to report? – Make a mandatory occurrence report";


  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {};
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.WhatToReport)) {
      applicationService.model.Report.WhatToReport = "";
    }
    this.model = applicationService.model.Report?.WhatToReport;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Report!.WhatToReport = this.model;
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
      return this.navigationService.navigateRelative(TypeIncidentReportedComponent.route, this.activatedRoute);
    }
    else {
      return this.navigationService.navigateRelative(TypeRiskReportedComponent.route, this.activatedRoute);
    }
  }
}
