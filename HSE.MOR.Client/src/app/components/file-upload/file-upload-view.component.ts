import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { interval, Subscription, takeWhile, tap } from 'rxjs';
import { GetInjector } from '../../helpers/injector.helper';
import { ApplicationService, FileUploadModel } from '../../services/application.service';
import {  FileUploadService, ScanAndUploadRequest } from '../../services/file-upload.service';

@Component({
  selector: 'file-upload-view',
  templateUrl: './file-upload-view.component.html'
})

export class FileUploadViewComponent implements OnInit, OnDestroy {
  isAlive: boolean = true;
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  showUploadingInfo: boolean = false;
  showFilesUploaded: boolean = false;
  fileSub?: Subscription;
  uploadSubs: Map<string, Subscription> = new Map<string, Subscription>();
  filesToUpload: File[] = [];
  fileModel: FileUploadModel[] = [];
  caseId?: string;
  AllFilesProcessing: boolean = false;
  totalFiles: number = 0;

  @Output() onClick = new EventEmitter();
  @Output() onKeyupEnter = new EventEmitter();
  @Output() onFilesUploaded = new EventEmitter<FileUploadModel[]>();
  @Output() onErrorMessageDisplay = new EventEmitter<boolean>();
  @Output() uploadCompleteChange = new EventEmitter<boolean>();
  @Output() isFileProcessing = new EventEmitter<boolean>();
  @Input() model: any;


  private injector: Injector = GetInjector();
  private applicationService: ApplicationService = this.injector.get(ApplicationService);
  private fileUploadService: FileUploadService = this.injector.get(FileUploadService);

  ngOnInit(): void {
    this.fileModel = this.applicationService.model.Report!.FilesUploaded ? this.applicationService.model.Report!.FilesUploaded : [];
    this.caseId = this.applicationService.model.Id;
  }

  async selectFiles(event: any): Promise<void> {
    this.filesToUpload = [];
    this.selectedFiles = event.target.files;
    var lastIndex = this.fileModel.length;
    if (this.selectedFiles) {
      await this.uploadFiles(this.selectedFiles!, this.fileModel, lastIndex);
      event.target.value = null;
    }
  }
  async uploadFiles(selectedFiles: FileList, uploadedFiles: FileUploadModel[], lastIndex: number): Promise<void> {
    if (uploadedFiles.length > 0) {
      
      for (let i = 0; i < selectedFiles.length; i++) {
        if (!uploadedFiles.find(f => f.FileName == selectedFiles[i].name)) {
          if (this.filesToUpload.indexOf(selectedFiles[i]) === -1) {
            this.filesToUpload.push(selectedFiles[i]);
          }
        }
      }
      this.totalFiles = lastIndex + this.filesToUpload.length;     
      this.filesToUpload.forEach(async (v) => {
        await this.upload(lastIndex++, v);
      });
    } else {
      for (let i = 0; i < selectedFiles.length; i++) {
        await this.upload(i, selectedFiles[i]);
      }
    }
  }

  async upload(index: number, file: File): Promise<void> {
    this.fileModel[index] = { Progress: 0, FileName: file.name, Status: "", Message: "", CaseId: this.caseId, SASUri: "" };
    this.AllFilesProcessing = true;
    let regex = /^[a-zA-Z0-9\s]*$/
    let fileNameOnly = file.name.substring(0, file.name.lastIndexOf('.'))
    if (file) {
      if (file.size > 524288000) {
        this.fileModel![index].Progress = 0;
        this.fileModel![index].Message = `File is too big`;
        this.fileModel![index].Status = "error";
        this.fileModel![index].isProcessing = false;
        if (this.fileModel!.filter(f => !f.isProcessing && !f.isRemoved).length === this.totalFiles) {
          this.filesProcessed();
          this.AllFilesProcessing = false;
        }
      }     
      else if (!regex.test(fileNameOnly)) {
        this.fileModel![index].Progress = 100;
        this.fileModel![index].Message = `File names must contain letters and numbers only`;
        this.fileModel![index].Status = "error";
        this.model![index].isProcessing = false;
        if (this.fileModel!.filter(f => !f.isProcessing && !f.isRemoved).length === this.totalFiles) {
          this.filesProcessed();
          this.AllFilesProcessing = false;
        }
      }
      else {
        this.showFilesUploaded = false;
        this.fileModel[index].Status = "uploading";
        //var filePath = this.caseId ? `${this.caseId}/${file.name}` : `NO-CASE-ID/${file.name}`;
        var response = await this.fileUploadService.getSASUri(new ScanAndUploadRequest(file.name));
        this.fileModel[index].SASUri = response.SASUri;
        this.fileModel[index].TaskId = response.TaskId;
        this.fileSub = (await this.fileUploadService.uploadFile(file, response.SASUri!))
          .pipe(tap(v =>
            (v > file.size / 4 && v < file.size / 1.5) && file.size > 600000000 ? this.showUploadingInfo = true : this.showUploadingInfo = false))
          .pipe(takeWhile(() =>
            this.isAlive))
          .subscribe({
            next: async (event: any) => {
              this.fileModel[index].Progress = parseInt(((event / file.size) * 100).toString(), 10);
              await this.filesProcessed();
            },
            error: async (err: any) => {
              this.fileModel[index].Progress = 0;
              this.fileModel[index].Message = `Could not upload the file: ${file.name}`;
              this.fileModel[index].Status = "error";
              await this.filesProcessed();
            },
            complete: async () => {
              this.fileModel![index].isScanning = true
              await this.fileUploadService.ScanFile(new ScanAndUploadRequest(file.name, undefined, this.fileModel[index].TaskId))
                .then(async result => {
                  this.fileModel![index].TaskId = result.TaskId
                })
                .then(async () => {
                  this.fileModel![index].isScanning = true
                  this.fileModel![index].Subscription = interval(1000)
                    .subscribe(async (val) => {
                      await this.fileUploadService.GetFileScanResult(new ScanAndUploadRequest(file.name, undefined, this.fileModel![index].TaskId))
                        .then(async res => {

                          this.fileModel![index].FileScanResult = res
                          if (this.fileModel![index].FileScanResult?.IsComplete == true) {
                            if (this.fileModel![index].Subscription && !this.fileModel![index].Subscription.closed) {
                              this.fileModel![index].Subscription.unsubscribe();
                            }
                            if (this.fileModel![index].FileScanResult?.Success == false) {

                              this.fileModel![index].Message = `May contain malware`;
                              this.fileModel![index].Status = "error";
                              this.fileModel![index].isScanning = false
                              this.fileModel![index].isProcessing = false;
                            }
                            else {
                              this.fileModel![index].Message = `Uploaded the file successfully: ${file.name}`;
                              this.fileModel![index].Status = "uploaded";
                              this.fileModel![index].Progress = 100
                              this.fileModel![index].isScanning = false
                              this.fileModel![index].isProcessing = false;
                            }
                            this.showFilesUploaded = true;
                            if (this.fileModel!.filter(f => !f.isProcessing && !f.isRemoved).length === this.fileModel!.filter(f => !f.isRemoved).length) {
                              this.filesProcessed();
                              this.AllFilesProcessing = false;
                            }

                          }
                        });
                    });
                })
              this.fileModel[index].Message = `Uploaded the file successfully: ${file.name}`;
              this.fileModel[index].Status = "uploaded";
              this.showFilesUploaded = true;
              await this.filesProcessed();
            }
          });
        this.uploadSubs.set(file.name, this.fileSub);
      }     
    }
  }

