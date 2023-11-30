import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ConnectionParams } from 'src/app/models/connection-params';
import { ConnectionService } from 'src/app/services/connection.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent {
  connectionForm: FormGroup;
  
  // port selected or not 
  portNameEmpty = false;
  errorMessage : string = "";

  //serial port config values
  baudRateValues = [110, 300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 28800, 38400, 56000, 57600, 115200, 230400]
  dataBitValues = [5,6,7,8]
  stopBitValues = [1,1.5,2]
  parityValues = ["even","mark","none","odd","space"]
  portNames : string[] = [];

  //snackbar position config
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  
  constructor(fb: FormBuilder, private connectionService: ConnectionService,
    private _snackBar: MatSnackBar){
    this.connectionForm = fb.group({
      'portName' : [this.portNames[0], Validators.required],
      'stopBit' : [ 1, Validators.required],
      'baudRate' : [ 115200 , Validators.required],
      'dataBit' : [ 8 , Validators.required],
      'parity' : [ "none" , Validators.required]
    })

    connectionService.getPortName().subscribe(data => data.forEach(d => this.portNames.push(d)));    
  }

  openSnackBar(message : string) {

    this._snackBar.open(message, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass : ['config-snackbar'],
      
    });
  }
  
  /**
   * click handler for the connect button. Sends request to open connection with serial port
   */
  onSubmitConnectionForm(){    
    var connectionParams = this.connectionForm.value;   
    this.portNameEmpty = (connectionParams.portName === null) ? true : false;
      
    if(!this.portNameEmpty){
      this.connectionService.connectSerialPort(connectionParams).subscribe((data) => {
        console.log(data.message);
        this.openSnackBar(data.message)
        localStorage.setItem("connectionStatus", "connected")
        
        location.reload();
      },error => {        
        this.errorMessage = error;
      });
    } 
  }
}
