import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  public showSpinner: Observable<boolean>

  constructor(private readonly spinnerService: SpinnerService) {
    this.showSpinner = this.spinnerService.showSpinner$;
  }
}
