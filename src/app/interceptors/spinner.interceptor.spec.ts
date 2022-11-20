import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { SpinnerService } from '../services/spinner.service';

import { SpinnerInterceptor } from './spinner.interceptor';
import { SwapiService } from '../api/swapi.service';
import { finalize } from 'rxjs';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

describe('SpinnerInterceptor', () => {
  let interceptor: SpinnerInterceptor;
  let httpMock: HttpTestingController;
  let swapiService: SwapiService;
  const swapiBaseUrl = 'https://www.swapi.tech/api';
  const spinnerServiceSpy = jasmine.createSpyObj('SpinnerService', ['setLoading']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SpinnerInterceptor,
        SwapiService,
        { provide: SpinnerService, useValue: spinnerServiceSpy },
        { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true }
      ],
      imports: [
        HttpClientTestingModule,
      ]
    });

    interceptor = TestBed.inject(SpinnerInterceptor);
    httpMock = TestBed.inject(HttpTestingController);
    swapiService = TestBed.inject(SwapiService);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should show and then hide spinner', waitForAsync(() => {
    // Arrange
    const id = 1;

    // Act & Assert
    swapiService.getPeopleById(id)
      .pipe(
        // In finalize we should hide interceptor
        finalize(() => expect(spinnerServiceSpy.setLoading).toHaveBeenCalledWith(false)))
      .subscribe(() => {
        expect(spinnerServiceSpy.setLoading).toHaveBeenCalledWith(true);
      });

    httpMock.expectOne(`${swapiBaseUrl}/people/${id}`).flush({
      result: {
        description: '',
        properties: {
          mass: '',
        },
        uid: ''
      }
    });
  }));
});
