import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { SwapiType } from 'src/app/enums/swapiType.enum';
import { FetchStarshipsData, FetchPeopleData } from 'src/app/store/game/game.action';
import { GameState } from 'src/app/store/game/game.state';

@Component({
  selector: 'app-play-button',
  templateUrl: './play-button.component.html',
  styleUrls: ['./play-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayButtonComponent implements OnDestroy, OnInit {
  private destroy: Subject<void> = new Subject<void>();
  private selectedGameMode: SwapiType = SwapiType.People;

  constructor(private readonly store: Store) { }

  ngOnInit(): void {
    this.onSelectedGameChange();
  }

  ngOnDestroy(): void {
    this.destroy.complete();
    this.destroy.unsubscribe();
  }

  onSelectedGameChange(): void {
    this.store.select(GameState.getCurrentGameMode)
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe((mode) => { this.selectedGameMode = mode })
  }

  fetchData(): void {
    switch (this.selectedGameMode) {
      case SwapiType.People: {
        this.store.dispatch(new FetchPeopleData());
        break;
      }
      case SwapiType.Starships: {
        this.store.dispatch(new FetchStarshipsData());
        break;
      }
      default:
        break;
    }
  }
}
