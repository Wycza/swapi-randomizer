import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDetailsComponent } from './card-details.component';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { HumanPropertyPipe } from 'src/app/pipes/human-property.pipe';

describe('CardDetailsComponent', () => {
  let component: CardDetailsComponent;
  let fixture: ComponentFixture<CardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CardDetailsComponent,
        HumanPropertyPipe,
      ],
      imports: [MatCardModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CardDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display card if title passed', () => {
    // Arrange
    component.title = 'Test';

    // Act
    fixture.detectChanges();
    const cardElement = fixture.debugElement.query(By.css('.card'));

    // Assert    
    expect(cardElement).toBeTruthy();
  });

  it('should not render card if title not passed', () => {
    // Arrange
    component.title = '';

    // Act
    fixture.detectChanges();
    const cardElement = fixture.debugElement.query(By.css('.card'));

    // Assert    
    expect(cardElement).toBeFalsy();
  });

  it('should render X properties if X passed to the component', () => {
    // Arrange
    component.title = 'Test';
    component.properties = {
      'a': 1,
      'b': 2,
      'c': 3,
    }

    // Act
    fixture.detectChanges();
    const propertyElements = fixture.debugElement.queryAll(By.css('.property__value'));

    // Assert    
    expect(propertyElements.length).toBe(Object.keys(component.properties).length);
  });
});
