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
//import { RequestAboutComponent } from './features/request-about/request-about.component';
import { HomeComponent } from './features/home/home.component';
//import { ComplaintOrAdviceComponent } from './features/complaint-or-advice/complaint-or-advice.component';
//import { WhoAreYouComponent } from './features/who-are-you/who-are-you.component';
//import { ComplaintModule } from './features/complaint/complaint.module';
//import { AdviceModule } from './features/advice/advice.module';

const routes = new HseRoutes([
  HseRoute.unsafe(HomeComponent.route, HomeComponent, undefined, HomeComponent.title),
  //HseRoute.protected('', SampleComponent, SampleComponent.title),
  //HseRoute.protected(ComplaintOrAdviceComponent.route, ComplaintOrAdviceComponent, ComplaintOrAdviceComponent.title),
  //HseRoute.protected(WhoAreYouComponent.route, WhoAreYouComponent, WhoAreYouComponent.title),
  //HseRoute.protected(SampleComponent.route, SampleComponent, SampleComponent.title), 
  //HseRoute.protected(RequestAboutComponent.route, RequestAboutComponent, RequestAboutComponent.title),
  //HseRoute.forLoadChildren(ComplaintModule.baseRoute, () => import('./features/complaint/complaint.module').then(m => m.ComplaintModule)),
  //HseRoute.forLoadChildren(AdviceModule.baseRoute, () => import('./features/advice/advice.module').then(m => m.AdviceModule)),
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
  //  SampleComponent,
  //  RequestAboutComponent,
  //  ComplaintOrAdviceComponent,
  //  WhoAreYouComponent,
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
