import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { AddressSearchMode } from "src/app/components/address/address.component";
import { AddressModel } from "src/app/services/address.service";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from 'src/app/services/title.service';
import { GetInjector } from "../../../helpers/injector.helper";
import { NavigationHelper } from "../../../helpers/navigation.helper";

@Component({
  templateUrl: './hrbr-reference-number.component.html'
})
export class HrbrReferenceNumberComponent implements OnInit {
  static route: string = 'hrbr-reference-number';

  static title: string = 'Find the address of the section';
  static selectTitle: string = 'Select the section address';
  static confirmTitle: string = 'Confirm the section address';

  searchMode = AddressSearchMode.Building;
  private injector: Injector = GetInjector();
  private applicationService: ApplicationService = this.injector.get(ApplicationService);

  constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute, private titleService: TitleService) {
  }

  private addressIndex?: number;
  private returnUrl?: string;
  address?: AddressModel;
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(query => {
      this.addressIndex = query['address'];
      this.returnUrl = query['return'];
      if (this.addressIndex) {
        if (this.applicationService.model.Building) {
          this.applicationService.model.Building = {};
        }
        this.address = this.applicationService.model.Building!.Address;
      } else {
        this.address = new AddressModel();
        this.address.IsManual = false;
      }
    });
  }
  async updateAddress(address: AddressModel) {
    if (this.addressIndex) {
      this.applicationService.model.Building!.Address = address;
    } else {
      this.applicationService.model.Building!.Address = address;
    }
    this.applicationService.model.Building!.Address.IsManual = address.IsManual;
    await this.applicationService.updateApplication();

    if (this.returnUrl) {
      this.navigationService.navigateRelative(`../${this.returnUrl}`, this.activatedRoute);
    } else {
      var routeKey = this.applicationService.model.WhatToSubmit == "notice" ? "notice-your-details" : "report-your-details";
      let route = NavigationHelper.getRoute(routeKey);
      this.navigationService.navigate(route);
    }
  }
  goToIdentifyBuilding(isGoodToGo: boolean) {
    if (isGoodToGo) {
      var routeKey = this.applicationService.model.WhatToSubmit == "notice" ? "notice-identify-building" : "report-identify-building";
      let route = NavigationHelper.getRoute(routeKey);
      this.navigationService.navigate(route);
    }
  }

  getAddressSectionName() {
    if (!this.applicationService.model.Building) {
      this.applicationService.model.Building = {};
    }
    return this.applicationService.model.Building!.BuildingName!;
  }
  async changeStep(event: any) {
    await this.applicationService.updateApplication();
    switch (event) {
      case "select": this.titleService.setTitle(HrbrReferenceNumberComponent.selectTitle);
        return;
      case "confirm": this.titleService.setTitle(HrbrReferenceNumberComponent.confirmTitle);
        return;
    }
    this.titleService.setTitle(HrbrReferenceNumberComponent.title);
  }

  canActivate(routeSnapshot: ActivatedRouteSnapshot) {
    return true;
  }

}
