import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent implements OnInit {
  private destroy: Subject<void> = new Subject<void>();
  public showSpinner = false;

  constructor(
    private readonly spinnerService: SpinnerService,
    private readonly cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.spinnerService.showSpinner$
      .pipe(
        takeUntil(this.destroy),
        debounceTime(300)
      )
      .subscribe((res) => {
        this.showSpinner = res;
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy.complete();
    this.destroy.unsubscribe();
  }
}
