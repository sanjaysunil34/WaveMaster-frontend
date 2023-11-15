import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignalData } from '../models/signalData';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenerateService {
  baseUrl: string = "http://localhost:3000"

  httpHeader={
    headers:new HttpHeaders({
      'Content-Type': 'application/json',      
    })
  }

  constructor(private httpClient:HttpClient) { }

  generateWave(signalData : SignalData) : Observable<SignalData>{
    return this.httpClient.post<SignalData>(this.baseUrl + "/generate",JSON.stringify(signalData),this.httpHeader)
    .pipe(
      catchError(this.httpError)
    );
  }

  restoreWave() : Observable<SignalData>{
    return this.httpClient.get<SignalData>(this.baseUrl + "/generate")
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
