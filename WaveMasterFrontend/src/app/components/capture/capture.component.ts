import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PlotData } from 'src/app/models/plotData';
import { CaptureService } from 'src/app/services/capture-service.service';


@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss']
})

export class CaptureComponent implements OnDestroy{    
    start: boolean = true
    openAccordion: string = 'collapseOne';
    isCaptureOn : boolean = false;
    i=0;
    xAxisScale = new FormControl(1)
    yAxisScale = new FormControl(1) 
    dataAcquisitionRate = new FormControl(1)

    @Output() captureEvent: EventEmitter<boolean> = new EventEmitter()

    public messages: string[] = [];
    public newMessage: string = '';

    frequency = new FormControl(0)
    peakToPeak = new FormControl(0)
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
        dataPoints: this.dataPoints,
        
      }],
      toolTip: {
        contentFormatter: function (e : any) {
          var content = " ";
          for (var i = 0; i < e.entries.length; i++) {
            content += "Timestamp : " + new Date(e.entries[i].dataPoint.x) + "<br/>" + "Voltage : " + e.entries[i].dataPoint.y + " V";
            content += "<br/>";
          }
          return content;
        }
      },
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
        valueFormatString: "hh:mm:ss:ff",
        gridThickness: 0,
        titleFontSize: 25,
        interval: 1,
        tickLength: 15,
        labelFontSize: 13,
      }
    }

    captureDataSubscription : Subscription = new Subscription();
    fetchDataSubscription : Subscription = new Subscription();
    captureControlDataSubscription : Subscription = new Subscription();

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
        this.isCaptureOn = true;
        this.captureService.plotCapture("START").subscribe();
        this.captureService.addTransferPlotDataListener();  
        this. captureDataSubscription = this.captureService.getCaptureDataSubject().subscribe(data => {
          //console.log(data);                    
          this.addData(data);
        });      
        this.captureControlDataSubscription = this.captureService.getCaptureControlDataSubject().subscribe(data => {
          console.log(data);
          if(data == "STOP CAPTURE"){
            this.start = !this.start;
            //this.captureService.plotCapture("STOP").subscribe();
            this.isCaptureOn = false;
            this.captureService.stopTransferPlotDataListener();
            this.captureDataSubscription.unsubscribe();
            this.captureControlDataSubscription.unsubscribe();
          }
        })
      }else{

        this.isCaptureOn = false;
        this.captureService.plotCapture("STOP").subscribe();

        this.captureService.stopTransferPlotDataListener();
        this.captureDataSubscription.unsubscribe();
        this.captureControlDataSubscription.unsubscribe();
      }
      this.captureEvent.emit(this.isCaptureOn);
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
    }

    onYScaleChange(event: any){
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
    }

    onRateChange(event : any){
      console.log(event.value);
      this.captureService.sendDataAcquisitionRate(event.value).subscribe()
    }

    fetchData(){
      //fetch data from hardware
      this.captureService.getSignalData().subscribe();
      this.captureService.addFetchDataListener();
      this.fetchDataSubscription = this.captureService.getFetchDataSubject().subscribe(data => {
        data = data.substring(data.indexOf("DATA"));
        console.log(data);
        
        this.frequency.setValue( parseFloat(data.split(";")[0].replace("DATA","")))
        this.peakToPeak.setValue( parseFloat(data.split(";")[1].replace("DATA","")))
        this.captureService.stopFetchDataListener();
        this.fetchDataSubscription.unsubscribe();
      });
    }

    getChartInstance(chart: object) {
      this.chart = chart;                
    }
    
    ngOnDestroy() {
      clearTimeout(this.timeout);
      this.captureService.stopTransferPlotDataListener();
      this.captureService.stopFetchDataListener();
    }

    
    addData = (data: PlotData[]) => {
      data.forEach(d => {
        this.dataPoints.push({label: formatDate(new Date(d.time), "hh:mm:ss:SS", 'en-us'), y: d.voltage,x: ++this.i})  
                
        if(this.dataPoints.length > 100){
          this.dataPoints.shift();
        }
      });

      this.chart.render();
      this.timeout = setTimeout(() => {
        if(this.start == false){
          //this.updateData()
        }else{
          console.log(this.start)
          clearTimeout(this.timeout);
        }
      }, 1);
    }
}
