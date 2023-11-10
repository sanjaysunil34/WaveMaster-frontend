import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BannerComponent } from './components/banner/banner.component';
import { CaptureComponent } from './components/capture/capture.component';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContentComponent } from './components/content/content.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import {MatSliderModule} from '@angular/material/slider';

import { ReactiveFormsModule } from '@angular/forms';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

import { GenerateComponent } from './components/generate/generate.component';


@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    CaptureComponent,
    DashboardComponent,
    FooterComponent,
    ContentComponent,
    ConfigurationComponent,
    GenerateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,

    ReactiveFormsModule,
    MatSelectModule,
    MatSliderModule,
    ReactiveFormsModule,
    CanvasJSAngularChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
