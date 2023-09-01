import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, TimeModel } from 'src/app/services/application.service';

export type InputDateModel = {day?: string, month?: string, year?: string};

@Component({
  selector: 'hse-when-become-aware',
  templateUrl: './when-become-aware.component.html'
})
export class WhenBecomeAwareComponent  extends PageComponent<TimeModel>  {
  public static route: string = 'when-become-aware';
  static title: string = "";

  inputDateModel?: InputDateModel;
  inputTimeModel?: string;

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Notice?.WhenBecomeAware) {
      applicationService.model.Notice!.WhenBecomeAware = {};
    }

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
    return  {
      Day: Number(inputDate?.day),
      Month: Number(inputDate?.month),
      Year: Number(inputDate?.year),
      Hour: Number(inputTime?.split(':')[0]),
      Minute: Number(inputTime?.split(':')[1])
    }
  }

  private transformToInputTime(timeModel: TimeModel): string {
    return `${timeModel.Hour}:${timeModel.Minute}`;
  }

  private transformToInputDate(timeModel: TimeModel): InputDateModel {
    return {
      day: timeModel?.Day?.toString(), 
      month: timeModel?.Month?.toString(), 
      year: timeModel?.Year?.toString()
    };
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  errorMessage?: string;
  override isValid(): boolean {
    this.errorMessage = "";
    this.model = this.transformToTimeModel(this.inputDateModel, this.inputTimeModel);
    if (!FieldValidations.IsNotNullOrWhitespace(this.inputTimeModel) && this.InputDateModelIsNotNullOrWhitespace()) {
      this.errorMessage = "You need to tell us when you were made aware of the occurrence";
    } else if (this.InputDateModelIsNotNullOrWhitespace()) {
      this.errorMessage = "You need to tell us the date you were made aware of the occurrence";
    } else if (!this.inputDateModel?.day) {
      this.errorMessage = "You need to tell us the day you were made aware of the occurrence";
    } else if (!this.inputDateModel?.month) {
      this.errorMessage = "You need to tell us the month you were made aware of the occurrence";
    } else if (!this.inputDateModel?.year) {
      this.errorMessage = "You need to tell us the year you were made aware of the occurrence";
    } else if (!Number.isNaN(this.getDate(this.model).getTime())) {
      this.errorMessage = "You need to enter a date that exists";
    } else if (Date.now() < this.getDate(this.model).getTime()) {
      this.errorMessage = "You need to enter a date in the past";
    } else if (this.model?.Year! < 1900) {
      this.errorMessage = "you need to enter a date that is after 1900";
    } else if (!FieldValidations.IsNotNullOrWhitespace(this.inputTimeModel)) {
      this.errorMessage = "You need to tell us the time you were made aware of the occurrence";
    } else if (!Number.isNaN(this.getTime(this.model).getTime())) {
      this.errorMessage = "You need to enter a valid time";
    }
    return this.errorMessage == "";
  }

  private getFullDate(model?: TimeModel) {
    let date: Date = new Date();
    date.setDate(this.model?.Day ?? -1);
    date.setMonth(this.model?.Month ?? -1);
    date.setFullYear(this.model?.Year ?? -1);
    date.setHours(this.model?.Hour ?? -1);
    date.setMinutes(this.model?.Minute ?? -1);
    return date;
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

  private InputDateModelIsNotNullOrWhitespace() {
    return FieldValidations.IsNotNullOrWhitespace(this.inputDateModel?.day) &&
      FieldValidations.IsNotNullOrWhitespace(this.inputDateModel?.month) &&
      FieldValidations.IsNotNullOrWhitespace(this.inputDateModel?.year);
  }

  override navigateNext(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

}
