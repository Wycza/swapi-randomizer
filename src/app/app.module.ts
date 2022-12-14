import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component'
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { GameState } from 'src/app/store/game/game.state';
import { CardDetailsComponent } from './components/card-details/card-details.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';
import { GameSelectorComponent } from './components/game-selector/game-selector.component';
import { WinnerOutputComponent } from './components/winner-output/winner-output.component';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { PlayButtonComponent } from './components/play-button/play-button.component';
import { HumanPropertyPipe } from './pipes/human-property.pipe';

const devModules: (any[] | Type<any> | ModuleWithProviders<{}>)[] = [
  NgxsReduxDevtoolsPluginModule.forRoot(),
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CardDetailsComponent,
    SpinnerComponent,
    GameSelectorComponent,
    WinnerOutputComponent,
    PlayButtonComponent,
    HumanPropertyPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatProgressSpinnerModule,
    NgxsModule.forRoot([GameState], {
      developmentMode: !environment.production
    }),
    FormsModule,
    environment.production
      ? []
      : devModules,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
