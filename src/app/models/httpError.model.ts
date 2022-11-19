import { HttpErrorResponse } from "@angular/common/http";

export interface HttpErrorResponseExtended extends HttpErrorResponse {
  requestNumber: number;
}