import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { httpError } from '../helpers/http-error';
import { BASE_URL, httpHeader } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  public hubConnection: signalR.HubConnection;
  private messageSubject: Subject<string> = new Subject<string>();

  constructor(private httpClient:HttpClient) { 
    //Initialize signalR hub connection
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:3000/plotValue", {skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets})
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  /**
   * Retrieves all available port names
   * @returns Observable of type string[]
   */
  getPortName() : Observable<string[]>{
    return this.httpClient.get<string[]>(BASE_URL + '/configuration')
    .pipe(
      catchError(err => httpError(err))
    );
  }

  /**
   * Request to establish connection to serial port
   * @param object object containing serial port connection params
   * @returns Observable of type string
   */
  connectSerialPort(object: Object) : Observable<any>{
    return this.httpClient.post<any>(BASE_URL + '/configuration/connect', JSON.stringify(object), httpHeader())
    .pipe(
      catchError(err => httpError(err))
    );
  }

  /**
   * Disconnect from the serial port
   * @returns Observable of type Object
   */
  disconnectSerialPort() : Observable<Object>{
    return  this.httpClient.post<Object>(BASE_URL + '/configuration/disconnect',{} ,httpHeader())
    .pipe(
      catchError(err => httpError(err))
    );
  }
  
  // Start the SignalR hub connection 
  startHubConnection() {
    this.hubConnection
      .start()
      .then(() => {
        this.registerEvents();
      })
      .catch((err) => 
      console.error(`Error while starting connection: ${err}`)
      );
  }

  // End the SignalR hub connection
  endHubConnection() {
    this.hubConnection.stop();
  }

  // Register events for the SignalR hub
  private registerEvents(): void {
    this.hubConnection.on('ReceiveMessage', (message: string) => {
      this.messageSubject.next(message);
    });
  }
}
