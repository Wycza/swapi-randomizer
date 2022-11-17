import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IPeopleModel } from './models/people.model';
import { FetchPeopleData } from './store/people/people.action';
import { IPeopleStateModel, PeopleState } from './store/people/people.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  private destroy: Subject<void> = new Subject<void>();
  public wonBattlesResultFirst = 0;
  public wonBattlesResultSecond = 0;
  public firstResult: IPeopleModel | null = null;
  public secondResult: IPeopleModel | null = null;
  public battleWinnerName$: Observable<string> = new Observable();

  constructor(private readonly store: Store) {
    this.fetchData();
    this.battleWinnerName$ = this.store.select(PeopleState.getWinnerName);
  }

  ngOnDestroy(): void {
    this.destroy.complete();
    this.destroy.unsubscribe();
  }

  fetchData() {
    const [num1, num2] = this.randomNumbers();

    this.store.dispatch(new FetchPeopleData(num1, num2))
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe((res: { peopleState: IPeopleStateModel }) => {
        this.firstResult = this.store.selectSnapshot(PeopleState.getPersonDetails)(res.peopleState.firstResultId);
        this.secondResult = this.store.selectSnapshot(PeopleState.getPersonDetails)(res.peopleState.secondResultId);

        this.wonBattlesResultFirst = this.store.selectSnapshot(PeopleState.getWonBattlesNumber)(num1.toString());
        this.wonBattlesResultSecond = this.store.selectSnapshot(PeopleState.getWonBattlesNumber)(num2.toString());
      });
  }

  randomNumbers(): number[] {
    const num1 = Math.round(Math.random() * 10) + 1;
    let num2 = Math.round(Math.random() * 10) + 1;

    if (num1 === num2) {
      num2 += 1;
    }

    return [num1, num2];
  }
}
