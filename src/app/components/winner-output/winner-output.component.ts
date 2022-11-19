import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IBattleResultModel } from 'src/app/models/battleResult.model';
import { GameState } from 'src/app/store/game/game.state';

@Component({
  selector: 'app-winner-output',
  templateUrl: './winner-output.component.html',
  styleUrls: ['./winner-output.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinnerOutputComponent {
  public battleResult$: Observable<IBattleResultModel> = new Observable<IBattleResultModel>();

  constructor(private readonly store: Store) {
    this.battleResult$ = this.store.select(GameState.getBattleResult);
  }
}
