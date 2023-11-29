import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError } from 'rxjs';
import { SignalParams } from '../models/signal-params';
import { ConnectionService } from './connection.service';
import { httpError } from '../helpers/http-error';
import { BASE_URL, httpHeader } from '../config/config';

@Injectable({
  providedIn: 'root'
})

/**
 * service to manage capturing signal data 
 */
export class CaptureService {

  private captureDataSubject = new Subject<any>();
  private captureControlDataSubject = new Subject<any>();
  private readDataSubject = new Subject<any>();

  constructor(private httpClient:HttpClient, private connectionService: ConnectionService) { }

  // Adds listener for receiving plot data
  addPlotDataListener() {
    this.connectionService.hubConnection.on("transferPlotData", (data) => {   
      this.captureDataSubject.next(data);  
    })
  }    

  //Stops the listener for plot data
  stopPlotDataListener() {
    this.connectionService.hubConnection.off("transferPlotData");    
  }    

  //Returns observable for capturing plot data
  getPlotDataSubject() : Observable<any>{
    return this.captureDataSubject.asObservable();
  }

  //Adds a listener for receiving capture control commands
  addCaptureCommandsListener() {
    this.connectionService.hubConnection.on("captureControl", (data) => {
      this.captureControlDataSubject.next(data); 
    })
  }    

  // Stops the listener for capture control commands
  stopCaptureCommandsListener() {
    this.connectionService.hubConnection.off("captureControl");
  }

  // Returns observable for capture control data
  getCaptureControlDataSubject() : Observable<any> {
    return this.captureControlDataSubject.asObservable();
  }

  /**
   * Sends command to start or stop data capture.
   * @param command The command to initiate or halt data capture.
   *                Can have values 'START' or 'STOP'. 
   * @returns An observable of any type
   */
  plotCapture(command: string) : Observable<any> {
    return this.httpClient.post<any>(BASE_URL + "/capture/plotcommand",JSON.stringify(command),httpHeader())
    .pipe(
      catchError(err => (err))
    )
  }

  //Retrieves signal params of the captured signal
  
  /**
   * Retrieves signal params of the captured signal
   * @returns An observable of type SignalParams
   */
  getSignalData() : Observable<SignalParams> {
    return this.httpClient.get<SignalParams>(BASE_URL + "/capture/signaldata")
    .pipe(
      catchError(err => httpError(err))      
    )
  }  

  // Adds a listener for fetching data
  addFetchDataListener() {
    this.connectionService.hubConnection.on("fetchData", (data) => {   
      this.readDataSubject.next(data);  
    })
  }  

  // Stops the listener for fetching data
  stopFetchDataListener() {
    this.connectionService.hubConnection.off("fetchData");
  }   
  
  // Returns observable for fetched data
  getFetchDataSubject() : Observable<any> {
    return this.readDataSubject.asObservable();
  }

  /**
   * Sends data acquisition rate
   * @param rate data acquisition rate to be set
   * @returns An observable of any type.
   */
  sendDataAcquisitionRate(rate : number) : Observable<any> {       
    return this.httpClient.post<any>(BASE_URL + "/capture/rate",JSON.stringify(rate),httpHeader())
    .pipe(
      catchError(err => httpError(err))
    )
  } 
}
