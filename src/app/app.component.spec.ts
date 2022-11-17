import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { PeopleState } from './store/people/people.state';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NgxsModule.forRoot([PeopleState], {
          developmentMode: true,
        })
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
