import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignalData } from '../models/signalData';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpError } from '../helpers/HttpError';
import { BaseUrl, HttpHeader } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class GenerateService {

  constructor(private httpClient:HttpClient) { }

  generateWave(signalData : SignalData) : Observable<SignalData>{    
    return this.httpClient.post<SignalData>(BaseUrl + "/generate/start",JSON.stringify(signalData),HttpHeader())
    .pipe(
      catchError(err => HttpError(err))
    );
  }

  stopGenerateWave() : Observable<Object>{      
    return this.httpClient.post<Object>(BaseUrl + "/generate/stop",{},HttpHeader())
    .pipe(
      catchError(err => HttpError(err))
    );
  }

  restoreWave() : Observable<SignalData>{
    return this.httpClient.get<SignalData>(BaseUrl + "/generate")
    .pipe(
      catchError(err => HttpError(err))
    );
  }
}
