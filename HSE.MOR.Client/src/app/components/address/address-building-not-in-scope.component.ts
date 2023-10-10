import { Component, OnInit } from '@angular/core';
import { ApplicationService } from "../../services/application.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'building-not-in-scope',
  templateUrl: './address-building-not-in-scope.component.html'
})

export class AddressBuildingNotInScopeComponent implements OnInit {
  public static route: string = 'building-not-in-scope';
  static title: string = "Building not in scope";

  constructor(activatedRoute: ActivatedRoute, private applicationService: ApplicationService) {

  }
  ngOnInit(): void {

  }

  continue() {
  }


}
