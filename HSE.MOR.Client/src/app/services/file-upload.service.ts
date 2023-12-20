import { HttpClient } from "@angular/common/http";
import { TransferProgressEvent } from "@azure/core-http";
import { Injectable } from "@angular/core";
import { distinctUntilChanged, firstValueFrom, from, Observable, Subscriber } from "rxjs";
import { BlockBlobClient} from "@azure/storage-blob";
import { Sanitizer } from "../helpers/sanitizer";
import { FileUploadModel } from "./application.service";

@Injectable()
export class FileUploadService {

  constructor(private httpClient: HttpClient) { }
 
  async uploadFile(file: File, sasUrl: string) {
    
    const blockBlobClient = new BlockBlobClient(sasUrl);

    return new Observable<number>(observer => {
      blockBlobClient
        .uploadData(file, {
          onProgress: this.onProgress(observer),
          blockSize: 4 * 1024 * 1024, // 4 MiB max block size
          concurrency: 2, // maximum number of parallel transfer workers
          blobHTTPHeaders: {
            blobContentType: file.type
          }
        })
        .then(
          this.onUploadComplete(observer, file),
          this.onUploadError(observer)
        );
    }).pipe(distinctUntilChanged());;
  }
  private onUploadError(observer: Subscriber<number>) {
    return (error: any) => observer.error(error);
  }

  private onUploadComplete(observer: Subscriber<number>, file: File) {
    return () => {
      observer.next(file.size);
      observer.complete();
    };
  }
  private onProgress(observer: Subscriber<number>) {
    return (progress: TransferProgressEvent) =>
      observer.next(progress.loadedBytes);
  }
  async getSASUri(scan?: ScanAndUploadRequest): Promise<ScanAndUploadResponse> {
    return await fetch('api/GetSASUri', {
      method: 'POST',
      body: Sanitizer.sanitize(scan)
    }).then(e => e.json());
  }

  async ScanFile(request?: ScanAndUploadRequest): Promise<ScanAndUploadResponse> {
    return await firstValueFrom(this.httpClient.post<ScanAndUploadResponse>(`api/ScanFileFunctionAsync`, Sanitizer.sanitize(request)));
  }
  async GetFileScanResult(request?: ScanAndUploadRequest): Promise<FileScanResult> {
    return await firstValueFrom(this.httpClient.post<FileScanResult>(`api/GetFileScanResultsFunctionAsync`, Sanitizer.sanitize(request)));
  }

  deleteBlobItem(sasUrl: string) {
    const blockBlobClient = new BlockBlobClient(sasUrl);
    return from(blockBlobClient.deleteIfExists());
  }
}


export class BlobItem {
  filename?: string;
  progress?: number;
  uploading?: boolean;
  uploaded?: boolean;
}

export class FileScanRequest {
  id?: string
  ContainerName?: string
  FileName?: string
  Application?: string
}
export class FileScanResult {
  id?: string
  ContainerName?: string
  FileName?: string
  Application?: string
  Success?: boolean
  IsComplete?: boolean
}

export class ScanAndUploadRequest { 
  BlobName?: string;
  SASUri?: string;
  TaskId?: string;
  CustomerId?: string;
  IncidentId?: string;
  constructor(BlobName?: string, SASUri?: string, TaskId?: string) {
    this.BlobName = BlobName;
    this.SASUri = SASUri;
    this.TaskId = TaskId;
  }
}

export class ScanAndUploadResponse {
  FilePath?: string;
  TaskId?: string;
  BlobName?: string;
  SASUri?: string; 
}

export type Dictionary<T> = { [key: string]: T };
