import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { PageComponent } from '../../helpers/page.component';
import { FieldValidations } from '../../helpers/validators/fieldvalidations';
import { ApplicationService } from '../../services/application.service';

@Component({
  templateUrl: './enter-email.component.html'
})

export class EnterEmailComponent extends PageComponent<string> {
  public static route: string = 'enter-email';
  static title: string = "Your email address";


  override onInit(applicationService: ApplicationService): void {
    this.model = applicationService.model.EmailAddress;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    await applicationService.sendVerificationEmail(this.model!);
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  modelValid: boolean = false;

  override isValid(): boolean {
    return false;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigate('verify-email');
  }
}
