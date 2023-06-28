import { Component } from '@angular/core';
import { PageComponent } from '../../helpers/page.component';
import { ApplicationService, ContactRequestModel } from "../../services/application.service";
import { FieldValidations } from "../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { NavigationHelper } from '../../helpers/navigation.helper';

@Component({
  templateUrl: './who-are-you.component.html'
})

export class WhoAreYouComponent extends PageComponent<ContactRequestModel> {
  public static route: string = 'who-are-you';
  static title: string = "Who are you?";
  override model = new ContactRequestModel();

  constructor(activatedRoute: ActivatedRoute, applicationService: ApplicationService) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = applicationService.model;
    this.model.WhoAreYou = applicationService.model.WhoAreYou;
    this.model.WhoAreYouOther = applicationService.model.WhoAreYouOther;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.WhoAreYou = this.model.WhoAreYou;
    applicationService.model.WhoAreYouOther = this.model.WhoAreYou === "other" ? this.model.WhoAreYouOther : undefined;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.RequestType);
  }

  modelValid: boolean = false;
  hasWhoAreYouErrors: boolean = false;


  override isValid(): boolean {
    if (this.model.WhoAreYou === "other" && !FieldValidations.IsNotNullOrWhitespace(this.model.WhoAreYouOther)) {
      this.modelValid = false;
    } else {
      this.modelValid = FieldValidations.IsNotNullOrWhitespace(this.model.WhoAreYou);
      this.hasWhoAreYouErrors = this.modelValid;
    }
    return this.modelValid;
  }
  override navigateNext(): Promise<boolean> {
    let route = NavigationHelper.getRoute(`${this.model.RequestType}/${this.model.Reason}`);
    return this.navigationService.navigateRelative(route, this.activatedRoute);   
  }


}
