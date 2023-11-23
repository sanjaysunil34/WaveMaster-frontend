import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { connectionGuard } from './guards/connectionGuard';
import { redirectGuard } from './guards/redirectGuard';

const routes: Routes = [
  {path: '', component: ConfigurationComponent, canActivate:[redirectGuard]},
  {path: 'dashboard',component: DashboardComponent, canActivate:[connectionGuard()]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
