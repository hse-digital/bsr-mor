import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyNoticeComponent } from './privacy-notice/privacy-notice.component';
import { RouterModule } from '@angular/router';
import { HseAngularModule } from 'hse-angular';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { AccessibilityComponent } from './accessibility/accessibility.component';
import { CookiesComponent } from './cookies/cookies.component';
import { HseRoute, HseRoutes } from 'src/app/helpers/hse.route';
import { CookieDetailsComponent } from './cookies/cookie-details/cookie-details.component';

const routes = new HseRoutes([
  HseRoute.unsafe(PrivacyNoticeComponent.route, PrivacyNoticeComponent, undefined, PrivacyNoticeComponent.title),
  HseRoute.unsafe(TermsConditionsComponent.route, TermsConditionsComponent, undefined, TermsConditionsComponent.title),
  HseRoute.unsafe(AccessibilityComponent.route, AccessibilityComponent, undefined, AccessibilityComponent.title),
  HseRoute.unsafe(CookiesComponent.route, CookiesComponent, undefined, CookiesComponent.title),
  HseRoute.unsafe(CookieDetailsComponent.route, CookieDetailsComponent, undefined, CookieDetailsComponent.title),
]);

@NgModule({
  declarations: [
    PrivacyNoticeComponent,
    TermsConditionsComponent,
    AccessibilityComponent,
    CookiesComponent,
    CookieDetailsComponent
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    CommonModule,
    HseAngularModule,
  ],
  providers: [...routes.getProviders()]
})
export class HelpPagesModule {
  static baseRoute: string = 'help';

  static footerLinks = [
    { title: "Contact the Building Safety Regulator", href: "https://www.gov.uk/guidance/contact-the-building-safety-regulator", isNewTab: false },
    { title: "Privacy", href: `/${HelpPagesModule.baseRoute}/${PrivacyNoticeComponent.route}`, isNewTab: false },
    { title: "Accessibility", href: `/${HelpPagesModule.baseRoute}/${AccessibilityComponent.route}`, isNewTab: false },
    { title: "Cookies", href: `/${HelpPagesModule.baseRoute}/${CookiesComponent.route}`, isNewTab: false },
    { title: "Terms and conditions", href: `/${HelpPagesModule.baseRoute}/${TermsConditionsComponent.route}`, isNewTab: false },
  ];
}
