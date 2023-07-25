import { Component } from '@angular/core';
import { PageComponent } from '../../helpers/page.component';
import { ApplicationService } from "../../services/application.service";
import { FieldValidations } from "../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './what-to-submit.component.html'
})

export class WhatToSubmitComponent extends PageComponent<string> {
  public static route: string = 'what-to-submit';
  static title: string = "What do you want to submit?";

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
