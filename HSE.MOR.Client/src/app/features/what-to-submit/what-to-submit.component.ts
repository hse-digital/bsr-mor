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
  static title: string = "Do you want to submit a notice or a report about an occurrence? - Submit a mandatory occurrence notice and report";
  isNoticeReference: boolean = false;

  override onInit(applicationService: ApplicationService): void {   
    this.model = applicationService.model.WhatToSubmit;
    this.isNoticeReference = applicationService.model.Report?.NoticeReference ? true : false;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {   
    applicationService.model.WhatToSubmit = this.model;
    if (applicationService.model.Report?.NoticeReference && this.model == "notice") {
      applicationService.model.Id = undefined;
      applicationService.model.Report = undefined;
      applicationService.model.Notice = undefined;
      applicationService.model.Building = undefined;

    } else if (applicationService.model.Report?.NoticeReference && this.model == "report") {
      applicationService.model.Notice = undefined;
    } else if (this.model == "report") {
      applicationService.model.Notice = undefined;
      applicationService.model.Building = undefined;
    } else {
      applicationService.model.Report = undefined;
      applicationService.model.Building = undefined;
    }
    
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return applicationService.model.IsEmailVerified!;
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
