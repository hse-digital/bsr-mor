import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from '../../../helpers/page.component';
import { FieldValidations } from '../../../helpers/validators/fieldvalidations';
import { ApplicationService } from '../../../services/application.service';
import { EnterReferenceComponent } from '../enter-reference/enter-reference.component';

@Component({
  templateUrl: './report-submitted.component.html'
})
export class ReportSubmittedComponent extends PageComponent<string>  {
  public static route: string = "report-submitted";
  static title: string = "Only certain duty holders can submit a mandatory occurrence report - Submit a mandatory occurrence notice and report";

  override onInit(applicationService: ApplicationService): void {
    this.model = applicationService.model.CaseNumber;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {

  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.CaseNumber);
  }
  override isValid(): boolean {
    return true;
  }

  navigateToEnterReference() {
    this.navigationService.navigateRelative(EnterReferenceComponent.route, this.activatedRoute);
  }
  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigate('');
  }

}
