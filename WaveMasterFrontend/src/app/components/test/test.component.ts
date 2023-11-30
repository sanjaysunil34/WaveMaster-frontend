import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TestService } from 'src/app/services/test.service';

/**
 * Component for testing the components in microcontroller.
 */
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  testForm: FormGroup;
  status: FormControl = new FormControl('')
  command : string = "";
  message : string = "";

  //List of all the components and their corresponing functions to be tested.
  functionArr = {
    "eeprom": ['read', 'write'],
    "ledRed": ['on', 'off'],
    "ledGreen": ['on', 'off'],
    "ledBlue": ['on', 'off'],
    "button1": ['get'],
    "button2": ['get'],
    "capture": [],
    "generate": []
  }

  str = "read"

  selectedFuncArr : any = ['read', 'write'];

  testDataSubscription : Subscription = new Subscription();

  /**
   * Constructor for Test Component.
   * @param fb - FormBuilder for creating the form group.
   * @param testService - Service for testing the components.
   */
  constructor(fb: FormBuilder, private testService: TestService){ 
    this.testForm = fb.group({
      'component' : ['eeprom', Validators.required],
      'function' : ['read', Validators.required],    
    })
  }

  /**
   * Detects the change in component dropdown and occupies the functions
   * corresponding to the selected component in the next dropdown.
   */
  handleComponentChange(){
    var sel = this.testForm.value.component;    
    this.str = this.functionArr[sel as keyof typeof this.functionArr][0];
    this.selectedFuncArr = this.functionArr[sel as keyof typeof this.functionArr];  
    this.status.setValue("");
  }

  /**
   * Triggered on submitting the form, and sends the corresponding commands to the backend.
   * Receives the result obtained from the test hub.
   */
  onSubmitTestForm(){
    this.message = "";
    switch(this.testForm.value.component){
      case "ledGreen": 
        this.command = `LED ${this.testForm.value.function.toUpperCase()} 1;`
        break;
      case "ledRed" :         
        this.command = `LED ${this.testForm.value.function.toUpperCase()} 2;`;
        break;      
      case "ledBlue": 
        this.command = `LED ${this.testForm.value.function.toUpperCase()} 3;`
        break;
      case "eeprom":
        this.command = "EEPROM;";
        break;
      case "button1":
        this.command = "BUTTON 1;"
        break;
      case "button2":
        this.command = "BUTTON 2;"
        break;
      case "capture":
        this.command = "CAPTURE;"
        break; 
      case "generate":
        this.command = "GENERATOR;"
        break; 
    }   

    //Sends the command using http service and then listens to the test hub for results.
    this.testService.testComponent(this.command).subscribe();
    this.testService.addTestDataListener();  
    this.testDataSubscription = this.testService.getTestDataSubject().subscribe(data => {   
      this.status.setValue(this.message + data);     
      this.testService.stopTestDataListener();
      this.testDataSubscription.unsubscribe();
    }); 
  }
}
