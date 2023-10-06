import { Component, Input, Output, EventEmitter, QueryList, ViewChildren, Injector, OnInit } from '@angular/core';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { ApplicationService, BuildingModel } from 'src/app/services/application.service';
import { GetInjector } from '../../helpers/injector.helper';
import { FieldValidations } from '../../helpers/validators/fieldvalidations';
import { TitleService } from '../../services/title.service';

@Component({
  selector: 'address-coordinates',
  templateUrl: './address-coordinates.component.html'
})
export class AddressCoordinatesComponent implements OnInit {

  hasCoordinatesErrors = false;
  hasEastingErrors = false;
  hasNorthingErrors = false;
  hasBothCoorninatesErrors = false;

  @Input() addressName!: string;
  @Input() selfAddress = false;
  @Input() model: BuildingModel = new BuildingModel();
  @Output() onAddressCoordinates = new EventEmitter<BuildingModel>();

  @ViewChildren("summaryError") summaryError?: QueryList<GovukErrorSummaryComponent>;

  private injector: Injector = GetInjector();
  private applicationService: ApplicationService = this.injector.get(ApplicationService);

  constructor(private titleService: TitleService) { }

  ngOnInit(): void {
    if (!this.applicationService.model.Building) {
      this.applicationService.model.Building = {};
    }
    if (!this.applicationService.model.Building?.Easting) {
      this.applicationService.model.Building.Easting = "";
    }
    if (!this.applicationService.model.Building?.Northing) {
      this.applicationService.model.Building.Northing = "";
    }
    this.model.Easting = this.applicationService.model.Building!.Easting;
    this.model.Northing = this.applicationService.model.Building!.Northing;
  }


  eastingErrorMessage: string = "You need to tell us the easting coordinates of the proposed building";
  northingErrorMessage: string = "You need to tell us the northing coordinates of the proposed building";
 
  continue() {
    this.hasEastingErrors = false;
    this.hasNorthingErrors = false;
    this.hasBothCoorninatesErrors = false;

    if (!FieldValidations.IsNotNullOrWhitespace(this.model.Easting) && !FieldValidations.IsNotNullOrWhitespace(this.model.Northing)) {
      this.hasBothCoorninatesErrors = true;

    } if (!FieldValidations.IsNotNullOrWhitespace(this.model.Easting)) {
      this.hasEastingErrors = true;

    } if (FieldValidations.IsNotNullOrWhitespace(this.model.Easting) && (this.model.Easting?.length! < 12 && this.model.Easting?.length! > 6)) {

      this.eastingErrorMessage = "You need to tell us the easting coordinates using 6 numbers ";
      this.hasEastingErrors = true;

    } if (!FieldValidations.IsNotNullOrWhitespace(this.model.Northing)) {
      this.hasNorthingErrors = true;

    } if (FieldValidations.IsNotNullOrWhitespace(this.model.Northing) && (this.model.Northing?.length! < 12 && this.model.Northing?.length! > 6)) {

      this.northingErrorMessage = "You need to tell us the easting coordinates using 6 numbers ";
      this.hasNorthingErrors = true;
    } 
    this.hasCoordinatesErrors = this.hasBothCoorninatesErrors || this.hasEastingErrors || this.hasNorthingErrors  ? true : false;

    if (!this.hasCoordinatesErrors) {
      this.applicationService.model.Building!.Easting = this.model.Easting;
      this.applicationService.model.Building!.Northing = this.model.Northing;
      this.onAddressCoordinates.emit(this.model);
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    }
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.hasCoordinatesErrors && showError ? errorMessage : undefined;
  }
}
