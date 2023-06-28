import { NotFoundComponent } from "../components/not-found/not-found.component";
import { AdviceBuildingModule } from "../features/advice/advice-building/advice-building.module";
import { ProfNumberOfFloorsComponent } from "../features/advice/advice-building/prof-number-of-floors/prof-number-of-floors.component";
import { AdviceModule } from "../features/advice/advice.module";
import { NumberOfFloorsComponent } from "../features/complaint/complaint-building/number-of-floors/number-of-floors.component";
import { ComplaintBuildingModule } from "../features/complaint/complaint-building/complaint-building.module";
import { ComplaintModule } from "../features/complaint/complaint.module";
import { ComplaintEnterYourNameComponent } from "../features/complaint/complaint-person-organisation/complaint-enter-your-name/complaint-enter-your-name.component";
import { AdviceEnterYourNameComponent } from "../features/advice/advice-person-organisation/advice-enter-your-name/advice-enter-your-name.component";
import { AdvicePersonOrganisationModule } from "../features/advice/advice-person-organisation/advice-person-organisation.module";
import { ComplaintPersonOrganisationModule } from "../features/complaint/complaint-person-organisation/complaint-person-organisation.module";

export class NavigationHelper {

  static route: any = {
    "advice/building": `/${AdviceModule.baseRoute}/${AdviceBuildingModule.baseRoute}/${ProfNumberOfFloorsComponent.route}`,
    "advice/person_or_organisation": `/${AdviceModule.baseRoute}/${AdvicePersonOrganisationModule.baseRoute}/${AdviceEnterYourNameComponent.route}`,
    "complaint/building": `/${ComplaintModule.baseRoute}/${ComplaintBuildingModule.baseRoute}/${NumberOfFloorsComponent.route}`,
    "complaint/person_or_organisation": `/${ComplaintModule.baseRoute}/${ComplaintPersonOrganisationModule.baseRoute}/${ComplaintEnterYourNameComponent.route}`
  };

  static getRoute(key: string): string {
    let routeValue = this.route[key];
    return routeValue ? routeValue : NotFoundComponent.route;
  }

}
