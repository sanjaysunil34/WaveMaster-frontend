import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss']
})
export class CaptureComponent implements OnDestroy{    
    start: boolean = true
    openAccordion: string = 'collapseOne';

    xAxisScale = new FormControl('0.5')
    yAxisScale = new FormControl('0.5') 
    dataAcquisitionRate = new FormControl(1)

    frequency = new FormControl('')
    peakToPeak = new FormControl('')
    dataPoints:any[] = [];
    timeout:any = null;
    xValue:number = 1;
    yValue:number = 10;
    newDataCount:number = 10;
    chart: any;
   
    chartOptions = {
      theme: "light2",
      title: {
        text: "Live Data"
      },
      data: [{
        type: "line",
        dataPoints: this.dataPoints
      }]
    }

    constructor(private http : HttpClient) {  
    }
    // Toggle accordion items
    toggleAccordion(accordionId: string): void {
      this.openAccordion = this.openAccordion === accordionId ? this.openAccordion : accordionId;
    }
    // Check if an accordion item is open
    isAccordionOpen(accordionId: string): boolean {
      return this.openAccordion === accordionId;
    }
    toggleStartStop(){
      this.start = !this.start
      if(this.start == false){
        this.updateData()
      }
    }

    onXScaleChange(event: any){
      console.log(this.xAxisScale.value)
      //change x-axis scale
    }

    onYScaleChange(event: any){
      console.log(this.yAxisScale.value)
      //change y axis scale
    }

    fetchData(){
      //fetch data from hardware
      this.frequency.setValue('100')
      this.peakToPeak.setValue('5')
    }

    getChartInstance(chart: object) {
      this.chart = chart;
          
      
    }
    
    
    ngOnDestroy() {
      clearTimeout(this.timeout);
    }
   
    updateData = () => {
      this.http.get("https://canvasjs.com/services/data/datapoints.php?xstart="+this.xValue+"&ystart="+this.yValue+"&length="+this.newDataCount+"type=json", { responseType: 'json' }).subscribe(this.addData);
    }
   
    addData = (data:any) => {
      if(this.newDataCount != 1) {
        
        data.forEach( (val:any[]) => {
          console.log(val)
          this.dataPoints.push({x: val[0], y: parseInt(val[1])});
          this.xValue++;
          this.yValue = parseInt(val[1]);  
        })
      } else {
        //this.dataPoints.shift();
        this.dataPoints.push({x: data[0][0], y: parseInt(data[0][1])});
        this.xValue++;
        this.yValue = parseInt(data[0][1]);  
      }
      this.newDataCount = 1;
      this.chart.render();
      this.timeout = setTimeout(this.updateData, 1000);
    }
}
