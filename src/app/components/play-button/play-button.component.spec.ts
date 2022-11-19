import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { SwapiType } from 'src/app/enums/swapiType.enum';
import { FetchPeopleData, FetchStarshipsData } from 'src/app/store/game/game.action';
import { GameState } from 'src/app/store/game/game.state';

import { PlayButtonComponent } from './play-button.component';

describe('PlayButtonComponent', () => {
  let component: PlayButtonComponent;
  let fixture: ComponentFixture<PlayButtonComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayButtonComponent],
      imports: [
        NgxsModule.forRoot([GameState], {
          developmentMode: true,
        }),
        HttpClientTestingModule,
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PlayButtonComponent);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fetch people data', () => {
    // Arrange
    const spy = spyOn(store, 'dispatch');

    // Act
    fixture.detectChanges();
    component['selectedGameMode'] = SwapiType.People;
    component.fetchData();

    // Assert    
    expect(spy).toHaveBeenCalledWith(new FetchPeopleData());
  });

  it('should fetch starships data', () => {
    // Arrange
    const spy = spyOn(store, 'dispatch');

    // Act
    fixture.detectChanges();
    component['selectedGameMode'] = SwapiType.Starships;
    component.fetchData();

    // Assert    
    expect(spy).toHaveBeenCalledWith(new FetchStarshipsData());
  });

  it('should set game mode if changed', () => {
    // Arrange
    const newMode = SwapiType.Starships;
    component['selectedGameMode'] = SwapiType.People;
    spyOn(store, 'select').and.returnValue(of(newMode));

    // Act
    fixture.detectChanges();

    // Assert    
    expect(component['selectedGameMode']).toBe(newMode);
  });
});
