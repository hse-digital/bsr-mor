import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { TitleService } from '../../services/title.service';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent {
  public static route: string = "";
  continueLink: string = 'what-to-submit'
  static title: string = "Make a mandatory occurrence report";

  constructor(private applicationService: ApplicationService, private router: Router, private titleService: TitleService) {    
  }
  continue() {
    this.applicationService.newApplication();
    this.router.navigate([this.continueLink]);
  }
}
