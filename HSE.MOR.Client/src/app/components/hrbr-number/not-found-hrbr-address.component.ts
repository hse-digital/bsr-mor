import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'not-found-hrbr-address',
  templateUrl: './not-found-hrbr-address.component.html'
})
export class NotFoundHrbrAddressComponent {

  @Input() searchModel: { hrbrNumber?: string, addressLine1?: string } = {};
  @Input() addressName!: string;
  @Input() selfAddress = false;
  @Output() onSearchAgain = new EventEmitter();

  constructor(public applicationService: ApplicationService) {
  }

}
