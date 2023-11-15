import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  baseUrl: string = "http://localhost:3000"

  httpHeader={
    headers:new HttpHeaders({
      'Content-Type': 'application/json',      
    })
  }

  constructor(private httpClient:HttpClient) { }

  testComponent(command: string) : Observable<string>{
    return this.httpClient.post<string>(this.baseUrl + '/test', JSON.stringify(command), this.httpHeader)
    .pipe(
      catchError(this.httpError)
    );
  }

  httpError(error: HttpErrorResponse) {
      
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    } else {
      msg = `Error Code : ${error.status}\n${error.error}`;
    }
    console.log(msg);
    return throwError(msg);
  }
}
