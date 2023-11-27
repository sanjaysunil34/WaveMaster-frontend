import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  baseUrl: string = "http://localhost:3000"

  httpHeader={
    headers:new HttpHeaders({
      'Content-Type': 'application/json',      
    })
  }

  public hubConnection: signalR.HubConnection;
  private messageSubject: Subject<string> = new Subject<string>();

  constructor(private httpClient:HttpClient) { 
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:3000/plotValue", {skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets})// Replace with your actual backend URL and hub route
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  getPortName() : Observable<string[]>{
    return this.httpClient.get<string[]>(this.baseUrl + '/configuration')
    .pipe(
      catchError(this.httpError)
    );
  }

  connect(object: Object) : Observable<string>{
    return  this.httpClient.post<string>(this.baseUrl + '/configuration/connect', JSON.stringify(object), this.httpHeader)
    .pipe(
      catchError(this.httpError)
    );
  }

  disconnect() : Observable<Object>{
    return  this.httpClient.post<Object>(this.baseUrl + '/configuration/disconnect',{} ,this.httpHeader)
    .pipe(
      catchError(this.httpError)
    );
  }

  public startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started');
        this.registerEvents();
      })
      .catch((err) => console.error(`Error while starting connection: ${err}`));
  }

  public endConnection() : void {
    this.hubConnection.stop();
  }

  private registerEvents(): void {
    // Define your SignalR hub events here
    this.hubConnection.on('ReceiveMessage', (message: string) => {
      this.messageSubject.next(message);
    });
  }

  httpError(error: HttpErrorResponse) {
      
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.message;
    } else {
      msg = `Error Code : ${error.status}\n${error.error.error}`;
    }
    console.log(msg);
    return throwError(msg);
  }
}
