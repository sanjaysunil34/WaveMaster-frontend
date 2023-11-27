import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignalData } from '../models/signalData';
import { Observable, catchError, throwError } from 'rxjs';
import { httpError } from '../helpers/HttpError';

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
    console.log(signalData);
    
    return this.httpClient.post<SignalData>(this.baseUrl + "/generate/start",JSON.stringify(signalData),this.httpHeader)
    .pipe(
      catchError(httpError)
    );
  }

  stopGenerateWave() : Observable<Object>{
       
    return this.httpClient.post<Object>(this.baseUrl + "/generate/stop",{},this.httpHeader)
    .pipe(
      catchError(httpError)
    );
  }

  restoreWave() : Observable<SignalData>{
    return this.httpClient.get<SignalData>(this.baseUrl + "/generate")
    .pipe(
      catchError(httpError)
    );
  }
}
