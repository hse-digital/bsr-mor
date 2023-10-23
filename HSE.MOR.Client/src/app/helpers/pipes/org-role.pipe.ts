import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'orgRole'
})

export class OrgRolePipe implements PipeTransform {

  transform(value?: string) {
    return this.valueToText[value ?? ""];
  }

  private valueToText: Record<string, string> = {
    "acc_person": "Accountable person",
    "principal_acc_person": "Principal accountable person",
    "principal_contractor": "Principal contractor",
    "principal_designer": "Principal designer",
    "on_behalf": "Acting on behalf of the duty holder. For example, a managing agent",
    "other": "Other",
    "": ""
  } 
}
