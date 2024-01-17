import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'whatToSubmit'
})

export class WhatToSubmitPipe implements PipeTransform {

  transform(value?: string) {
    return this.valueText[value ?? ""];
  }
  private valueText: Record<string, string> = {
    "notice": "Notice",
    "report": "Report",
    "": ""
  }
}
