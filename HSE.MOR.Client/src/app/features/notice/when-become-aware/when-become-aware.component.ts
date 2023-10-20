import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, TimeModel } from 'src/app/services/application.service';
import { NoticeCheckYourAnswersComponent } from '../notice-check-your-answers/notice-check-your-answers.component';

export type InputDateModel = {day?: string, month?: string, year?: string};

@Component({
  selector: 'hse-when-become-aware',
  templateUrl: './when-become-aware.component.html'
})
export class WhenBecomeAwareComponent  extends PageComponent<TimeModel>  {
  public static route: string = 'when-become-aware';
  static title: string = "When did you identify the risk or incident?";

  inputDateModel?: InputDateModel;
  inputTimeModel?: string;

  dateErrorMessage?: string;
  timeErrorMessage?: string;

  inputDateHasError: boolean = false;
  inputTimeHasError: boolean = false;
  inputIsEmpty?: boolean = false;
  
  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Notice) {
      applicationService.model.Notice = {
      };
    }
    if (!applicationService.model.Notice?.WhenBecomeAware) {
      applicationService.model.Notice!.WhenBecomeAware = {       
      };
    }
    this.model = applicationService.model.Notice?.WhenBecomeAware;   
    this.model = { 
      Day: applicationService.model.Notice?.WhenBecomeAware?.Day,
      Month: applicationService.model.Notice?.WhenBecomeAware?.Month,
      Year: applicationService.model.Notice?.WhenBecomeAware?.Year,      
      Hour: applicationService.model.Notice?.WhenBecomeAware?.Hour,      
      Minute: applicationService.model.Notice?.WhenBecomeAware?.Minute,      
    }
    this.inputDateModel = this.transformToInputDate(this.model);
    this.inputTimeModel = this.transformToInputTime(this.model);
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Notice!.WhenBecomeAware = { 
      Day: this.model?.Day,
      Month: this.model?.Month,
      Year: this.model?.Year,      
      Hour: this.model?.Hour,      
      Minute: this.model?.Minute,      
    }
  }

  private transformToTimeModel(inputDate?: InputDateModel, inputTime?: string): TimeModel {
    let hour = inputTime?.split(':')[0];
    let minute = inputTime?.split(':')[1];
    return  {
      Day: Number(inputDate?.day),
      Month: Number(inputDate?.month),
      Year: Number(inputDate?.year),
      Hour: FieldValidations.IsNotNullOrWhitespace(hour) ? Number(hour) : -1,
      Minute: FieldValidations.IsNotNullOrWhitespace(minute) ? Number(minute) : -1
    }
  }

  private transformToInputTime(timeModel: TimeModel): string {
    if(timeModel.Hour == undefined && timeModel.Minute == undefined) return "";

    timeModel.Hour = timeModel?.Hour ?? 0;
    timeModel.Minute = timeModel?.Minute ?? 0;

    let hour = timeModel?.Hour < 10 ? `0${timeModel.Hour}` : timeModel.Hour;
    let minute = timeModel.Minute < 10 ? `0${timeModel.Minute}` : timeModel.Hour;
    
    return `${hour}:${minute}`;
  }

  private transformToInputDate(timeModel: TimeModel): InputDateModel {
    return {
      day: timeModel?.Day?.toString(), 
      month: timeModel?.Month?.toString(), 
      year: timeModel?.Year?.toString()
    };
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.Notice?.DescribeRiskIncident);
  }

  override isValid(): boolean {
    this.model = this.transformToTimeModel(this.inputDateModel, this.inputTimeModel);    

    this.inputIsEmpty = !FieldValidations.IsNotNullOrWhitespace(this.inputTimeModel) && this.InputDateModelIsNullOrWhitespace();

    let dateIsValid = this.isDateValid();
    let timeIsValid = this.isTimeValid();

    return dateIsValid && timeIsValid;
  }

  private isDateValid() {
    this.dateErrorMessage = "";
    if (this.InputDateModelIsNullOrWhitespace()) {
      this.dateErrorMessage = "You need to tell us the date you were made aware of the occurrence";
    } else if (!this.inputDateModel?.day) {
      this.dateErrorMessage = "You need to tell us the day you were made aware of the occurrence";
    } else if (!this.inputDateModel?.month) {
      this.dateErrorMessage = "You need to tell us the month you were made aware of the occurrence";
    } else if (!this.inputDateModel?.year) {
      this.dateErrorMessage = "You need to tell us the year you were made aware of the occurrence";
    } else if (Number.isNaN(this.getDate(this.model).getTime())) {
      this.dateErrorMessage = "You need to enter a date that exists";
    } else if (Date.now() < this.getDate(this.model).getTime()) {
      this.dateErrorMessage = "You need to enter a date in the past";
    } else if (this.model?.Year! < 1900) {
      this.dateErrorMessage = "you need to enter a date that is after 1900";
    }
    this.inputDateHasError = this.dateErrorMessage != "";
    return !this.inputDateHasError;
  }

  private isTimeValid() {
    let isHourValid = FieldValidations.IsWholeNumber(this.model?.Hour) && FieldValidations.IsAPositiveNumber(this.model?.Hour) && this.model!.Hour! < 24;
    let isMinuteValid = FieldValidations.IsWholeNumber(this.model?.Minute) && FieldValidations.IsAPositiveNumber(this.model?.Minute) && this.model!.Minute! < 60;
    
    this.timeErrorMessage = "";
    if (!FieldValidations.IsNotNullOrWhitespace(this.inputTimeModel)) {
      this.timeErrorMessage = "You need to tell us the time you were made aware of the occurrence";
    } else if (!isHourValid || !isMinuteValid || Number.isNaN(this.getTime(this.model).getTime())) {
      this.timeErrorMessage = "You need to enter a valid time";
    }
    this.inputTimeHasError = this.timeErrorMessage != "";
    return !this.inputTimeHasError;
  }

  private getDate(model?: TimeModel) {
    let date: Date = new Date();
    date.setDate(this.model?.Day ?? -1);
    date.setMonth(this.model?.Month ?? -1);
    date.setFullYear(this.model?.Year ?? -1);
    return date;
  }

  private getTime(model?: TimeModel) {
    let date: Date = new Date();
    date.setHours(this.model?.Hour ?? -1);
    date.setMinutes(this.model?.Minute ?? -1);
    return date;
  }

  private InputDateModelIsNullOrWhitespace() {
    return !FieldValidations.IsNotNullOrWhitespace(this.inputDateModel?.day) &&
      !FieldValidations.IsNotNullOrWhitespace(this.inputDateModel?.month) &&
      !FieldValidations.IsNotNullOrWhitespace(this.inputDateModel?.year);
  }

  override async navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(NoticeCheckYourAnswersComponent.route, this.activatedRoute);
  }

}
