import { Component, EventEmitter, Injector, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ApplicationService } from "../../services/application.service";
import { FieldValidations } from "../../helpers/validators/fieldvalidations";
import { ActivatedRoute } from "@angular/router";
import { GovukErrorSummaryComponent } from 'hse-angular';
import { TitleService } from '../../services/title.service';
import { GetInjector } from '../../helpers/injector.helper';

@Component({
  selector: 'number-of-floors',
  templateUrl: './address-number-of-floors.component.html'
})

export class AddressNumberOfFloorsComponent implements OnInit {

  floorsHasErrors = false;
  @Input() numberOfFloors!: string;
  @Output() onNumberOfFloors = new EventEmitter<string>();

  private injector: Injector = GetInjector();
  private applicationService: ApplicationService = this.injector.get(ApplicationService);

  @ViewChildren("summaryError") summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(activatedRoute: ActivatedRoute, private titleService: TitleService) {

  }

  ngOnInit(): void {
    this.numberOfFloors = this.applicationService.model.Building!.NumberOfFloors!;
  }

  continue() {
    this.floorsHasErrors = !FieldValidations.IsNotNullOrWhitespace(this.numberOfFloors);
    if (!this.floorsHasErrors) {
      this.onNumberOfFloors.emit(this.numberOfFloors);
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    }
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.floorsHasErrors && showError ? errorMessage : undefined;
  }
}
