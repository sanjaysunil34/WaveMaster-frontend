import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignalData } from '../models/signal-data';
import { Observable, catchError, throwError } from 'rxjs';
import { httpError } from '../helpers/http-error';
import { BASE_URL, httpHeader } from '../config/config';

/**
 * Injectible service that performs the generate functions.
 */
@Injectable({
  providedIn: 'root'
})
export class GenerateService {

  /**
   * Constructor for Generate Service.
   * @param httpClient - Used for sending http requests.
   */
  constructor(private httpClient:HttpClient) { }

  /**
   * Used to send commands to device for generating signals.
   * @param signalData - The signal data used as input for generating the waveform.
   * @returns An observable that emits the updated SignalData received from the backend.
   *          If an error occurs, it is caught and handled.
   */
  generateWave(signalData : SignalData) : Observable<SignalData>{    
    return this.httpClient.post<SignalData>(BASE_URL + "/generate/start",JSON.stringify(signalData),httpHeader())
    .pipe(
      catchError(err => httpError(err))
    );
  }

  /**
   * Used to send STOP GENERATE command
   * @returns An observable representing the response from the backend.
   *          If an error occurs, it is caught and handled.
   */
  stopGenerateWave() : Observable<Object>{      
    return this.httpClient.post<Object>(BASE_URL + "/generate/stop",{},httpHeader())
    .pipe(
      catchError(err => httpError(err))
    );
  }

  /**
   * Used to restore the data of wave generated previously.
   * @returns An observable containing the signal data.
   */
  restoreWave() : Observable<SignalData>{
    return this.httpClient.get<SignalData>(BASE_URL + "/generate")
    .pipe(
      catchError(err => httpError(err))
    );
  }
}
