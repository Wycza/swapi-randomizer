import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SwapiType } from 'src/app/enums/swapiType.enum';
import { SetGameMode } from 'src/app/store/game/game.action';
import { GameState } from 'src/app/store/game/game.state';

@Component({
  selector: 'app-game-selector',
  templateUrl: './game-selector.component.html',
  styleUrls: ['./game-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSelectorComponent {
  SwapiType = SwapiType;
  selectedGameValue: Observable<SwapiType>;

  constructor(private readonly store: Store) {
    this.selectedGameValue = this.store.select(GameState.getCurrentGameMode);
  }

  onGameChange(gameType: SwapiType): void {
    this.store.dispatch(new SetGameMode(gameType));
  }
}
