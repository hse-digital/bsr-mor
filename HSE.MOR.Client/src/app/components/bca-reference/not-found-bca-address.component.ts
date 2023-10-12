import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'not-found-bca-address',
  templateUrl: './not-found-bca-address.component.html'
})
export class NotFoundBcaAddressComponent {

  @Input() searchModel: { referenceNumber?: string, addressLine1?: string } = {};
  @Input() addressName!: string;
  @Input() selfAddress = false;
  @Output() onSearchAgain = new EventEmitter();

  constructor(public applicationService: ApplicationService) {
  }

}
