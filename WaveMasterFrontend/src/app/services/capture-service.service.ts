import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import { SignalData } from '../models/signalData';
import { ConnectionService } from './connection-service.service';
import { httpError } from '../helpers/HttpError';
import { BaseUrl, HttpHeader } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class CaptureService {

  
  
  private captureDataSubject = new Subject<any>();
  private captureControlDataSubject = new Subject<any>();
  private readDataSubject = new Subject<any>();

  constructor(private httpClient:HttpClient, private connectionService: ConnectionService) { }

  public addTransferPlotDataListener = () => {
    this.connectionService.hubConnection.on("transferPlotData", (data) => {   
      this.captureDataSubject.next(data);  
    })
    this.connectionService.hubConnection.on("captureControl", (data) => {
      this.captureControlDataSubject.next(data); 
    })
  }    

  public stopTransferPlotDataListener = () => {
    this.connectionService.hubConnection.off("captureControl");
    this.connectionService.hubConnection.off("transferPlotData");    
  }      

  getCaptureDataSubject() {
    return this.captureDataSubject.asObservable();
  }

  getCaptureControlDataSubject() {
    return this.captureControlDataSubject.asObservable();
  }

  plotCapture(command: string) : any {
    console.log(command)
    return this.httpClient.post<any>(BaseUrl + "/capture/plotcommand",JSON.stringify(command),HttpHeader())
    .pipe(
      catchError(err => (err))
    )
  }



  getSignalData() : Observable<SignalData> {
    return this.httpClient.get<SignalData>(BaseUrl + "/capture/signaldata")
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
    return this.httpClient.post<any>(BaseUrl + "/capture/rate",JSON.stringify(rate),HttpHeader())
    .pipe(
      catchError(err => httpError(err))
    )
  } 
}
