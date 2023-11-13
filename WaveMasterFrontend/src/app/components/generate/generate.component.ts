import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SignalData } from 'src/app/models/signalData';
import { GenerateService } from 'src/app/services/generate.service';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.scss']
})
export class GenerateComponent implements AfterViewInit{
  generateForm: FormGroup;
  submitted = false;
  freqValue = 100;
  // peakValue = new FormControl(0);
  // frequencyValue = new FormControl(0);
  types=["square","sine"]
  constructor(fb: FormBuilder,private generateService: GenerateService){
    this.generateForm = fb.group({
      'signalType' : ['sine', Validators.required],
      'peakValue': [0,Validators.required],
      'frequencyValue': [0,Validators.required]
    })
    
    this.generateService.restoreWave().subscribe(data => {
      console.log(data);      
      
      this.generateForm.get("signalType")?.setValue( "square" );
      this.generateForm.controls["signalType"].setValue(data.signalType );
      console.log(this.generateForm.value)
    });
  }

  ngAfterViewInit(){
    
  }
  onSubmitGenerateForm(){
    console.log(this.generateForm.value);    
  
    var sd = new SignalData(this.generateForm.value.frequencyValue,this.generateForm.value.peakValue)
    sd.signalType = this.generateForm.value.signalType
    this.generateService.generateWave(sd).subscribe();
  }

  handlePeakChange(v : any){
    console.log(v.value);
    if(v.value > 3.3){
      v.value = 3.3;
    }else if(v.value < 0){
      v.value = 0;
    }
    this.generateForm.value.peakValue = parseFloat(v.value);
  }

  handleFrequencyChange(v : any){
    console.log(v.value);
    if(v.value > 1000){
      v.value = 1000;
    }else if(v.value < 100){
      v.value = 100;
    }
    this.generateForm.value.frequencyValue = parseFloat(v.value);
  }
}
