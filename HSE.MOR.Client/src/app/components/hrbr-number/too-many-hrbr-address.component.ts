import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'too-many-hrbr-address',
  templateUrl: './too-many-hrbr-address.component.html'
})
export class TooManyHrbrAddressComponent {

  @Input() searchModel!: { hrbrNumber?: string };
  @Input() addressName!: string;
  @Output() onSearchAgain = new EventEmitter();
  @Input() selfAddress = false;

  constructor(public applicationService: ApplicationService) {
  }
}
