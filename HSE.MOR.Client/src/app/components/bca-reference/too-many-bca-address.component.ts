import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'too-many-bca-address',
  templateUrl: './too-many-bca-address.component.html'
})
export class TooManyBcaAddressComponent {

  @Input() searchModel!: { referenceNumber?: string };
  @Input() addressName!: string;
  @Output() onSearchAgain = new EventEmitter();
  @Input() selfAddress = false;

  constructor(public applicationService: ApplicationService) {
  }
}