  async remove(event: any) {
    var fileName = event.srcElement.attributes.name.value;
    let index = this.fileModel.findIndex((element) => element.FileName == fileName);
    //var filePath = this.caseId ? `${this.caseId}/${fileName}` : `NO-CASE-ID/${fileName}`;
    if (this.fileModel[index].SASUri!) {
      this.fileUploadService.deleteBlobItem(this.fileModel[index].SASUri!)
        .pipe(takeWhile(() => this.isAlive))
        .subscribe({
          next: async (event: any) => {
            this.fileModel[index].Message = `File removed successfully: ${fileName}`;
            await this.filesProcessed();
          },
          error: async (err: any) => {
            this.fileModel[index].Progress = 0;
            this.fileModel[index].Message = `Could not delete the file: ${fileName}`;
            this.fileModel[index].Status = "error";
            this.fileModel.splice(index, 1);
            await this.filesProcessed();
          },
          complete: async () => {
            this.fileModel.splice(index, 1);
            await this.filesProcessed();
          }
        });
    } else {
      this.fileModel.splice(index, 1);
      await this.filesProcessed();
    }
    
  }

  displayErrorMessage() {
    if (this.fileModel.filter(f => f.Status == "uploading" || f.Status == "error").length == 0) {
      this.onErrorMessageDisplay.emit(true);
    } else {
      this.onErrorMessageDisplay.emit(false);
    }
  }

  async filesProcessed() {
    this.displayErrorMessage();
    if (this.fileModel!.filter(f => f.isRemoved).length === this.totalFiles) {
      this.AllFilesProcessing = false
      this.fileModel = this.fileModel!.filter(f => !f.isRemoved)
      this.uploadCompleteChange.emit(true);
      this.isFileProcessing.emit(false)
      this.applicationService.model.Report!.FilesUploaded = this.fileModel;
      await this.applicationService.updateApplication();
      this.onFilesUploaded.emit(this.applicationService.model.Report!.FilesUploaded);
    }

    if (this.fileModel!.filter(f => !f.isProcessing && !f.isRemoved).length === this.fileModel!.filter(f => !f.isRemoved).length) {
      this.AllFilesProcessing = false
      this.fileModel = this.fileModel!.filter(f => !f.isRemoved)
      this.uploadCompleteChange.emit(true);
      this.isFileProcessing.emit(false)
      this.applicationService.model.Report!.FilesUploaded = this.fileModel;
      await this.applicationService.updateApplication();
      this.onFilesUploaded.emit(this.applicationService.model.Report!.FilesUploaded);
    }

  }
  /*
  async filesProcessed() {
    this.applicationService.model.Report!.FilesUploaded = this.fileModel;
    await this.applicationService.updateApplication();
    this.onFilesUploaded.emit(this.applicationService.model.Report!.FilesUploaded);
    this.displayErrorMessage();
  }
  */
  displayFileInfo() {
    this.showUploadingInfo = !this.showUploadingInfo;
  }

  totalFilesProcessed() {
    return `${this.fileModel.filter(f => f.Status == "uploaded").length} of ${this.fileModel.length} files uploaded`;
  }
  totalFilesUploading() {
    return `${this.fileModel.filter(f => f.Status == "uploaded").length} of ${this.fileModel.length} files uploaded ${this.totalFilesProcessing()}`;
  }

  totalFilesProcessing() {
    return this.fileModel.filter(f => f.Status == "uploading").length > 0 ? `${this.fileModel.find(f => f.Status == "uploading")?.FileName} uploading and` : '';
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}
