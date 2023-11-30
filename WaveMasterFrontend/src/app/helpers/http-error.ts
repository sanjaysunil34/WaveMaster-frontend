import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

/**
 * Function used for processing the caught http errors
 * @param error - The http errors caught.
 * @returns The error message
 */
export const httpError = (error: HttpErrorResponse) => {      
    let msg = '';
    msg = error.error.message;
    console.log(error);
    return throwError(msg);
}