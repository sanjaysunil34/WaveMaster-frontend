import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  baseUrl: string = "http://localhost:3000"

  httpHeader={
    headers:new HttpHeaders({
      'Content-Type': 'application/json',      
    })
  }

  constructor(private httpClient:HttpClient) { }

  getPortName() : Observable<string[]>{
    return this.httpClient.get<string[]>(this.baseUrl + '/Configuration')
    .pipe(
      catchError(this.httpError)
    );
  }

  connect(object: Object) : Observable<Object>{
    return  this.httpClient.post<Object>(this.baseUrl + '/Configuration/connect', JSON.stringify(object), this.httpHeader)
    .pipe(
      catchError(this.httpError)
    );
  }

  disconnect() : Observable<Object>{
    return  this.httpClient.post<Object>(this.baseUrl + '/Configuration/disconnect',{} ,this.httpHeader)
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
