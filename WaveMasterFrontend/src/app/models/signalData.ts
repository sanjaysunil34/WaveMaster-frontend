export class SignalData{
    frequency: number
    peakToPeak: number

    constructor(frequency:number,peakToPeak:number){
        this.frequency = frequency
        this.peakToPeak = peakToPeak
    }
}