import { Component, EventEmitter, Injector, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ApplicationService } from "../../services/application.service";
import { ActivatedRoute} from "@angular/router";
import { GovukErrorSummaryComponent } from 'hse-angular';
import { TitleService } from '../../services/title.service';
import { GetInjector } from '../../helpers/injector.helper';

@Component({
  selector: 'prof-number-of-units',
  templateUrl: './address-prof-number-of-units.component.html'
})

export class AddressProfNumberOfUnitsComponent implements OnInit {

  unitsHasErrors = false;
  @Input() profNumberOfUnits!: number;
  @Output() onProfNumberOfUnits = new EventEmitter<number>();

  private injector: Injector = GetInjector();
  private applicationService: ApplicationService = this.injector.get(ApplicationService);

  @ViewChildren("summaryError") summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(activatedRoute: ActivatedRoute, private titleService: TitleService) {

  }

  ngOnInit(): void {
    this.profNumberOfUnits = this.applicationService.model.Building!.NumberOfUnitsProf!;
  }

  continue() {
    this.unitsHasErrors = !this.isValid();
    if (this.isValid()) {
      this.onProfNumberOfUnits.emit(this.profNumberOfUnits);
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    }
  }

  heightHasError = false;
  errorMessage: string = 'You need to tell us how tall the building is in metres';

  isValid(): boolean {
    this.unitsHasErrors = true;
    let residentialUnits = this.profNumberOfUnits;

    if (!residentialUnits || !Number(residentialUnits) || residentialUnits % 1 != 0) {
      this.errorMessage = 'You need to tell us how many residential units the building has';
    } else if (residentialUnits >= 1000) {
      this.errorMessage = 'Enter a whole number below 999';
    } else if (residentialUnits < 1) {
      this.errorMessage = 'Enter a whole number above 0';
    } else {
      this.unitsHasErrors = false;
    }

    return !this.unitsHasErrors;
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.unitsHasErrors && showError ? errorMessage : undefined;
  }
}