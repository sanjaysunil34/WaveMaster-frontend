import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignalData } from '../models/signal-data';
import { Observable, catchError, throwError } from 'rxjs';
import { httpError } from '../helpers/http-error';
import { BASE_URL, httpHeader } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class GenerateService {

  constructor(private httpClient:HttpClient) { }

  generateWave(signalData : SignalData) : Observable<SignalData>{    
    return this.httpClient.post<SignalData>(BASE_URL + "/generate/start",JSON.stringify(signalData),httpHeader())
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

  restoreWave() : Observable<SignalData>{
    return this.httpClient.get<SignalData>(BASE_URL + "/generate")
    .pipe(
      catchError(err => httpError(err))
    );
  }
}
