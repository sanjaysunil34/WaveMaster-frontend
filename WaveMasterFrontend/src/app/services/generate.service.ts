import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignalParams } from '../models/signal-params';
import { Observable, Subject, catchError } from 'rxjs';
import { httpError } from '../helpers/http-error';
import { BASE_URL, httpHeader } from '../config/config';
import { ConnectionService } from './connection.service';

/**
 * Injectible service that performs the generate functions.
 */
@Injectable({
  providedIn: 'root'
})
export class GenerateService {

  private readDefaultSubject = new Subject<any>();

  /**
   * Constructor for Generate Service.
   * @param httpClient - Used for sending http requests.
   */
  constructor(private httpClient:HttpClient, private connectionService: ConnectionService) { }

  /**
   * Used to send commands to device for generating signals.
   * @param signalData - The signal data used as input for generating the waveform.
   * @returns An observable that emits success on generate message.
   *          If an error occurs, it is caught and handled.
   */
  generateWave(signalData : SignalParams) : Observable<any>{    
    return this.httpClient.post<any>(BASE_URL + "/generate/start",JSON.stringify(signalData),httpHeader())
    .pipe(
      catchError(err => httpError(err))
    );
  }

  /**
   * Used to send STOP GENERATE command
   * @returns An observable representing the response from the backend.
   *          If an error occurs, it is caught and handled.
   */
  stopGenerateWave() : Observable<any>{      
    return this.httpClient.post<any>(BASE_URL + "/generate/stop",{},httpHeader())
    .pipe(
      catchError(err => httpError(err))
    );
  }

  /**
   * Used to restore the data of wave generated previously.
   * @returns An observable containing the signal data.
   */
  restoreWave() : Observable<SignalParams>{
    return this.httpClient.get<SignalParams>(BASE_URL + "/generate")
    .pipe(
      catchError(err => httpError(err))
    );
  }

  /**
   * To save data in EEPROM
   * @param signalData The signal data to be saved in eeprom.
   * @returns An observable that emits success on generate message.
   *          If an error occurs, it is caught and handled.
   */
  saveToEEPROM(signalData : SignalParams) : Observable<string>{
    return this.httpClient.post<any>(BASE_URL + "/generate/eepromsave",JSON.stringify(signalData),httpHeader())
    .pipe(
      catchError(err => httpError(err))
    );
  }

  /**
   * Used to restore the default signal settings from eeprom.
   * @returns An observable containing the signal data.
   */
  readFromEEPROM() : Observable<SignalParams>{
    return this.httpClient.get<SignalParams>(BASE_URL + "/generate/eepromread")
    .pipe(
      catchError(err => httpError(err))
    );
  }

  // Adds a listener for fetching default data
  addDefaultDataListener() {
    this.connectionService.hubConnection.on("defaultData", (data) => {   
      this.readDefaultSubject.next(data);  
    })
  }  

  // Stops the listener for fetching default data
  stopDefaultDataListener() {
    console.log("Hub Off");
    this.connectionService.hubConnection.off("defaultData");
  }   
  
  // Returns observable for fetched default data
  getDefaultDataSubject() : Observable<any> {
    console.log("Subject");
    return this.readDefaultSubject.asObservable();
  }
}
