import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { forkJoin, Observable, of, tap } from "rxjs";
import { SwapiService } from "src/app/api/swapi.service";
import { IPeopleModel } from "src/app/models/people.model";
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

    let person1: Observable<IPeopleModel>;
    let person2: Observable<IPeopleModel>;

    if (state.data[`${action.id1}`]) {
      person1 = of(state.data[`${action.id1}`].details);
    } else {
      person1 = this.swapiService.getPeople(action.id1);
    }

    if (state.data[`${action.id2}`]) {
      person2 = of(state.data[`${action.id2}`].details);
    } else {
      person2 = this.swapiService.getPeople(action.id2);
    }

    return forkJoin([person1, person2]).pipe(
      tap((res: IPeopleModel[]) => {
        let winnerId = -1

        if (Number(res[0].mass) > Number(res[1].mass)) {
          winnerId = action.id1;
        } else if (Number(res[0].mass) < Number(res[1].mass)) {
          winnerId = action.id2;
        }

        ctx.patchState({
          ...state,
          currentWinnerId: winnerId.toString(),
          firstResultId: action.id1.toString(),
          secondResultId: action.id2.toString(),
          data: {
            ...state.data,
            [action.id1]: {
              ...state.data[action.id1],
              details: res[0],
              wonBattlesNumber: winnerId === action.id1
                ? (state.data[action.id1]?.wonBattlesNumber || 0) + 1
                : (state.data[action.id1]?.wonBattlesNumber || 0),
            },
            [action.id2]: {
              ...state.data[action.id2],
              details: res[1],
              wonBattlesNumber: winnerId === action.id2
                ? (state.data[action.id2]?.wonBattlesNumber || 0) + 1
                : (state.data[action.id2]?.wonBattlesNumber || 0),
            }
          }
        });
      })
    )
  }
}