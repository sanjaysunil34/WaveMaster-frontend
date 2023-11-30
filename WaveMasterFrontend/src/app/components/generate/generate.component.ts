import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SignalParams } from 'src/app/models/signal-params';
import { GenerateService } from 'src/app/services/generate.service';

/**
 * Component for generating and controlling a signal wave.
 */
@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.scss']
})

export class GenerateComponent{
  // Form group for signal generation parameters
  generateForm: FormGroup;
  information: string= " "
  // Flag to control UI display
  show : boolean = false

  defaultDataSubscription: Subscription = new Subscription();

  /**
   * Constructor for GenerateComponent.
   * @param fb - FormBuilder for creating the form group.
   * @param generateService - Service for generating and controlling signal waves.
   */
  constructor(fb: FormBuilder,private generateService: GenerateService){    
    // Initialize the form group with default values and validators
    this.generateForm = fb.group({
      'signalType' : ['sine', Validators.required],
      'peakValue': [0,Validators.required],
      'frequencyValue': [0,Validators.required]
    })
    
    // Restore wave settings from the service when the component is created    
    this.generateService.restoreWave().subscribe(data => {
      this.generateForm.controls["signalType"].setValue(data.signalType );
      this.generateForm.controls["peakValue"].setValue(data.peakToPeak );
      this.generateForm.controls["frequencyValue"].setValue(data.frequency );
    });

    
  }

  /**
   * Handler for submitting the generate form.
   */
  onSubmitGenerateForm(){  
    // Toggle the display flag
    this.show = !this.show;

    var sd = new SignalParams(this.generateForm.value.frequencyValue,this.generateForm.value.peakValue)
    sd.signalType = this.generateForm.value.signalType

    this.generateService.generateWave(sd).subscribe(data => {
      
      this.information = data.message
    });
  }

  /**
   * Stop generating the wave and toggle the display flag.
   */
  stopGenerate(){
    // Toggle the display flag
    this.show = !this.show;
    this.information = " "
    this.generateService.stopGenerateWave().subscribe();
  }

  /**
   * Handle changes in peak value input.
   * @param peak - Event containing the changed value.
   */
  handlePeakChange(peak : any){
    if(this.show){
      this.stopGenerate()
    }
    peak.value = parseFloat(peak.value);

    if(peak.value > 3.3){
      peak.value = 3.3;
    }else if(peak.value < 0){
      peak.value = 0;
    }
    this.generateForm.value.peakValue = parseFloat(peak.value);
  }

  /**
   * Handle changes in frequency value input.
   * @param frequency - Event containing the changed value.
   */
  handleFrequencyChange(frequency : any){
    if(this.show){
      this.stopGenerate()
    }
    frequency.value = parseInt(frequency.value);

    if(frequency.value > 100){
      frequency.value = 100;
    }else if(frequency.value < 0){
      frequency.value = 0;
    }
    this.generateForm.value.frequencyValue = parseInt(frequency.value);
  }

  /**
   * 
   */
  handleSignalChange(){
    if(this.show){
      this.stopGenerate()
    }
  }

  /**
   * handler for the reset button.
   * It requests the backend to read settings from eeprom
   */
  resetToDefault() {
    this.generateService.readFromEEPROM().subscribe(data => {      
      this.generateService.addDefaultDataListener();
      this.defaultDataSubscription = this.generateService.getDefaultDataSubject().subscribe(data => {

        var def = data.trim(';').replace("EEPROM","").split(" ");
        switch (def[0])
        {
            case "1":
                this.generateForm.controls["signalType"].setValue("sine");
                break;
            case "2":
                this.generateForm.controls["signalType"].setValue("square");
                break;
            case "3":
                this.generateForm.controls["signalType"].setValue("triangle");
                break;
            case "4":
                this.generateForm.controls["signalType"].setValue("sawtooth");
                break;
        }
        
        this.generateForm.controls["peakValue"].setValue(parseFloat(def[2]));
        this.generateForm.controls["frequencyValue"].setValue(parseInt(def[1]));
        this.defaultDataSubscription.unsubscribe();   
        this.generateService.stopDefaultDataListener();     
      });
      
    })
  }
  /**
   * To save signal params to eeprom 
   */
  saveToEEPROM(){
    var sd = new SignalParams(this.generateForm.value.frequencyValue,this.generateForm.value.peakValue)
    sd.signalType = this.generateForm.value.signalType

    this.generateService.saveToEEPROM(sd).subscribe()
  }
}
