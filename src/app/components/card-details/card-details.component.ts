import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IDictionary } from 'src/app/models/dictionary.model';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDetailsComponent {
  @Input() title = '';
  @Input() wonBattles = 0;
  @Input() properties: IDictionary<any> = {};

  cardByTitle(): string {
    return this.title;
  }
}
