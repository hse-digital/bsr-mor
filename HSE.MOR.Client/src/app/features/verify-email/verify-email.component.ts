import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { PageComponent } from '../../helpers/page.component';
import { FieldValidations } from '../../helpers/validators/fieldvalidations';
import { ApplicationService } from '../../services/application.service';

@Component({
  templateUrl: './verify-email.component.html'
})

export class VerifyEmailComponent extends PageComponent<string> {
  public static route: string = 'verify-email';
  static title: string = "Verify your email address";


  override onInit(applicationService: ApplicationService): void {

  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    await await applicationService.validateOTPToken(this.model!, applicationService.model.EmailAddress!);
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  modelValid: boolean = false;

  override isValid(): boolean {
    return false;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigate('');
  }
}
