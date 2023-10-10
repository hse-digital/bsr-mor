import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'not-in-scope-address',
  templateUrl: './address-region-not-in-scope.component.html'
})
export class AddressRegionNotInScopeAddressComponent {

  @Input() addressName!: string;
  @Input() selfAddress = false;
  @Output() onSearchAgain = new EventEmitter();
  @Output() onEnterManualAddress = new EventEmitter();

  constructor(public applicationService: ApplicationService) {
  }

}
