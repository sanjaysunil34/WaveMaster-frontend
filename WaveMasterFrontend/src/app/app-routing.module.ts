import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfigurationComponent } from './components/configuration/configuration.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import { ConnectionGuard } from './guards/connection-guard';
import { RedirectGuard } from './guards/redirect-guard';

const routes: Routes = [
  {path: '', component: ConfigurationComponent, canActivate:[RedirectGuard]},
  {path: 'dashboard',component: DashboardComponent, canActivate:[ConnectionGuard()]},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
