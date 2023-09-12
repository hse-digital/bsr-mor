import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HseAngularModule } from 'hse-angular';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
//import { SampleComponent } from './features/sample.component';
import { HseRoute, HseRoutes } from './helpers/hse.route';
import { TimeoutComponent } from './components/timeout/timeout.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TimeoutModalComponent } from './components/timeout/timeout.modal';
import { RouterModule } from '@angular/router';
import { HelpPagesModule } from './components/footer/help-pages.module';
import { ApplicationService } from './services/application.service';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './components/components.module';
import { GetInjector } from './helpers/injector.helper';
import { CookiesBannerService } from './services/cookies-banner.service';
import { HomeComponent } from './features/home/home.component';
import { WhatToSubmitComponent } from './features/what-to-submit/what-to-submit.component';
import { ReportModule } from './features/report/report.module';
import { NoticeModule } from './features/notice/notice.module';
import { VerifyEmailComponent } from './features/verify-email/verify-email.component';
import { EnterEmailComponent } from './features/verify-email/enter-email.component';


const routes = new HseRoutes([
  HseRoute.unsafe(HomeComponent.route, HomeComponent, undefined, HomeComponent.title),
  HseRoute.protected(WhatToSubmitComponent.route, WhatToSubmitComponent, WhatToSubmitComponent.title),
  HseRoute.protected(EnterEmailComponent.route, EnterEmailComponent, EnterEmailComponent.title),
  HseRoute.protected(VerifyEmailComponent.route, VerifyEmailComponent, VerifyEmailComponent.title),
  HseRoute.forLoadChildren(ReportModule.baseRoute, () => import('./features/report/report.module').then(m => m.ReportModule)),
  HseRoute.forLoadChildren(NoticeModule.baseRoute, () => import('./features/notice/notice.module').then(m => m.NoticeModule)),
  HseRoute.forLoadChildren(HelpPagesModule.baseRoute, () => import('./components/footer/help-pages.module').then(m => m.HelpPagesModule)),
  HseRoute.unsafe(NotFoundComponent.route, NotFoundComponent, undefined, NotFoundComponent.title),
  HseRoute.unsafe('**', undefined, NotFoundComponent.route)
]);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TimeoutComponent,
    TimeoutModalComponent,
    NotFoundComponent,
    WhatToSubmitComponent,
    VerifyEmailComponent,
    EnterEmailComponent
  ],
  imports: [
    RouterModule.forRoot(routes.getRoutes(), { initialNavigation: 'enabledBlocking', scrollPositionRestoration: 'enabled' }),
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    ComponentsModule,
    CommonModule,
    HseAngularModule,
    HttpClientModule,
    HelpPagesModule
  ],
  providers: [HttpClient, ApplicationService, CookiesBannerService, ...routes.getProviders()],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(injector: Injector) {
    GetInjector(injector);
  }
}
