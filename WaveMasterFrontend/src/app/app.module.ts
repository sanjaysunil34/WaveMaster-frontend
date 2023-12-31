import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BannerComponent } from './components/banner/banner.component';
import { CaptureComponent } from './components/capture/capture.component';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSliderModule} from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContentComponent } from './components/content/content.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { GenerateComponent } from './components/generate/generate.component';
import {HttpClientModule} from '@angular/common/http';
import { TestComponent } from './components/test/test.component';


@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    FooterComponent,
    ContentComponent,
    ConfigurationComponent,
    CaptureComponent,
    DashboardComponent,
    FooterComponent,
    ContentComponent,
    GenerateComponent,
    TestComponent,
    PageNotFoundComponent
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
    CanvasJSAngularChartsModule,
    HttpClientModule,
    FormsModule,
    MatSnackBarModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
