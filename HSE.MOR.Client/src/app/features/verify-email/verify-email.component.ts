import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { PageComponent } from '../../helpers/page.component';
import { FieldValidations } from '../../helpers/validators/fieldvalidations';
import { ApplicationService } from '../../services/application.service';

@Component({
  templateUrl: './verify-email.component.html'
})

export class VerifyEmailComponent extends PageComponent<number> {
  public static route: string = 'verify-email';
  static title: string = "Verify your email address";
  otpError = false;
  isOtpNotNumber = false;
  isOtpInvalidLength = false;
  isOtpEmpty = false;
  email: string = "";

  override onInit(applicationService: ApplicationService): void {

  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    try {
      this.email = applicationService.model.EmailAddress! ?? '';
      await await applicationService.validateOTPToken(this.model!.toString() ?? '', this.email);
    } catch (error) {
      this.processing = false;
      this.otpError = true;
      this.hasErrors = true;
      throw error;
    }
    
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model?.EmailAddress);
  }

  modelValid: boolean = false;

  override isValid(): boolean {
    var otp = this.model?.toString() ?? ''
    this.isOtpEmpty = otp.length == 0;
    this.isOtpInvalidLength = (otp.trim().length < 6 || otp.trim().length > 6)
    this.isOtpNotNumber = this.model !== undefined && isNaN(this.model)

    return !(this.isOtpInvalidLength || this.isOtpNotNumber);
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigate('what-to-submit');
  }

  getOtpError() {
    if (!this.isOtpEmpty && this.isOtpNotNumber) {
      return 'You need to enter a 6-digit security code';
    }
    else if (this.isOtpInvalidLength) {
      return 'You need to enter a security code'
    }

    else if (this.otpError) {
      return 'The security code has expired, you need to resend the security code';
    }
    else {
      return 'You need to enter a security code'
    }
  }

}
