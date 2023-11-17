import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { AddressSearchMode } from "src/app/components/address/address.component";
import { AddressModel } from "src/app/services/address.service";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from 'src/app/services/title.service';
import { NotFoundComponent } from "../../../components/not-found/not-found.component";
import { GetInjector } from "../../../helpers/injector.helper";
import { NavigationHelper } from "../../../helpers/navigation.helper";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";

@Component({
  templateUrl: './building-address.component.html'
})
export class BuildingAddressComponent implements OnInit {
  static route: string = 'address';

  static title: string = 'Find the address of the section - Submit a mandatory occurrence notice and report';
  static selectTitle: string = 'Select the section address - Submit a mandatory occurrence notice and report';
  static confirmTitle: string = 'Confirm the section address - Submit a mandatory occurrence notice and report';
  static hasAddressTitle: string = 'Does your building or site have an address? - Submit a mandatory occurrence notice and report';

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
      case "select": this.titleService.setTitle(BuildingAddressComponent.selectTitle);
        return;
      case "confirm": this.titleService.setTitle(BuildingAddressComponent.confirmTitle);
        return;
      case "has-address": this.titleService.setTitle(BuildingAddressComponent.hasAddressTitle);
        return;
    }
    this.titleService.setTitle(BuildingAddressComponent.title);
  }

  canActivate(routeSnapshot: ActivatedRouteSnapshot) {
    var isCanActivate = FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.Building?.BuildingType) && this.applicationService.model.Building?.BuildingType !== "in_design";
    if (!isCanActivate) {
      this.navigationService.navigate(NotFoundComponent.route);
    }
  }

}
