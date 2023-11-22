import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import { PlotData } from '../models/plotData';
import { SignalData } from '../models/signalData';

import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class CaptureService {
  baseUrl: string = "http://localhost:3000"

  httpHeader={
    headers:new HttpHeaders({
      'Content-Type': 'application/json',      
    })
  }

  private hubConnection: signalR.HubConnection;
  private messageSubject: Subject<string> = new Subject<string>();
  private dataSubject = new Subject<any>();

  constructor(private httpClient:HttpClient) { 
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:3000/plotValue", {skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets})// Replace with your actual backend URL and hub route
      .configureLogging(signalR.LogLevel.Information)
      .build();

    
   }

   private startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started');
        this.registerEvents();
      })
      .catch((err) => console.error(`Error while starting connection: ${err}`));
  }

  public addTransferPlotDataListener = () => {
    this.startConnection();
    this.hubConnection.on("transferPlotData", (data) => {   
      //console.log(data);    
      this.dataSubject.next(data);  
    })
  }

  getDataSubject() {
    return this.dataSubject.asObservable();
  }

  public stopTransferPlotDataListener = () => {
    this.hubConnection.off("transferPlotData");
    this.endConnection();
  }

  private endConnection() : void {
    this.hubConnection.stop();
  }




  private registerEvents(): void {
    // Define your SignalR hub events here
    this.hubConnection.on('ReceiveMessage', (message: string) => {
      this.messageSubject.next(message);
    });
  }

  getGraphData() : Observable<PlotData> {
    return this.httpClient.get<PlotData>(this.baseUrl + "/capture/plotdata")
    .pipe(
      catchError(this.httpError)
    );
  }

  getSignalData() : Observable<SignalData> {
    return this.httpClient.get<SignalData>(this.baseUrl + "/capture/signaldata")
    .pipe(
      catchError(this.httpError)
    )
  }

  plotCapture(command: string) : any {
    console.log(command)
    return this.httpClient.post<any>(this.baseUrl + "/capture/plotcommand",JSON.stringify(command),this.httpHeader)
    .pipe(
      catchError(this.httpError)
    )
  }

  sendDataAcquisitionRate(rate : number) : any {
       
    return this.httpClient.post<any>(this.baseUrl + "/capture/rate",JSON.stringify(rate),this.httpHeader)
    .pipe(
      catchError(this.httpError)
    )
  } 

  httpError(error: HttpErrorResponse) {
      
    let msg = '';    
    if (error.error instanceof ErrorEvent) {      
      msg = error.error.message;
    } else {
      msg = `Error Code : ${error.status}\n${error.error.error}`;
    }
    console.log(msg);
    return throwError(msg);
  }
}
