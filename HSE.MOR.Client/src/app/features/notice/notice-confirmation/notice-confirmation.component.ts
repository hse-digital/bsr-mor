import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { PageComponent } from '../../../helpers/page.component';
import { FieldValidations } from '../../../helpers/validators/fieldvalidations';
import { ApplicationService } from '../../../services/application.service';

@Component({
  templateUrl: './notice-confirmation.component.html'
})

export class NoticeConfirmationComponent extends PageComponent<string> {
  public static route: string = 'confirmation';
  static title: string = "How many floors does the building have?";

  override onInit(applicationService: ApplicationService): void {
    
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {

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

