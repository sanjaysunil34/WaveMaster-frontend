import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignalData } from '../models/signalData';
import { Observable, catchError, throwError } from 'rxjs';
import { httpError } from '../helpers/HttpError';
import { BaseUrl, HttpHeader } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class GenerateService {
  // baseUrl: string = "http://localhost:3000"

  // httpHeader={
  //   headers:new HttpHeaders({
  //     'Content-Type': 'application/json',      
  //   })
  // }

  constructor(private httpClient:HttpClient) { }

  generateWave(signalData : SignalData) : Observable<SignalData>{
    console.log(signalData);
    
    return this.httpClient.post<SignalData>(BaseUrl + "/generate/start",JSON.stringify(signalData),HttpHeader())
    .pipe(
      catchError(err => httpError(err))
    );
  }

  stopGenerateWave() : Observable<Object>{
       
    return this.httpClient.post<Object>(BaseUrl + "/generate/stop",{},HttpHeader())
    .pipe(
      catchError(err => httpError(err))
    );
  }

  restoreWave() : Observable<SignalData>{
    return this.httpClient.get<SignalData>(BaseUrl + "/generate")
    .pipe(
      catchError(err => httpError(err))
    );
  }
}
