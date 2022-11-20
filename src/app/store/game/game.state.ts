import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, delay, EMPTY, forkJoin, Observable, of, retryWhen, switchMap, tap, throwError } from "rxjs";
import { SwapiService } from "src/app/api/swapi.service";
import { SwapiType } from "src/app/enums/swapiType.enum";
import { IBattleResultModel } from "src/app/models/battleResult.model";
import { HttpErrorResponseExtended } from "src/app/models/httpError.model";
import { IPeopleModel } from "src/app/models/people.model";
import { IStarshipModel } from "src/app/models/starship.model";
import { generateTwoDifferentNumbers } from "src/app/utils/numberGenerator";
import { FetchPeopleData, FetchStarshipsData, SetGameMode } from "./game.action";

type ISwapiGameStatePeopleType = {
  [prop in typeof SwapiType.People]: IResourceDataModel<IPeopleModel>;
}

type ISwapiGameStateStarshipsType = {
  [prop in typeof SwapiType.Starships]: IResourceDataModel<IStarshipModel>;
}

type IResourcesTypes = ISwapiGameStatePeopleType & ISwapiGameStateStarshipsType;

export interface IResourceModel<T> {
  details: T;
  wonBattlesNumber: number;
}

export interface IResourceDataModel<T> {
  [key: string]: IResourceModel<T>
}
export interface IGameStateModel extends IResourcesTypes {
  currentGameMode: SwapiType;
  lastGameMode: SwapiType;
  firstResultId: string;
  secondResultId: string;
  currentWinnerId: string;
  isDraw: boolean;
}

@State<IGameStateModel>({
  name: 'gameState',
  defaults: {
    currentGameMode: SwapiType.People,
    lastGameMode: SwapiType.People,
    firstResultId: '',
    secondResultId: '',
    currentWinnerId: '',
    people: {},
    starships: {},
    isDraw: false,
  }
})
@Injectable()
export class GameState {
  // We want to keep ids of resources without any results
  private readonly bannedPeopleIds: number[] = [];
  private readonly bannedStarshipIds: number[] = [];
  private readonly maxRetry = 5;

  constructor(private readonly swapiService: SwapiService) { }

  @Selector()
  static getBattleResult(state: IGameStateModel): IBattleResultModel {
    const gameMode = state.lastGameMode;
    const winnerId = state.currentWinnerId;

    const result: IBattleResultModel = {
      isDraw: state.isDraw,
      name: !state.isDraw
        ? state[gameMode][winnerId].details.name
        : '',
    }

    return result;
  }

  @Selector()
  static getCurrentGameMode(state: IGameStateModel): SwapiType {
    return state.currentGameMode;
  }

  @Selector()
  static getFirstResult(state: IGameStateModel): IResourceModel<IPeopleModel | IStarshipModel> | null {
    const gameMode = state.lastGameMode;
    const resourceId = state.firstResultId;
    
    return resourceId
      ? state[gameMode][resourceId]
      : null;
  }

  @Selector()
  static getSecondResult(state: IGameStateModel): IResourceModel<IPeopleModel | IStarshipModel> | null {
    const gameMode = state.lastGameMode;
    const resourceId = state.secondResultId;

    return resourceId
      ? state[gameMode][resourceId]
      : null;
  }

  @Action(SetGameMode)
  setGameMode(ctx: StateContext<IGameStateModel>, action: SetGameMode) {
    ctx.patchState({
      currentGameMode: action.mode,
    })
  }

  @Action(FetchPeopleData)
  fetchPeopleData(ctx: StateContext<IGameStateModel>) {
    const state = ctx.getState();

    let retry = 0;
    let [firstId, secondId] = generateTwoDifferentNumbers(1, 30, this.bannedPeopleIds);

    let request1: Observable<IPeopleModel> = this.createPeopleRequestCheckCache(state, firstId, 1);
    let request2: Observable<IPeopleModel> = this.createPeopleRequestCheckCache(state, secondId, 2);

    return of(EMPTY)
      .pipe(
        switchMap(_ => forkJoin([request1, request2])),
        catchError(err => {
          retry++;

          if (retry < this.maxRetry) {
            return throwError(() => err);
          }

          return EMPTY;
        }),
        retryWhen((err: Observable<HttpErrorResponseExtended>) => err
          .pipe(
            tap((e: HttpErrorResponseExtended) => {
              if (e.requestNumber === 1) {
                this.bannedPeopleIds.push(firstId);
                firstId += 1;
                request1 = this.createPeopleRequestCheckCache(state, firstId, 1);
              }

              if (e.requestNumber === 2) {
                this.bannedPeopleIds.push(secondId);
                secondId += 1;
                request2 = this.createPeopleRequestCheckCache(state, secondId, 2);
              }
            }),
            delay(200)
          )
        ),
        tap((res: IPeopleModel[]) => {
          const winnerId = this.determinePeopleWinnerId(res);

          ctx.patchState({
            ...state,
            lastGameMode: SwapiType.People,
            currentWinnerId: winnerId.toString(),
            firstResultId: firstId.toString(),
            secondResultId: secondId.toString(),
            isDraw: winnerId === '' ? true : false,
            people: {
              ...state.people,
              [firstId]: {
                ...state.people[firstId],
                details: res[0],
                wonBattlesNumber: winnerId === firstId.toString()
                  ? (state.people[firstId]?.wonBattlesNumber || 0) + 1
                  : (state.people[firstId]?.wonBattlesNumber || 0),
              },
              [secondId]: {
                ...state.people[secondId],
                details: res[1],
                wonBattlesNumber: winnerId === secondId.toString()
                  ? (state.people[secondId]?.wonBattlesNumber || 0) + 1
                  : (state.people[secondId]?.wonBattlesNumber || 0),
              }
            }
          });
        })
      );
  }

