import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export const httpError = (error: HttpErrorResponse) => {
      
    let msg = '';
    console.log(error);    
    // if (error.error instanceof ErrorEvent) {
    //   msg = error.message;
    // } else {
    //   msg = `Error Code : ${error.status}\n${error.error.error}`;
    // }
    msg = `Error Code : ${error.status}\n${error.message}`;
    console.log(msg);
    return throwError(msg);
}