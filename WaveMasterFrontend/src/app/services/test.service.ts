import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError } from 'rxjs';
import { ConnectionService } from './connection.service';
import { httpError } from '../helpers/http-error';
import { BASE_URL, httpHeader } from '../config/config';
import { TEST, TEST_HUB } from '../helpers/endpoints';

/**
 * Injectible service that performs test mode related functions.
 */
@Injectable({
  providedIn: 'root'
})
export class TestService {

  private testDataSubject = new Subject<any>();

  /**
   * Constructor for Test Service
   * @param httpClient - Used for sending http requests.
   * @param connectionService - Connection service used for accessing the hub instance.
   */
  constructor(private httpClient:HttpClient, private connectionService: ConnectionService) { }

  /**
   * Used to send commands to device via http post request to backend
   * @param command - This command is sent to the device.
   * @returns An observable that emits the response from backend as string
   *          If an error occurs, it is caught and handled.
   */
  testComponent(command: string) : Observable<string>{
    return this.httpClient.post<string>(BASE_URL + TEST, JSON.stringify(command), httpHeader())
    .pipe(
      catchError(err => httpError(err))
    );
  }

  /**
   * This method attatches a callback to the test event emitted by the hub connection.
   * When the event occurs, data is provided to the testDataSUbject.
   */
  addTestDataListener(){
    this.connectionService.hubConnection.on(TEST_HUB, (data) => {   
      this.testDataSubject.next(data);  
    })
  }  

  /**
   * This method detatches the callback function from test event.
   */
  stopTestDataListener(){
    this.connectionService.hubConnection.off(TEST_HUB);
  }   

  /**
   * This method returns the 'testDataSubject' as an observable. 
   * Observers can subscribe to this observable to receive updates 
   * whenever new test data is emitted through the subject.
   * @returns The testDataSubject as an observable.
   */
  getTestDataSubject() : Observable<any> {
    return this.testDataSubject.asObservable();
  }

}
