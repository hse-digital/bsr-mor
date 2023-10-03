import { Component, Input, Output, EventEmitter, QueryList, ViewChildren, Injector, OnInit } from '@angular/core';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { ApplicationService } from 'src/app/services/application.service';
import { GetInjector } from '../../helpers/injector.helper';
import { FieldValidations } from '../../helpers/validators/fieldvalidations';
import { AddressModel, AddressResponseModel } from '../../services/address.service';
import { TitleService } from '../../services/title.service';

@Component({
  selector: 'region-address',
  templateUrl: './region-address.component.html'
})
export class RegionAddressComponent implements OnInit {

  addressHasErrors = false;
  @Input() addressName!: string;
  @Input() selfAddress = false;
  @Input() model!: string
  @Output() onAddressRegion = new EventEmitter<string>();

  @ViewChildren("summaryError") summaryError?: QueryList<GovukErrorSummaryComponent>;

  private injector: Injector = GetInjector();
  private applicationService: ApplicationService = this.injector.get(ApplicationService);

  constructor(private titleService: TitleService) { }

  ngOnInit(): void {
    this.model = this.applicationService.model.Building!.AddressRegion!;
  }

  continue() {
    this.addressHasErrors = !FieldValidations.IsNotNullOrWhitespace(this.model);
    if (!this.addressHasErrors) {
      this.applicationService.model.Building!.AddressRegion = this.model;
      this.onAddressRegion.emit(this.model);
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    }
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.addressHasErrors && showError ? errorMessage : undefined;
  }
}
