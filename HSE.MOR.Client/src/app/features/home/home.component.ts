import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ApplicationService } from '../../services/application.service';
import { TitleService } from '../../services/title.service';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent {
  public static route: string = environment.production ? "home" : "";
  continueLink: string = 'enter-email'
  static title: string = "Make a mandatory occurrence report";

  constructor(private applicationService: ApplicationService, private router: Router, private titleService: TitleService) {    
  }
  continue() {
    this.applicationService.newApplication();
    this.router.navigate([this.continueLink]);
  }
}
