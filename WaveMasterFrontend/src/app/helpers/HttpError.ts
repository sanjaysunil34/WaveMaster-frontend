import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export const HttpError = (error: HttpErrorResponse) => {
      
    let msg = '';

    //console.log(error);    
    // if (error.error instanceof ErrorEvent) {
    //   msg = error.message;
    // } else {
    //   msg = `Error Code : ${error.status}\n${error.error.error}`;
    // }
    msg = error.error.message;
    console.log(msg);

    return throwError(msg);
}