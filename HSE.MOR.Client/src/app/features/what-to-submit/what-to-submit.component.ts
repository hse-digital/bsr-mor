import { Component } from '@angular/core';
import { PageComponent } from '../../helpers/page.component';
import { ApplicationService } from "../../services/application.service";
import { FieldValidations } from "../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { NavigationHelper } from '../../helpers/navigation.helper';

@Component({
  templateUrl: './what-to-submit.component.html'
})

export class WhatToSubmitComponent extends PageComponent<string> {
  public static route: string = 'what-to-submit';
  static title: string = "Do you want to submit a notice or a report about an occurrence?";

  override onInit(applicationService: ApplicationService): void {
    this.model = applicationService.model.WhatToSubmit; 
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.WhatToSubmit = this.model;

  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.EmailAddress);
  }

  hasSubmitNoticeReportErrors: boolean = false;
  modelValid: boolean = false;

  isValid(): boolean {
    this.modelValid = !FieldValidations.IsNotNullOrWhitespace(this.model);
    this.hasSubmitNoticeReportErrors = this.modelValid;
    return !this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    let route = NavigationHelper.getRoute(this.model!);
    return this.navigationService.navigateRelative(route, this.activatedRoute);
  }
}