  @Action(FetchStarshipsData)
  fetchStarshipsData(ctx: StateContext<IGameStateModel>, action: FetchStarshipsData) {
    const state = ctx.getState();

    let retry = 0;
    let [firstId, secondId] = generateTwoDifferentNumbers(1, 20, this.bannedStarshipIds);

    let request1: Observable<IStarshipModel> = this.createStarshipsRequestCheckCache(state, firstId, 1);
    let request2: Observable<IStarshipModel> = this.createStarshipsRequestCheckCache(state, secondId, 2);

    return of(EMPTY)
      .pipe(
        switchMap(_ => forkJoin([request1, request2])),
        catchError(err => {
          retry++;

          if (retry < this.maxRetry) {
            return throwError(() => err);
          }

          return EMPTY;
        }),
        retryWhen((err: Observable<HttpErrorResponseExtended>) => err
          .pipe(
            tap((e: HttpErrorResponseExtended) => {
              if (e.requestNumber === 1) {
                this.bannedStarshipIds.push(firstId);
                firstId += 1;
                request1 = this.createStarshipsRequestCheckCache(state, firstId, 1);
              }

              if (e.requestNumber === 2) {
                this.bannedStarshipIds.push(secondId);
                secondId += 1;
                request2 = this.createStarshipsRequestCheckCache(state, secondId, 2);
              }
            }),
            delay(200)
          )
        ),
        tap((res: IStarshipModel[]) => {
          const winnerId = this.determineStarshipsWinnerId(res);

          ctx.patchState({
            ...state,
            lastGameMode: SwapiType.Starships,
            currentWinnerId: winnerId.toString(),
            firstResultId: firstId.toString(),
            secondResultId: secondId.toString(),
            isDraw: winnerId === -1 ? true : false,
            starships: {
              ...state.starships,
              [firstId]: {
                ...state.starships[firstId],
                details: res[0],
                wonBattlesNumber: winnerId === firstId
                  ? (state.starships[firstId]?.wonBattlesNumber || 0) + 1
                  : (state.starships[firstId]?.wonBattlesNumber || 0),
              },
              [secondId]: {
                ...state.starships[secondId],
                details: res[1],
                wonBattlesNumber: winnerId === secondId
                  ? (state.starships[secondId]?.wonBattlesNumber || 0) + 1
                  : (state.starships[secondId]?.wonBattlesNumber || 0),
              }
            }
          });
        })
      );
  }

  private determinePeopleWinnerId(res: IPeopleModel[]): string {
    let winnerId = '';
    const mass1 = Number(res[0].mass);
    const mass2 = Number(res[1].mass);

    if (mass1 > mass2) {
      winnerId = res[0].id;
    } else if (mass1 < mass2) {
      winnerId = res[1].id;
    }

    return winnerId;
  }

  private determineStarshipsWinnerId(res: IStarshipModel[]): number {
    let winnerId = -1;

    if (Number(res[0].length) > Number(res[1].length)) {
      winnerId = Number(res[0].id);
    } else if (Number(res[0].length) < Number(res[1].length)) {
      winnerId = Number(res[1].id);
    }

    return winnerId;
  }

  private createPeopleRequestCheckCache(state: IGameStateModel, id: number, requestNumber: number): Observable<IPeopleModel> {
    let request: Observable<IPeopleModel>;

    if (state.people[`${id}`]) {
      request = of(state.people[`${id}`].details);
    } else {
      request = this.swapiService.getPeopleById(id)
        .pipe(catchError(err => throwError(() => {
          return {
            ...err,
            requestNumber
          }
        })));
    }

    return request;
  }

  private createStarshipsRequestCheckCache(state: IGameStateModel, id: number, requestNumber: number): Observable<IStarshipModel> {
    let request: Observable<IStarshipModel>;

    if (state.starships[`${id}`]) {
      request = of(state.starships[`${id}`].details);
    } else {
      request = this.swapiService.getStarshipById(id)
        .pipe(catchError(err => throwError(() => {
          return {
            ...err,
            requestNumber
          }
        })));
    }

    return request;
  }
}