import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private _showSpinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private showSpinner$: Observable<boolean> = this._showSpinner.asObservable();

  setLoading(loading: boolean): void {
    this._showSpinner.next(loading);
  }

  spinnerValue(): Observable<boolean> {
    return this.showSpinner$;
  }
}
