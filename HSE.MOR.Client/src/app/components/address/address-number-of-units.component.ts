import { Component, EventEmitter, Injector, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ApplicationService } from "../../services/application.service";
import { FieldValidations } from "../../helpers/validators/fieldvalidations";
import { ActivatedRoute } from "@angular/router";
import { GovukErrorSummaryComponent } from 'hse-angular';
import { TitleService } from '../../services/title.service';
import { GetInjector } from '../../helpers/injector.helper';

@Component({
  selector: 'number-of-units',
  templateUrl: './address-number-of-units.component.html'
})

export class AddressNumberOfUnitsComponent implements OnInit {

  unitsHasErrors = false;
  @Input() numberOfUnits!: string;
  @Output() onNumberOfUnits = new EventEmitter<string>();

  private injector: Injector = GetInjector();
  private applicationService: ApplicationService = this.injector.get(ApplicationService);

  @ViewChildren("summaryError") summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(activatedRoute: ActivatedRoute, private titleService: TitleService) {

  }

  ngOnInit(): void {
    this.numberOfUnits = this.applicationService.model.Building!.NumberOfUnits!;
  }

  continue() {
    this.unitsHasErrors = !FieldValidations.IsNotNullOrWhitespace(this.numberOfUnits);
    if (!this.unitsHasErrors) {
      this.onNumberOfUnits.emit(this.numberOfUnits);
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    }
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.unitsHasErrors && showError ? errorMessage : undefined;
  }
}
