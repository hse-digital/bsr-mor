import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { NavigationHelper } from '../../../helpers/navigation.helper';
import { PageComponent } from '../../../helpers/page.component';
import { FieldValidations } from '../../../helpers/validators/fieldvalidations';
import { ApplicationService } from '../../../services/application.service';

@Component({
  templateUrl: './report-confirmation.component.html'
})

export class ReportConfirmationComponent extends PageComponent<string> {
  public static route: string = 'confirmation';
  static title: string = "Confirmation - Submit a mandatory occurrence notice and report";
  morReference?: string;

  override onInit(applicationService: ApplicationService): void {
    if (applicationService.model.Report?.NoticeReference == '') {
      this.morReference = applicationService.model.CaseNumber ?? "";
    } else {
      this.morReference = applicationService.model.Report?.NoticeReference;
    }
    applicationService.model.IsAnswersChecked = true;
    applicationService.updateApplication();
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {

  }

  navigateToSummary() {
    let route = NavigationHelper.getRoute("report-summary");
    this.navigationService.navigate(route);
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }
  modelValid: boolean = false;
  override isValid(): boolean {
    return true;
  }
  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigate('');
  }
}

