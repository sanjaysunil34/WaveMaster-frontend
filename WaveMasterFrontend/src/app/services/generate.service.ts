import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignalParams } from '../models/signal-params';
import { Observable, catchError, throwError } from 'rxjs';
import { httpError } from '../helpers/http-error';
import { BASE_URL, httpHeader } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class GenerateService {

  constructor(private httpClient:HttpClient) { }

  generateWave(signalData : SignalParams) : Observable<SignalParams>{    
    return this.httpClient.post<SignalParams>(BASE_URL + "/generate/start",JSON.stringify(signalData),httpHeader())
    .pipe(
      catchError(err => httpError(err))
    );
  }

  stopGenerateWave() : Observable<Object>{      
    return this.httpClient.post<Object>(BASE_URL + "/generate/stop",{},httpHeader())
    .pipe(
      catchError(err => httpError(err))
    );
  }

  restoreWave() : Observable<SignalParams>{
    return this.httpClient.get<SignalParams>(BASE_URL + "/generate")
    .pipe(
      catchError(err => httpError(err))
    );
  }
}
