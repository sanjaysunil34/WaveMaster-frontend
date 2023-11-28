import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignalData } from '../models/signal-data';
import { Observable, catchError, throwError } from 'rxjs';
import { httpError } from '../helpers/http-error';
import { BaseUrl, httpHeader } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class GenerateService {

  constructor(private httpClient:HttpClient) { }

  generateWave(signalData : SignalData) : Observable<SignalData>{    
    return this.httpClient.post<SignalData>(BaseUrl + "/generate/start",JSON.stringify(signalData),httpHeader())
    .pipe(
      catchError(err => httpError(err))
    );
  }

  stopGenerateWave() : Observable<Object>{      
    return this.httpClient.post<Object>(BaseUrl + "/generate/stop",{},httpHeader())
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
