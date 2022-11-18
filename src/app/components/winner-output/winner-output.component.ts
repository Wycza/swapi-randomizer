import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-winner-output',
  templateUrl: './winner-output.component.html',
  styleUrls: ['./winner-output.component.scss']
})
export class WinnerOutputComponent {
  @Input() name: string | null = '';
}
