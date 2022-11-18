import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinnerOutputComponent } from './winner-output.component';

describe('WinnerOutputComponent', () => {
  let component: WinnerOutputComponent;
  let fixture: ComponentFixture<WinnerOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WinnerOutputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WinnerOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
