import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, delay, EMPTY, forkJoin, Observable, of, retryWhen, switchMap, tap, throwError } from "rxjs";
import { SwapiService } from "src/app/api/swapi.service";
import { HttpErrorResponseExtended } from "src/app/models/httpError.model";
import { IStarshipModel } from "src/app/models/starship.model";
import { generateTwoDifferentNumbers } from "src/app/utils/numberGenerator";
import { FetchStarshipsData } from "./starships.action";

export interface IStateDataModel {
  [key: string]: {
    details: IStarshipModel,
    wonBattlesNumber: number;
  }
}

export interface IStarshipsStateModel {
  firstResultId: string;
  secondResultId: string;
  currentWinnerId: string;
  data: IStateDataModel
}

@State<IStarshipsStateModel>({
  name: 'starshipsState',
  defaults: {
    firstResultId: '',
    secondResultId: '',
    currentWinnerId: '',
    data: {},
  }
})
@Injectable()
export class StarshipsState {
  bannedIds: number[] = [];

  constructor(private readonly swapiService: SwapiService) { }

  @Selector()
  static getWonBattlesNumber(state: IStarshipsStateModel): (starshipId: string) => number {
    return (starshipId: string): number => {
      return state.data[starshipId]?.wonBattlesNumber || 0;
    }
  }

  @Selector()
  static getStarshipDetails(state: IStarshipsStateModel): (starshipId: string) => IStarshipModel {
    return (starshipId: string): IStarshipModel => {
      return state.data[starshipId]?.details || {};
    }
  }

  @Selector()
  static getWinnerName(state: IStarshipsStateModel): string {
    return state.currentWinnerId
      ? state.data[state.currentWinnerId].details.name
      : '';
  }

  @Action(FetchStarshipsData)
  fetchStarshipsData(ctx: StateContext<IStarshipsStateModel>, action: FetchStarshipsData) {
    const state = ctx.getState();

    let retry = 0;
    let [firstId, secondId] = generateTwoDifferentNumbers(1, 15, this.bannedIds);

    let request1: Observable<IStarshipModel> = this.createRequestCheckCache(state, firstId, 1);
    let request2: Observable<IStarshipModel> = this.createRequestCheckCache(state, secondId, 2);

    return of(EMPTY)
      .pipe(
        switchMap(_ => forkJoin([request1, request2])),
        catchError(err => {
          retry++;

          if (retry < 5) {
            return throwError(() => err);
          }

          return EMPTY;
        }),
        retryWhen((err: Observable<HttpErrorResponseExtended>) => err
          .pipe(
            tap((e: HttpErrorResponseExtended) => {
              if (e.requestNumber === 1) {
                this.bannedIds.push(firstId);
                firstId += 1;
                request1 = this.createRequestCheckCache(state, firstId, 1);
              }

              if (e.requestNumber === 2) {
                this.bannedIds.push(secondId);
                secondId += 1;
                request2 = this.createRequestCheckCache(state, secondId, 2);
              }
            }),
            delay(200)
          )
        ),

        tap((res: IStarshipModel[]) => {
          const winnerId = this.determineWinnerId(res);

          ctx.patchState({
            ...state,
            currentWinnerId: winnerId.toString(),
            firstResultId: firstId.toString(),
            secondResultId: secondId.toString(),
            data: {
              ...state.data,
              [firstId]: {
                ...state.data[firstId],
                details: res[0],
                wonBattlesNumber: winnerId === firstId
                  ? (state.data[firstId]?.wonBattlesNumber || 0) + 1
                  : (state.data[firstId]?.wonBattlesNumber || 0),
              },
              [secondId]: {
                ...state.data[secondId],
                details: res[1],
                wonBattlesNumber: winnerId === secondId
                  ? (state.data[secondId]?.wonBattlesNumber || 0) + 1
                  : (state.data[secondId]?.wonBattlesNumber || 0),
              }
            }
          });
        })
      );
  }

  private determineWinnerId(res: IStarshipModel[]): number {
    let winnerId = -1

    if (Number(res[0].length) > Number(res[1].length)) {
      winnerId = Number(res[0].id);
    } else if (Number(res[0].length) < Number(res[1].length)) {
      winnerId = Number(res[1].id);
    }

    return winnerId;
  }

  private createRequestCheckCache(state: IStarshipsStateModel, id: number, requestNumber: number): Observable<IStarshipModel> {
    let request: Observable<IStarshipModel>;

    if (state.data[`${id}`]) {
      request = of(state.data[`${id}`].details);
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