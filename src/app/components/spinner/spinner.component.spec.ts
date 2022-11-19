import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner.service';

import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;
  let spinnerService: SpinnerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpinnerComponent],
      imports: [
        MatProgressSpinnerModule,
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    spinnerService = TestBed.inject(SpinnerService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display spinner', () => {
    // Arrange
    spyOn(spinnerService, 'spinnerValue').and.returnValue(of(true));

    // Act
    fixture.detectChanges();
    const spinnerElement = fixture.debugElement.query(By.css('.spinner__container'));

    // Assert    
    expect(spinnerElement).toBeTruthy();
  });

  it('should hide spinner', () => {
    // Arrange
    spyOn(spinnerService, 'spinnerValue').and.returnValue(of(false));

    // Act
    fixture.detectChanges();
    const spinnerElement = fixture.debugElement.query(By.css('.spinner__container'));

    // Assert    
    expect(spinnerElement).toBeFalsy();
  });
});
