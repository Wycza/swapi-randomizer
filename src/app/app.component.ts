import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ResponseMessageType } from './enums/responseMessageType.enum';
import { SwapiType } from './enums/swapiType.enum';
import { IPeopleModel } from './models/people.model';
import { IStarshipModel } from './models/starship.model';
import { FetchPeopleData } from './store/people/people.action';
import { IPeopleStateModel, PeopleState } from './store/people/people.state';
import { FetchStarshipsData } from './store/starships/starships.action';
import { IStarshipsStateModel, StarshipsState } from './store/starships/starships.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  private destroy: Subject<void> = new Subject<void>();
  public wonBattlesResultFirst = 0;
  public wonBattlesResultSecond = 0;
  public firstResult: IPeopleModel | IStarshipModel | null = null;
  public secondResult: IPeopleModel | IStarshipModel | null = null;
  public battleWinnerName$: Observable<string> = new Observable();
  public selectedGame = SwapiType.Starships;

  public starshipBannedNumbers: number[] = [];
  public peopleBannedNumbers: number[] = [];

  constructor(private readonly store: Store) {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.destroy.complete();
    this.destroy.unsubscribe();
  }

  fetchData(): void {
    switch (this.selectedGame) {
      case SwapiType.People: {
        this.fetchPeopleData();
        break;
      }
      case SwapiType.Starships: {
        this.fetchStarshipsData();
        break;
      }
      default:
        break;
    }
  }

  fetchStarshipsData(): void {
    this.battleWinnerName$ = this.store.select(StarshipsState.getWinnerName);

    this.store.dispatch(new FetchStarshipsData())
      .pipe(
        takeUntil(this.destroy),
      )
      .subscribe({
        next: (res: { starshipsState: IStarshipsStateModel }) => this.onFetchStarshipSuccess(res.starshipsState),
        error: (err: HttpErrorResponse) => this.handleApiError(err, this.starshipBannedNumbers)
      });
  }

  onFetchStarshipSuccess(state: IStarshipsStateModel) {
    this.firstResult = this.store.selectSnapshot(StarshipsState.getStarshipDetails)(state.firstResultId);
    this.secondResult = this.store.selectSnapshot(StarshipsState.getStarshipDetails)(state.secondResultId);

    this.wonBattlesResultFirst = this.store.selectSnapshot(StarshipsState.getWonBattlesNumber)(state.firstResultId);
    this.wonBattlesResultSecond = this.store.selectSnapshot(StarshipsState.getWonBattlesNumber)(state.secondResultId);
  }

  fetchPeopleData(): void {
    this.battleWinnerName$ = this.store.select(PeopleState.getWinnerName);

    this.store.dispatch(new FetchPeopleData())
      .pipe(
        takeUntil(this.destroy),
      )
      .subscribe({
        next: (res: { peopleState: IPeopleStateModel }) => this.onFetchPeopleSuccess(res.peopleState),
        error: (err: HttpErrorResponse) => this.handleApiError(err, this.peopleBannedNumbers)
      });
  }

  onFetchPeopleSuccess(state: IPeopleStateModel) {
    this.firstResult = this.store.selectSnapshot(StarshipsState.getStarshipDetails)(state.firstResultId);
    this.secondResult = this.store.selectSnapshot(StarshipsState.getStarshipDetails)(state.secondResultId);

    this.wonBattlesResultFirst = this.store.selectSnapshot(StarshipsState.getWonBattlesNumber)(state.firstResultId);
    this.wonBattlesResultSecond = this.store.selectSnapshot(StarshipsState.getWonBattlesNumber)(state.secondResultId);
  }

  handleApiError(err: HttpErrorResponse, bannedNumbers: number[]): void {
    if (err.error.message === ResponseMessageType.NotFound && err.url) {

      const number = this.parseIncorrectNumber(err.url);
      bannedNumbers.push(number);
    }
  }

  parseIncorrectNumber(url: string): number {
    const urlParts = url.split('/');

    if (urlParts?.length) {
      return Number(urlParts[urlParts.length - 1]);
    }

    return 0;
  }

  onGameSelected(type: SwapiType): void {
    this.selectedGame = type;
  }
}
