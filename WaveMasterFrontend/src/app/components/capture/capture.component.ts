import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CaptureService } from 'src/app/services/capture-service.service';


@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss']
})
export class CaptureComponent implements OnDestroy{    
    start: boolean = true
    openAccordion: string = 'collapseOne';

    xAxisScale = new FormControl(1)
    yAxisScale = new FormControl(1) 
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
      zoomEnabled: true,
      title: {
        text: "Signal Data",
        fontColor: "#5375C7",
        fontSize: 25
      },
      data: [{
        type: "line",
        xValueType: "dateTime",
        dataPoints: this.dataPoints
      }],
      axisY: {
        title: "Voltage ( Volt )",
        minimum: 0, 
        maximum: 3.3, 
        interval: 0.1,
        tickLength: 15,
        labelFontSize: 13,
        titleFontSize: 25,
       
      },
      axisX: {
        title: "Time",
        gridThickness: 0,
        titleFontSize: 25,
        //interval: 1,
        tickLength: 15,
        labelFontSize: 13,
      }
    }

    constructor(private http : HttpClient, private captureService: CaptureService) {  
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
      //this.chartOptions.axisX.interval = 1 * event.value;
      this.chartOptions.axisX.labelFontSize = 13 * event.value;
      switch(event.value){
        case "0.5": this.chartOptions.axisX.labelFontSize = 10 ;
        break;
        case "1": this.chartOptions.axisX.labelFontSize = 13 ;
        break;
        case "2": this.chartOptions.axisX.labelFontSize = 15 ;
        break;
      }
      //change x-axis scale
    }

    onYScaleChange(event: any){
      console.log(this.yAxisScale.value)
      this.chartOptions.axisY.interval = 0.1 * event.value;
      this.chartOptions.axisY.labelFontSize = 13 * event.value;
      switch(event.value){
        case "0.5": this.chartOptions.axisY.labelFontSize = 10 ;
        break;
        case "1": this.chartOptions.axisY.labelFontSize = 13 ;
        break;
        case "2": this.chartOptions.axisY.labelFontSize = 15 ;
        break;
      }
      this.chart.render();
      //change y axis scale
    }

    fetchData(){
      //fetch data from hardware

      this.captureService.fetchData().subscribe();

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
      //this.http.get("https://canvasjs.com/services/data/datapoints.php?xstart="+this.xValue+"&ystart="+this.yValue+"&length="+this.newDataCount+"type=json", { responseType: 'json' }).subscribe(this.addData);
      this.captureService.getGraphData(this.xValue, this.yValue, this.newDataCount).subscribe(data => {
        //console.log(data);
        
        const min = 0;
        const max = 3.3;
        const precision = 2;
        const randomNum = (Math.floor(Math.random() * (max * 10 ** precision)) / (10 ** precision)).toFixed(precision);

        console.log([[new Date().getTime(), parseFloat(randomNum)]]);        
        this.addData([[new Date().getTime(), parseFloat(randomNum)]]);
        // this.addData(data);
      });
    }
   
    addData = (data:any) => {
      if(this.newDataCount != 1) {
        
        data.forEach( (val:any[]) => {
          console.log(val)
          this.dataPoints.push({x: val[0], y: parseFloat(val[1])});
          this.xValue++;
          this.yValue = parseFloat(val[1]);  
        })
      } else {
        //this.dataPoints.shift();
        this.dataPoints.push({x: data[0][0], y: parseFloat(data[0][1])});
        this.xValue++;
        this.yValue = parseFloat(data[0][1]);  
      }
      this.newDataCount = 1;
      this.chart.render();
      this.timeout = setTimeout(this.updateData, 1000);
    }
}
