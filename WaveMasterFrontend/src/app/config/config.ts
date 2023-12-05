import { HttpHeaders } from "@angular/common/http";

//Base URL for sending all the http requests are defined.
export const BASE_URL = "http://localhost:3000";

/**
 * Http header to be sent in all the http requests are defined here.
 * @returns The http header.
 */
export const httpHeader = () => {
    return {
        headers:new HttpHeaders({
          'Content-Type': 'application/json',      
        })
    }
}