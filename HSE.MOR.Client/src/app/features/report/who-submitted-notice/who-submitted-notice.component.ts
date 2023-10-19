import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from '../../../helpers/page.component';
import { FieldValidations } from '../../../helpers/validators/fieldvalidations';
import { ApplicationService } from '../../../services/application.service';

@Component({
  templateUrl: './who-submitted-notice.component.html'
})

export class WhoSubmittedNoticeComponent extends PageComponent<string> {
  public static route: string = 'who-submitted-notice';
  static title: string = "Who submitted the notice?";

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {}
    }

    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report.SubmittedNotice)) {
      applicationService.model.Report.SubmittedNotice = "";
    }

    this.model = applicationService.model.Report?.SubmittedNotice;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Report!.SubmittedNotice = this.model;
  }
  canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  hasSubmittedNoticeErrors: boolean = false;
  modelValid: boolean = false;

  isValid(): boolean {
    this.modelValid = !FieldValidations.IsNotNullOrWhitespace(this.model);
    this.hasSubmittedNoticeErrors = this.modelValid;
    return !this.modelValid;
  }
  navigateNext(): Promise<boolean> {
    return this.navigationService.navigate('');
  }

}