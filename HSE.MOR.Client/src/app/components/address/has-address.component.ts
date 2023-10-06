import { Component, Input, Output, EventEmitter, QueryList, ViewChildren, Injector, OnInit } from '@angular/core';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { ApplicationService } from 'src/app/services/application.service';
import { GetInjector } from '../../helpers/injector.helper';
import { FieldValidations } from '../../helpers/validators/fieldvalidations';
import { TitleService } from '../../services/title.service';

@Component({
  selector: 'has-address',
  templateUrl: './has-address.component.html'
})
export class HasAddressComponent implements OnInit {

  addressHasErrors = false;
  @Input() addressName!: string;
  @Input() selfAddress = false;
  @Input() model!: string
  @Output() onHasAddress = new EventEmitter<string>();

  @ViewChildren("summaryError") summaryError?: QueryList<GovukErrorSummaryComponent>;

  private injector: Injector = GetInjector();
  private applicationService: ApplicationService = this.injector.get(ApplicationService);

  constructor(private titleService: TitleService) { }

  ngOnInit(): void {
    if (!this.applicationService.model.Building) {
      this.applicationService.model.Building = {};
    }
    if (!this.applicationService.model.Building?.HasAddress) {
      this.applicationService.model.Building.HasAddress = "";
    }
    this.model = this.applicationService.model.Building!.HasAddress;
  }

  continue() {
    this.addressHasErrors = !FieldValidations.IsNotNullOrWhitespace(this.model);
    if (!this.addressHasErrors) {
      this.applicationService.model.Building!.HasAddress = this.model;
      this.onHasAddress.emit(this.model);
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    }
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.addressHasErrors && showError ? errorMessage : undefined;
  }
}
