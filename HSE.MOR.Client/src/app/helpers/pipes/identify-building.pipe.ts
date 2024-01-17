import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'identifyBuilding'
})

export class IdentifyBuildingPipe implements PipeTransform {

  transform(value?: string) {
    return this.valueText[value ?? ""];
  }
  private valueText: Record<string, string> = {
    "building_registration": "High-rise residential building registration reference",
    "building_reference": "Building control application reference",
    "": ""
  }
}
