import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export const HttpError = (error: HttpErrorResponse) => {
      
    let msg = '';
    if(error.error){
        msg = `Error Code : ${error.status}\n${error.error}`;
    }else{
        msg = `Error Code : ${error.status}\n${error.message}`;
    }
    return throwError(msg);
}