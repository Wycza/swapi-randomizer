import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, delay, EMPTY, forkJoin, Observable, of, retryWhen, switchMap, tap, throwError } from "rxjs";
import { SwapiService } from "src/app/api/swapi.service";
import { HttpErrorResponseExtended } from "src/app/models/httpError.model";
import { IPeopleModel } from "src/app/models/people.model";
import { generateTwoDifferentNumbers } from "src/app/utils/numberGenerator";
import { FetchPeopleData } from "./people.action";

export interface IStateDataModel {
  [key: string]: {
    details: IPeopleModel,
    wonBattlesNumber: number;
  }
}

export interface IPeopleStateModel {
  firstResultId: string;
  secondResultId: string;
  currentWinnerId: string;
  data: IStateDataModel
}

@State<IPeopleStateModel>({
  name: 'peopleState',
  defaults: {
    firstResultId: '',
    secondResultId: '',
    currentWinnerId: '',
    data: {},
  }
})
@Injectable()
export class PeopleState {
  bannedIds: number[] = [];

  constructor(private readonly swapiService: SwapiService) { }

  @Selector()
  static getWonBattlesNumber(state: IPeopleStateModel): (personId: string) => number {
    return (personId: string): number => {
      return state.data[personId]?.wonBattlesNumber || 0;
    }
  }

  @Selector()
  static getPersonDetails(state: IPeopleStateModel): (personId: string) => IPeopleModel {
    return (personId: string): IPeopleModel => {
      return state.data[personId]?.details || {};
    }
  }

  @Selector()
  static getWinnerName(state: IPeopleStateModel): string {
    return state.currentWinnerId
      ? state.data[state.currentWinnerId].details.name
      : '';
  }

  @Action(FetchPeopleData)
  fetchPeopleData(ctx: StateContext<IPeopleStateModel>, action: FetchPeopleData) {
    const state = ctx.getState();

    let retry = 0;
    let [firstId, secondId] = generateTwoDifferentNumbers(1, 15, this.bannedIds);

    let request1: Observable<IPeopleModel> = this.createRequestCheckCache(state, firstId, 1);
    let request2: Observable<IPeopleModel> = this.createRequestCheckCache(state, secondId, 2);

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
        tap((res: IPeopleModel[]) => {
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

  private determineWinnerId(res: IPeopleModel[]): number {
    let winnerId = -1

    if (Number(res[0].mass) > Number(res[1].mass)) {
      winnerId = Number(res[0].id);
    } else if (Number(res[0].mass) < Number(res[1].mass)) {
      winnerId = Number(res[1].id);
    }

    return winnerId;
  }

  private createRequestCheckCache(state: IPeopleStateModel, id: number, requestNumber: number): Observable<IPeopleModel> {
    let request: Observable<IPeopleModel>;

    if (state.data[`${id}`]) {
      request = of(state.data[`${id}`].details);
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
}