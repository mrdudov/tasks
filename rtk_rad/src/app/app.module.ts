import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PatientComponent } from './patient/patient.component';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PatientListComponent } from './patient-list/patient-list.component';

@NgModule({
  declarations: [AppComponent, PatientComponent, PatientListComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CardModule,
    ButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
