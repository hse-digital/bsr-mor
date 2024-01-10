import { AfterViewInit, Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService, FileUploadModel } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ReportCheckYourAnswersComponent } from '../report-check-your-answers/report-check-your-answers.component';

@Component({
  templateUrl: './report-support-info.component.html'
})

export class ReportSupportInfoComponent extends PageComponent<FileUploadModel[]> implements AfterViewInit {
  public static route: string = 'support-info';
  static title: string = "Upload support information - Submit a mandatory occurrence notice and report";
  override model: FileUploadModel[] = [];

  constructor(activatedRoute: ActivatedRoute, applicationService: ApplicationService) {
    super(activatedRoute);
  }

  ngAfterViewInit() {
    var element = document.getElementById("input-file-upload");
    element?.classList.remove("govuk-input");
    element?.classList.add("govuk-file-upload");
    element?.classList.add("govuk-!-margin-bottom-5");
  }

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {};
    }  
    var uploadedFiles = applicationService.model?.Report!.FilesUploaded;
    this.model = applicationService.model.Report.FilesUploaded ? uploadedFiles! : [];
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    var uploadedFiles = this.model; 
    applicationService.model.Report!.FilesUploaded = uploadedFiles;
  }
  isAccessValid: boolean = false;
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }
  filesUploaded(model: FileUploadModel[]) {
    this.model = model;
  }
  showErrorMessage(isError: boolean) {
    if (isError) {
      this.hasErrors = false;
      this.filesInErrorMessage = [];
      this.filesUploadingMessage = [];
    }
    this.modelValid = isError;

  }

  isFileProcessing(processing: boolean) {
    this.processing = processing
  }

  modelValid: boolean = false;
  filesInErrorMessage: string[] = [];
  filesUploadingMessage: string[] = [];
  override isValid(): boolean {
    this.filesInErrorMessage = [];
    this.filesUploadingMessage = [];

    this.modelValid = this.model.filter(f => f.Status == "uploading" || f.Status == "error").length > 0 ? false : true;
    if (!this.modelValid) {
      this.model.map(v => {
        if (v.Status == "error") {
          this.filesInErrorMessage.push(v.Message!);
        } if (v.Status == "uploading")
          this.filesUploadingMessage.push(`${v.FileName} is uploading`);
      });
    }
    return this.modelValid;
  }
  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(ReportCheckYourAnswersComponent.route, this.activatedRoute);
  }

}
