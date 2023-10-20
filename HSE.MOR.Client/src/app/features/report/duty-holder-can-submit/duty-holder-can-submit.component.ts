import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { expand } from 'rxjs';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from '../../../services/application.service';

@Component({
  templateUrl: './duty-holder-can-submit.component.html'
})
export class DutyHolderCanSubmitComponent extends PageComponent<string>  {
  public static route: string = "duty-holder-can-submit";
  static title: string = "Only certain duty holders can submit a mandatory occurrence report";

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
