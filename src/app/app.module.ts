import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component'
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { PeopleState } from 'src/app/store/people/people.state';
import { CardDetailsComponent } from './components/card-details/card-details.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CardDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    NgxsModule.forRoot([PeopleState], {
      developmentMode: !environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
