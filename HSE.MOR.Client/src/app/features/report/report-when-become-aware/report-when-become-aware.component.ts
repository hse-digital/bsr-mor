import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, TimeModel } from 'src/app/services/application.service';
import { DateValidator } from '../../../helpers/validators/date-validator';
import { TypeIncidentReportedComponent } from '../type-incident-reported/type-incident-reported.component';

export type InputDateModel = { day?: string, month?: string, year?: string };
export type InputTimeModel = { hour?: string, minute?: string };

@Component({
  selector: 'hse-when-become-aware',
  templateUrl: './report-when-become-aware.component.html'
})
export class ReportWhenBecomeAwareComponent extends PageComponent<TimeModel>  {
  public static route: string = 'report-when-become-aware';
  static title: string = "When did you identify the risk or incident? - Submit a mandatory occurrence notice and report";

  inputDateModel?: InputDateModel;
  inputTimeModel?: InputTimeModel;

  dateErrorMessage?: string;
  timeErrorMessage?: string;

  inputDateHasError: boolean = false;
  inputTimeHasError: boolean = false;
  inputIsEmpty?: boolean = false;

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {
      };
    }
    if (!applicationService.model.Report?.ReportWhenBecomeAware) {
      applicationService.model.Report!.ReportWhenBecomeAware = {
      };
    }
    this.model = applicationService.model.Report?.ReportWhenBecomeAware;
    this.model = {
      Day: applicationService.model.Report?.ReportWhenBecomeAware?.Day,
      Month: applicationService.model.Report?.ReportWhenBecomeAware?.Month,
      Year: applicationService.model.Report?.ReportWhenBecomeAware?.Year,
      Hour: applicationService.model.Report?.ReportWhenBecomeAware?.Hour,
      Minute: applicationService.model.Report?.ReportWhenBecomeAware?.Minute,
    }
    this.inputDateModel = this.transformToInputDate(this.model);
    this.inputTimeModel = this.transformToInputTime(this.model);
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Report!.ReportWhenBecomeAware = {
      Day: this.model?.Day,
      Month: this.model?.Month,
      Year: this.model?.Year,
      Hour: this.model?.Hour,
      Minute: this.model?.Minute,
    }
  }

  private transformToDateTimeModel(inputDate?: InputDateModel, inputTime?: InputTimeModel): TimeModel {
    return {
      Day: inputDate?.day,
      Month: inputDate?.month,
      Year: inputDate?.year,
      Hour: inputTime?.hour,
      Minute: inputTime?.minute
    }
  }


  private transformToInputDate(timeModel: TimeModel): InputDateModel {
    return {
      day: timeModel?.Day?.toString(),
      month: timeModel?.Month?.toString(),
      year: timeModel?.Year?.toString()
    };
  }

  private transformToInputTime(timeModel: TimeModel): InputTimeModel {
    return {
      hour: timeModel?.Hour?.toString(),
      minute: timeModel?.Minute?.toString()
    };
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.Report?.OrgRole);
  }

  override isValid(): boolean {
    this.model = this.transformToDateTimeModel(this.inputDateModel, this.inputTimeModel);

    let dateIsValid = this.isDateValid();
    let timeIsValid = this.isTimeValid();

    return dateIsValid && timeIsValid;
  }

  private isDateValid() {
    this.dateErrorMessage = "";

    if (this.InputDateModelIsNullOrWhitespace()) {
      this.dateErrorMessage = "You need to tell us when you were made aware of the occurrence";
    } else if (!this.inputDateModel?.day) {
      this.dateErrorMessage = "You need to tell us the day you were made aware of the occurrence";
    } else if (!this.inputDateModel?.month) {
      this.dateErrorMessage = "You need to tell us the month you were made aware of the occurrence";
    } else if (!this.inputDateModel?.year) {
      this.dateErrorMessage = "You need to tell us the year you were made aware of the occurrence";
    } else if (!DateValidator.isValid(Number(this.model?.Day!), Number(this.model?.Month!) - 1, Number(this.model?.Year!))) {
      this.dateErrorMessage = "You need to enter a date that exists";
    } else if (Number.isNaN(this.getDate(this.model).getTime())) {
      this.dateErrorMessage = "You need to tell us the date you were made aware of the occurrence";
    } else if ((new Date()).setHours(23, 59, 59, 999) < this.getDate(this.model).getTime()) {
      this.dateErrorMessage = "You need to enter a date in the past or today's date";
    } else if (Number(this.model?.Year!) < 1900) {
      this.dateErrorMessage = "You need to enter a date that is after 1900";
    }
    this.inputDateHasError = this.dateErrorMessage != "";
    return !this.inputDateHasError;
  }

  private isTimeValid() {
    let isHourValid = FieldValidations.IsNotNullOrWhitespace(this.model?.Hour) && FieldValidations.IsWholeNumber(Number(this.model?.Hour)) && FieldValidations.IsAPositiveNumber(Number(this.model?.Hour)) && Number(this.model?.Hour) < 24;
    let isMinuteValid = FieldValidations.IsNotNullOrWhitespace(this.model?.Minute) && FieldValidations.IsWholeNumber(Number(this.model?.Minute)) && FieldValidations.IsAPositiveNumber(Number(this.model?.Minute)) && Number(this.model?.Minute) < 60;

    this.timeErrorMessage = "";
    if (this.InputTimeModelIsNullOrWhitespace()) {
      this.timeErrorMessage = "You need to tell us the time you were made aware of the occurrence";
    } else if (!this.inputTimeModel?.hour) {
      this.timeErrorMessage = "You need to tell us the hour you were made aware of the occurrence";
    } else if (!this.inputTimeModel?.minute) {
      this.timeErrorMessage = "You need to tell us the time including minutes you were made aware of the occurrence";
    }
    else if (!isHourValid || !isMinuteValid || Number.isNaN(this.getTime(this.model).getTime())) {
      this.timeErrorMessage = "You need to enter a valid time";
    }
    this.inputTimeHasError = this.timeErrorMessage != "";
    return !this.inputTimeHasError;
  }

  private getDate(model?: TimeModel) {
    let date: Date = new Date();
    date.setDate(Number(this.model?.Day!) ?? -1);
    date.setMonth(Number(Number(this.model?.Month!) - 1) ?? -1);
    date.setFullYear(Number(this.model?.Year!) ?? -1);
    return date;
  }

  private getTime(model?: TimeModel) {
    let date: Date = new Date();
    date.setHours(Number(this.model?.Hour!) ?? -1);
    date.setMinutes(Number(this.model?.Minute!) ?? -1);
    return date;
  }

  private InputDateModelIsNullOrWhitespace() {
    return (!FieldValidations.IsNotNullOrWhitespace(this.inputDateModel?.day) &&
      !FieldValidations.IsNotNullOrWhitespace(this.inputDateModel?.month) &&
      !FieldValidations.IsNotNullOrWhitespace(this.inputDateModel?.year));
  }

  private InputTimeModelIsNullOrWhitespace() {
    return !FieldValidations.IsNotNullOrWhitespace(this.inputTimeModel?.hour) &&
      !FieldValidations.IsNotNullOrWhitespace(this.inputTimeModel?.minute)

  }

  override async navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(TypeIncidentReportedComponent.route, this.activatedRoute);
  }

}
