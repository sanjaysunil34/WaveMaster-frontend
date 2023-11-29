import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import { SignalParams } from '../models/signal-params';
import { ConnectionService } from './connection.service';
import { httpError } from '../helpers/http-error';
import { BASE_URL, httpHeader } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class CaptureService {

  private captureDataSubject = new Subject<any>();
  private captureControlDataSubject = new Subject<any>();
  private readDataSubject = new Subject<any>();

  constructor(private httpClient:HttpClient, private connectionService: ConnectionService) { }

  public addPlotDataListener = () => {
    this.connectionService.hubConnection.on("transferPlotData", (data) => {   
      this.captureDataSubject.next(data);  
    })
  }    

  public stopPlotDataListener = () => {
    this.connectionService.hubConnection.off("transferPlotData");    
  }    

  getPlotDataSubject() {
    return this.captureDataSubject.asObservable();
  }

  public addCaptureCommandsListener = () => {
    this.connectionService.hubConnection.on("captureControl", (data) => {
      this.captureControlDataSubject.next(data); 
    })
  }    

  public stopCaptureCommandsListener = () => {
    this.connectionService.hubConnection.off("captureControl");
  }

  getCaptureControlDataSubject() {
    return this.captureControlDataSubject.asObservable();
  }

  plotCapture(command: string) : any {
    return this.httpClient.post<any>(BASE_URL + "/capture/plotcommand",JSON.stringify(command),httpHeader())
    .pipe(
      catchError(err => (err))
    )
  }

  getSignalData() : Observable<SignalParams> {
    return this.httpClient.get<SignalParams>(BASE_URL + "/capture/signaldata")
    .pipe(
      catchError(err => httpError(err))      
    )
  }  

  public addFetchDataListener = () => {
    this.connectionService.hubConnection.on("fetchData", (data) => {   
      this.readDataSubject.next(data);  
    })
  }  

  public stopFetchDataListener = () => {
    this.connectionService.hubConnection.off("fetchData");
  }   
  
  getFetchDataSubject() {
    return this.readDataSubject.asObservable();
  }

  sendDataAcquisitionRate(rate : number) : any {       
    return this.httpClient.post<any>(BASE_URL + "/capture/rate",JSON.stringify(rate),httpHeader())
    .pipe(
      catchError(err => httpError(err))
    )
  } 
}
