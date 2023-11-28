import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SignalData } from 'src/app/models/signal-data';
import { GenerateService } from 'src/app/services/generate.service';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.scss']
})
export class GenerateComponent{
  generateForm: FormGroup;
  submitted = false;
  freqValue = 100;
  signalTypeReceived = "sine";  
  show : boolean = false

  constructor(fb: FormBuilder,private generateService: GenerateService){

    
    this.generateForm = fb.group({
      'signalType' : ['sine', Validators.required],
      'peakValue': [0,Validators.required],
      'frequencyValue': [0,Validators.required]
    })
    
    this.generateService.restoreWave().subscribe(data => {
      this.generateForm.controls["signalType"].setValue(data.SignalType );
      this.generateForm.controls["peakValue"].setValue(data.PeakToPeak );
      this.generateForm.controls["frequencyValue"].setValue(data.Frequency );
    });
  }

  onSubmitGenerateForm(){  
    this.show = !this.show;
    var sd = new SignalData(this.generateForm.value.frequencyValue,this.generateForm.value.peakValue)
    sd.SignalType = this.generateForm.value.signalType
    this.generateService.generateWave(sd).subscribe();
  }

  stopGenerate(){
    this.show = !this.show;
    this.generateService.stopGenerateWave().subscribe();
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
    if(v.value > 100){
      v.value = 100;
    }else if(v.value < 0){
      v.value = 0;
    }
    this.generateForm.value.frequencyValue = parseFloat(v.value);
  }
}
