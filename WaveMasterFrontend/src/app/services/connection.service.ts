import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { httpError } from '../helpers/HttpError';
import { BaseUrl, HttpHeader } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  public hubConnection: signalR.HubConnection;
  private messageSubject: Subject<string> = new Subject<string>();

  constructor(private httpClient:HttpClient) { 
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:3000/plotValue", {skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets})// Replace with your actual backend URL and hub route
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  getPortName() : Observable<string[]>{
    return this.httpClient.get<string[]>(BaseUrl + '/configuration')
    .pipe(
      catchError(err => httpError(err))
    );
  }

  connect(object: Object) : Observable<string>{
    return  this.httpClient.post<string>(BaseUrl + '/configuration/connect', JSON.stringify(object), HttpHeader())
    .pipe(
      catchError(err => httpError(err))
    );
  }

  disconnect() : Observable<Object>{
    return  this.httpClient.post<Object>(BaseUrl + '/configuration/disconnect',{} ,HttpHeader())
    .pipe(
      catchError(err => httpError(err))
    );
  }

  public startHubConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started');
        this.registerEvents();
      })
      .catch((err) => console.error(`Error while starting connection: ${err}`));
  }

  public endHubConnection() : void {
    this.hubConnection.stop();
  }

  private registerEvents(): void {
    // Define your SignalR hub events here
    this.hubConnection.on('ReceiveMessage', (message: string) => {
      this.messageSubject.next(message);
    });
  }
}
