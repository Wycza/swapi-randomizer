import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component'
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { PeopleState } from 'src/app/store/people/people.state';
import { CardDetailsComponent } from './components/card-details/card-details.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CardDetailsComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatProgressSpinnerModule,
      developmentMode: !environment.production
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
