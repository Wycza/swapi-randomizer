import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { IBattleResultModel } from 'src/app/models/battleResult.model';
import { GameState } from 'src/app/store/game/game.state';

import { WinnerOutputComponent } from './winner-output.component';

describe('WinnerOutputComponent', () => {
  let component: WinnerOutputComponent;
  let fixture: ComponentFixture<WinnerOutputComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WinnerOutputComponent],
      imports: [
        NgxsModule.forRoot([GameState], {
          developmentMode: true
        }),
        HttpClientTestingModule,
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WinnerOutputComponent);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display draw if result is draw', () => {
    // Arrange
    spyOn(store, 'select').and.returnValue(of<IBattleResultModel>({
      isDraw: true,
      name: ''
    }));

    // Act
    fixture.detectChanges();
    const drawElement = fixture.debugElement.query(By.css('.output__draw'));
    const nameElement = fixture.debugElement.query(By.css('.output__name'));

    // Assert    
    expect(drawElement).toBeTruthy();
    expect(nameElement).toBeFalsy();
  });

  it('should display name if winner is determined', () => {
    // Arrange
    spyOn(store, 'select').and.returnValue(of<IBattleResultModel>({
      isDraw: false,
      name: 'Test'
    }));

    // Act
    fixture.detectChanges();
    const drawElement = fixture.debugElement.query(By.css('.output__draw'));
    const nameElement = fixture.debugElement.query(By.css('.output__name'));

    // Assert    
    expect(drawElement).toBeFalsy();
    expect(nameElement).toBeTruthy();
  });

  it('should hide both elements if no results', () => {
    // Arrange
    spyOn(store, 'select').and.returnValue(of(null));

    // Act
    fixture.detectChanges();
    const drawElement = fixture.debugElement.query(By.css('.output__draw'));
    const nameElement = fixture.debugElement.query(By.css('.output__name'));

    // Assert    
    expect(drawElement).toBeFalsy();
    expect(nameElement).toBeFalsy();
  });
});
