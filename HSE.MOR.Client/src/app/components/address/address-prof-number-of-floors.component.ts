import { Component, EventEmitter, Injector, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ApplicationService } from "../../services/application.service";
import { ActivatedRoute } from "@angular/router";
import { GovukErrorSummaryComponent } from 'hse-angular';
import { TitleService } from '../../services/title.service';
import { GetInjector } from '../../helpers/injector.helper';

@Component({
  selector: 'prof-number-of-floors',
  templateUrl: './address-prof-number-of-floors.component.html'
})

export class AddressProfNumberOfFloorsComponent implements OnInit {

  floorsHasErrors = false;
  @Input() profNumberOfFloors!: number;
  @Output() onProfNumberOfFloors = new EventEmitter<number>();

  @ViewChildren("summaryError") summaryError?: QueryList<GovukErrorSummaryComponent>;

  private injector: Injector = GetInjector();
  private applicationService: ApplicationService = this.injector.get(ApplicationService);

  constructor(activatedRoute: ActivatedRoute, private titleService: TitleService) {

  }

  ngOnInit(): void {
    this.profNumberOfFloors = this.applicationService.model.Building!.NumberOfFloorsProf!;
  }

  continue() {
    this.floorsHasErrors = !this.isValid();
    if (this.isValid()) {
      this.onProfNumberOfFloors.emit(this.profNumberOfFloors);
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    }
  }

  floorsHasError = false;
  errorMessage: string = 'You need to tell us how many floors the building has';

  isValid(): boolean {
    this.floorsHasError = true;
    let floorsAbove = this.profNumberOfFloors;

    if (!floorsAbove || !Number(floorsAbove) || floorsAbove % 1 != 0) {
      this.errorMessage = 'You need to tell us how many floors the building has';
    } else if (floorsAbove >= 1000) {
      this.errorMessage = 'Number of floors must be 999 or less';
    } else if (floorsAbove < 0) {
      this.errorMessage = 'You need to tell us how many floors the building has';
    } else {
      this.floorsHasError = false;
    }

    return !this.floorsHasError;
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.floorsHasErrors && showError ? errorMessage : undefined;
  }
}
