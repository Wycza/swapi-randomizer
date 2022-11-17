import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDetailsComponent } from './card-details.component';
import { MatCardModule } from '@angular/material/card';

describe('CardDetailsComponent', () => {
  let component: CardDetailsComponent;
  let fixture: ComponentFixture<CardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardDetailsComponent],
      imports: [MatCardModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
