import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from '../../../services/application.service';

@Component({
  templateUrl: './no-need-mor.component.html'
})
export class NoNeedMorComponent extends PageComponent<string>  {
  public static route: string = "no-need-mor";
  static title: string = "You do not need to submit a mandatory occurrence report";

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
