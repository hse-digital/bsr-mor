import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'orgType'
})

export class OrgTypePipe implements PipeTransform {

  transform(value?: string): string {
      return this.valueText[value ?? ""];
    }

  private valueText: Record<string, string> = {
    "company": "Company",
    "": ""
  };
}
