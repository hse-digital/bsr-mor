import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { PageComponent } from '../../helpers/page.component';
import { EmailValidator } from '../../helpers/validators/email-validator';
import { FieldValidations } from '../../helpers/validators/fieldvalidations';
import { ApplicationService } from '../../services/application.service';
import { VerifyEmailComponent } from './verify-email.component';

@Component({
  templateUrl: './enter-email.component.html'
})

export class EnterEmailComponent extends PageComponent<string> {
  public static route: string = 'enter-email';
  static title: string = "Your email address - Submit a mandatory occurrence notice and report";
  emailValid: boolean = true;
  errorMessage: string = '';

  override onInit(applicationService: ApplicationService): void {
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.EmailAddress = this.model;
    await applicationService.sendVerificationEmail(this.model!);
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  modelValid: boolean = false;

  override isValid(): boolean {
    this.errorMessage = '';
    this.emailValid = FieldValidations.IsNotNullOrWhitespace(this.model);
    if (!this.emailValid) {
      this.errorMessage = 'You need to tell us your email address';
      return false;
    }
    this.emailValid = EmailValidator.isValid(this.model ?? '');
    if (!this.emailValid) {
      this.errorMessage = 'Enter an email address in the correct format, like name@example.com';
      return false;
    }   
    return true; 
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigate(VerifyEmailComponent.route);
  }
}
