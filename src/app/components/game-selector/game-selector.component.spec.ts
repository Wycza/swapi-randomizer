import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgxsModule, Store } from '@ngxs/store';
import { SwapiType } from 'src/app/enums/swapiType.enum';
import { GameState } from 'src/app/store/game/game.state';

import { GameSelectorComponent } from './game-selector.component';

describe('GameSelectorComponent', () => {
  let component: GameSelectorComponent;
  let fixture: ComponentFixture<GameSelectorComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameSelectorComponent],
      imports: [
        NgxsModule.forRoot([GameState], {
          developmentMode: true,
        }),
        HttpClientTestingModule,
        FormsModule,
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GameSelectorComponent);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should change game type', () => {
    // Arrange
    const newMode = SwapiType.Starships;

    store.reset({
      ...store.snapshot(),
      gameState: {
        currentGameMode: SwapiType.People,
      }
    });

    // Act
    fixture.detectChanges();
    component.onGameChange(newMode);
    const mode = store.selectSnapshot(GameState.getCurrentGameMode);

    // Assert    
    expect(mode).toBe(newMode);
  });
});
