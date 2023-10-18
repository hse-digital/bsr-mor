import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { WhenBecomeAwareComponent } from '../when-become-aware/when-become-aware.component';

@Component({
  selector: 'hse-briefly-describe-risk-incident',
  templateUrl: './briefly-describe-risk-incident.component.html'
})
export class BrieflyDescribeRiskIncidentComponent extends PageComponent<string>  {
  public static route: string = 'briefly-describe-risk-incident';
  static title: string = "";

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Notice) {
      applicationService.model.Notice = {}
    }

    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice.DescribeRiskIncident)) {
      applicationService.model.Notice.DescribeRiskIncident = "";
    }

    this.model = applicationService.model.Notice?.DescribeRiskIncident;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Notice!.DescribeRiskIncident = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice?.FirstName) && FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice?.LastName)
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(WhenBecomeAwareComponent.route, this.activatedRoute);
  }

}
