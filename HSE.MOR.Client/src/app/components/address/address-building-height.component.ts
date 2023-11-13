import { Component, EventEmitter, Injector, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ApplicationService } from "../../services/application.service";
import { ActivatedRoute } from "@angular/router";
import { GovukErrorSummaryComponent } from 'hse-angular';
import { TitleService } from '../../services/title.service';
import { GetInjector } from '../../helpers/injector.helper';

@Component({
  selector: 'building-height',
  templateUrl: './address-building-height.component.html'
})

export class AddressBuildingHeightComponent implements OnInit {

  heightHasErrors = false;
  @Input() buildingHeight!: number;
  @Output() onBuildingHeight = new EventEmitter<number>();

  private injector: Injector = GetInjector();
  private applicationService: ApplicationService = this.injector.get(ApplicationService);

  @ViewChildren("summaryError") summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(activatedRoute: ActivatedRoute, private titleService: TitleService) {

  }

  ngOnInit(): void {
    this.buildingHeight = this.applicationService.model.Building!.BuildingHeight!;
  }

  continue() {
    this.heightHasErrors = !this.isValid();
    if (this.isValid()) {
      this.onBuildingHeight.emit(this.buildingHeight);
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    }
  }

  heightHasError = false;
  errorMessage: string = 'You need to tell us how tall the building is in metres';

  isValid(): boolean {
    this.heightHasError = true;
    let height = this.buildingHeight;

    if (!height || !Number(height)) {
      this.errorMessage = 'You need to tell us how tall the building is in metres';
    }  else if (height < 0) {
      this.errorMessage = 'You need to tell us how tall the building is in metres';
    } else if (height >= 1000) {
      this.errorMessage = 'Building height in metres must be 999.9 or less';
    } else {
      this.heightHasError = false;
    }

    return !this.heightHasError;
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.heightHasErrors && showError ? errorMessage : undefined;
  }
}
