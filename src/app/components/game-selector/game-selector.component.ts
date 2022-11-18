import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SwapiType } from 'src/app/enums/swapiType.enum';

@Component({
  selector: 'app-game-selector',
  templateUrl: './game-selector.component.html',
  styleUrls: ['./game-selector.component.scss']
})
export class GameSelectorComponent {
  @Input() selectedGameValue: SwapiType = SwapiType.Starships;
  @Output() selectedGameValueChange: EventEmitter<SwapiType> = new EventEmitter<SwapiType>();
  SwapiType = SwapiType;
}
