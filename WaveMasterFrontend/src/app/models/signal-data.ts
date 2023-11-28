export class SignalData{
    signalType: string = "sine"
    frequency: number
    peakToPeak: number

    constructor(frequency:number,peakToPeak:number){
        this.frequency = frequency
        this.peakToPeak = peakToPeak
    }
}