import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from '../../../services/application.service';

@Component({
  templateUrl: './report-duty-holder-can-submit.component.html'
})
export class ReportDutyHolderCanSubmitComponent extends PageComponent<string>  {
  public static route: string = "report-duty-holder-can-submit";
  static title: string = "Only certain duty holders can submit a mandatory occurrence report - Submit a mandatory occurrence notice and report";

  override onInit(applicationService: ApplicationService): void {
      
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
      
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }
  override isValid(): boolean {
    return true;
  }
  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigate('');
  }

}
