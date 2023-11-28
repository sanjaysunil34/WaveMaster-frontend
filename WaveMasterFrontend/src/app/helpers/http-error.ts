import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export const httpError = (error: HttpErrorResponse) => {
      
    let msg = '';
    msg = error.error.message;
    console.log(error);
    return throwError(msg);
}