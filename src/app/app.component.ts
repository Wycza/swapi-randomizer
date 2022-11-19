import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { IPeopleModel } from './models/people.model';
import { IStarshipModel } from './models/starship.model';
import { GameState, IResourceModel } from './store/game/game.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private destroy: Subject<void> = new Subject<void>();
  public firstResult: IResourceModel<IPeopleModel | IStarshipModel> | null = null;
  public secondResult: IResourceModel<IPeopleModel | IStarshipModel> | null = null;

  constructor(private readonly store: Store) {
    this.onFirstResultChanged();
    this.onSecondResultChanged();
  }

  ngOnDestroy(): void {
    this.destroy.complete();
    this.destroy.unsubscribe();
  }

  onFirstResultChanged(): void {
    this.store.select(GameState.getFirstResult)
      .pipe(
        takeUntil(this.destroy),
      )
      .subscribe((res) => this.firstResult = res);
  }

  onSecondResultChanged(): void {
    this.store.select(GameState.getSecondResult)
      .pipe(
        takeUntil(this.destroy),
      )
      .subscribe((res) => this.secondResult = res);
  }
}
