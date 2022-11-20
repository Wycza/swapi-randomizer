import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { SwapiType } from 'src/app/enums/swapiType.enum';
import { SetGameMode } from './game.action';
import { GameState, IGameStateModel } from './game.state';

describe('GameState', () => {
  let store: Store;
  const initialStoreState: IGameStateModel = {
    currentGameMode: SwapiType.People,
    lastGameMode: SwapiType.People,
    firstResultId: '',
    secondResultId: '',
    currentWinnerId: '',
    people: {},
    starships: {},
    isDraw: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([GameState]),
        HttpClientTestingModule,
      ]
    });

    store = TestBed.inject(Store);
  });

  it('it should return battle result details if there was a draw', () => {
    // Arrange
    const drawStatus = true;

    store.reset({
      ...store.snapshot(),
      gameState: {
        ...initialStoreState,
        isDraw: drawStatus,
      }
    });

    // Act
    const battleResult = store.selectSnapshot(GameState.getBattleResult);

    // Assert
    expect(battleResult.isDraw).toBe(drawStatus);
    expect(battleResult.name).toBe('');
  });

  it('it should return battle result details if there was a draw but incorrect winnerId was set', () => {
    // Arrange
    const drawStatus = true;
    const winnerId = -1;

    store.reset({
      ...store.snapshot(),
      gameState: {
        ...initialStoreState,
        currentWinnerId: winnerId,
        isDraw: drawStatus,
      }
    });

    // Act
    const battleResult = store.selectSnapshot(GameState.getBattleResult);

    // Assert
    expect(battleResult.isDraw).toBe(drawStatus);
    expect(battleResult.name).toBe('');
  });

  it('it should fetch winner details if there wasn\'t a draw', () => {
    // Arrange
    const drawStatus = false;
    const name = 'Test';
    const winnerId = 1;

    store.reset({
      ...store.snapshot(),
      gameState: {
        ...initialStoreState,
        currentWinnerId: winnerId,
        people: {
          [winnerId.toString()]: {
            details: {
              name,
            },
          }
        },
        isDraw: drawStatus,
      }
    });

    // Act
    const battleResult = store.selectSnapshot(GameState.getBattleResult);

    // Assert
    expect(battleResult.isDraw).toBe(drawStatus);
    expect(battleResult.name).toBe(name);
  });

  it('it should get current game mode', () => {
    // Arrange
    const currentGameMode = SwapiType.Starships;

    store.reset({
      ...store.snapshot(),
      gameState: {
        ...initialStoreState,
        currentGameMode: currentGameMode,
      }
    });

    // Act
    const gameMode = store.selectSnapshot(GameState.getCurrentGameMode);

    // Assert
    expect(gameMode).toBe(currentGameMode);
  });

  it('it should get first people result details if people game mode was the last one', () => {
    // Arrange
    const firstResultId = "1";
    const secondResultId = "2";
    const personFirstName = 'Name_Person_First';
    const personSecondName = 'Name_Person_Second';
    const starshipFirstName = 'Name_Starship_First';

    store.reset({
      ...store.snapshot(),
      gameState: {
        currentGameMode: SwapiType.People,
        lastGameMode: SwapiType.People,
        firstResultId: firstResultId,
        secondResultId: secondResultId,
        currentWinnerId: '',
        people: {
          [`${firstResultId}`]: {
            details: {
              name: personFirstName,
            },
          },
          [`${secondResultId}`]: {
            details: {
              name: personSecondName,
            },
          },
        },
        starships: {
          [`${firstResultId}`]: {
            details: {
              name: starshipFirstName,
            },
          },
        },
        isDraw: false,
      }
    });

    // Act
    const result = store.selectSnapshot(GameState.getFirstResult);

    // Assert
    expect(result?.details.name).toBe(personFirstName);
  });

  it('it should get second people result details if people game mode was the last one', () => {
    // Arrange
    const firstResultId = "1";
    const secondResultId = "2";
    const personFirstName = 'Name_Person_First';
    const personSecondName = 'Name_Person_Second';
    const starshipFirstName = 'Name_Starship_First';

    store.reset({
      ...store.snapshot(),
      gameState: {
        currentGameMode: SwapiType.People,
        lastGameMode: SwapiType.People,
        firstResultId: firstResultId,
        secondResultId: secondResultId,
        currentWinnerId: '',
        people: {
          [`${firstResultId}`]: {
            details: {
              name: personFirstName,
            },
          },
          [`${secondResultId}`]: {
            details: {
              name: personSecondName,
            },
          },
        },
        starships: {
          [`${firstResultId}`]: {
            details: {
              name: starshipFirstName,
            },
          },
        },
        isDraw: false,
      }
    });

    // Act
    const result = store.selectSnapshot(GameState.getSecondResult);

    // Assert
    expect(result?.details.name).toBe(personSecondName);
  });

  it('it should get first people result details if starships game mode was the last one', () => {
    // Arrange
    const firstResultId = "1";
    const secondResultId = "2";
    const personFirstName = 'Name_Person_First';
    const personSecondName = 'Name_Person_Second';
    const starshipFirstName = 'Name_Starship_First';

    store.reset({
      ...store.snapshot(),
      gameState: {
        currentGameMode: SwapiType.People,
        lastGameMode: SwapiType.Starships,
        firstResultId: firstResultId,
        secondResultId: secondResultId,
        currentWinnerId: '',
        people: {
          [`${firstResultId}`]: {
            details: {
              name: personFirstName,
            },
          },
          [`${secondResultId}`]: {
            details: {
              name: personSecondName,
            },
          },
        },
        starships: {
          [`${firstResultId}`]: {
            details: {
              name: starshipFirstName,
            },
          },
        },
        isDraw: false,
      }
    });

    // Act
    const result = store.selectSnapshot(GameState.getFirstResult);

    // Assert
    expect(result?.details.name).toBe(starshipFirstName);
  });

  it('it should set correct game mode', () => {
    // Arrange
    const expectedGameMode = SwapiType.Starships;

    store.reset({
      ...store.snapshot(),
      gameState: {
        ...initialStoreState,
      }
    });

    // Act
    store.dispatch(new SetGameMode(expectedGameMode));
    const gameMode = store.selectSnapshot(GameState.getCurrentGameMode);

    // Assert
    expect(gameMode).toBe(expectedGameMode);
  });
});